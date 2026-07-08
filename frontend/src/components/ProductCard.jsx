import React from 'react'
import { IndianRupee, ShoppingCart } from 'lucide-react'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setCart } from '@/redux/productSlice'
import axios from 'axios'   
import { useNavigate } from 'react-router-dom'  
const ProductCard = ({ product, loading }) => {
    const { productImg, productName, productPrice } = product 
    const accessToken = localStorage.getItem("accessToken")
    const dispatch=useDispatch()
    const navigate=useNavigate()

    const addToCart=async(productId)=>{
        try{
            const res=await axios.post("${import.meta.env.VITE_URL}/api/v1/cart/add",{
                productId
            },{
                headers:{
                    Authorization: `Bearer ${accessToken}`
                }
            })
            if(res.data.success){
                toast.success("Product added to cart")
                dispatch(setCart(res.data.cart))
            }
        }
        catch(error){
            console.log(error)
        }
    }

    return (
        <div className="shadow-lg rounded-lg overflow-hidden h-max">
            <div className="w-full h-full aspect-square overflow-hidden">
                 {
                    loading ? <Skeleton className='rounded-lg w-full h-full' /> : <img
                        onClick={() => navigate(`/products/${product._id}`)}
                        src={productImg[0]?.url}
                        alt=""
                        className="w-full h-full transition-transform duration-300 hover:scale-105"
                    />
                }
            </div>
            {
                loading ? <div className='px-2 space-y-2 my-2'>
                    <Skeleton className='w-[200px] h-4' />
                    <Skeleton className='w-[100px] h-4' />
                    <Skeleton className='w-[150px] h-8' />
                </div> :
                    <div className='px-2 space-y-1'>
                        <h1 className='font-semibold line-clamp-2 h-12'>{productName}</h1>
                        <h2 className='font-bold'>₹{productPrice}</h2>
                        <Button onClick={() => addToCart(product._id)} className='bg-pink-600 mb-3 w-full'><ShoppingCart className='mr-2' /> Add to Cart</Button>
                    </div>
            }
        </div>
    )
}

export default ProductCard