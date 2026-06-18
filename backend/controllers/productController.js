import { Product } from "../models/productModel.js"
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

export const addProduct = async (req, res) => {
  try {
    const { productName, productDesc, productPrice, category, brand } = req.body;
    const userId = req.id;

    // Validate required fields
    if (!productName || !productDesc || !productPrice || !category || !brand) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Handle multiple image uploads
    let productImg = [];
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const fileUri = getDataUri(file);
        const result = await cloudinary.uploader.upload(fileUri, {
          folder: "mern_products", // 👈 Cloudinary folder name
        });
        // save both url + public_id
        productImg.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    // Create product in DB
    const newProduct = await Product.create({
      userId,
      productName,
      productDesc,
      productPrice,
      category,
      brand,
      productImg, // array of objects {url, public_id}
    });

    return res.status(200).json({
      success: true,
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllProduct=async(_,res)=>{
    try{
        const products=await Product.find();
        if(!products){
            return res.status(404).json({
                success:false,
                message:"No products found",
                products:[]
            })
        }
        return res.status(200).json({
            success:true,
            products
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const deleteProduct = async(req,res)=>{
    try{
        const {productId} = req.params;
        const product=await Product.findById(productId);
        if(!product){
            return res.status(404).json({
                success:false,
                message:"Product not found"
            })
        }
        //delete images from cloudinary
        if(product.productImg && product.productImg.length > 0){
            for(let img of product.productImg){
                const result=await cloudinary.uploader.destroy(img.public_id); 
        }
    }
    //delete product from DB
    await Product.findByIdAndDelete(productId);
    return res.status(200).json({
        success:true,
        message:"Product deleted successfully"
    })

  }  catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const updateProduct = async(req,res)=>{
    try {   
        const {productId} = req.params;
        const { productName, productDesc, productPrice, category, brand ,existingImages} = req.body;

        const product=await Product.findById(productId);

        //check if product exists
        if(!product){
            return res.status(404).json({
                success:false,
                message:"Product not found"
            })
        }

        let updatedImages=[];

        //Keep existing images that user wants to retain
        if(existingImages){
            const keepIds=JSON.parse(existingImages);
            updatedImages=product.productImg.filter((img)=>
                keepIds.includes(img.public_id)
        )

        //delete only removed images
        const removedImages=product.productImg.filter(
            (img)=>!keepIds.includes(img.public_id)
        );
        for(let img of removedImages){
            await cloudinary.uploader.destroy(img.public_id);
        }
    }
        else{
            updatedImages=product.productImg; //if no existingImages provided, keep all current images
            
        }
        //upload new images if any
        if(req.files && req.files.length > 0){
            for(let file of req.files){
                const fileUri=getDataUri(file);
                const result=await cloudinary.uploader.upload(fileUri,{
                    folder:"mern_products"
                });
                updatedImages.push({
                    url:result.secure_url,
                    public_id:result.public_id
                })
            }
        }

        //update product
        product.productName=productName || product.productName;
        product.productDesc=productDesc || product.productDesc;
        product.productPrice=productPrice || product.productPrice;
        product.category=category || product.category;
        product.brand=brand || product.brand;
        product.productImg=updatedImages;

        await product.save();
        return res.status(200).json({
            success:true,
            message:"Product updated successfully",
            product
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}