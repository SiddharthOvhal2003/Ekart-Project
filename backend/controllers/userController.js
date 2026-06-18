import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Session } from "../models/sessionModel.js";
import { verifyEmail } from "../emailVerify/verifyEmail.js";
import { sendOTPMail } from "../emailVerify/sendOtpMail.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json(
                {
                    success: false,
                    message: "All fields are required"
                }
            )
        }

        const user = await User.findOne({ email });
        // Check if user already exists
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password,10);



        // Create new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword
        })
        //Generate JWT token
        const token=jwt.sign({id:newUser._id},process.env.SECRET_KEY,{expiresIn:'10m'})
        verifyEmail(token,email) // send email here
        newUser.token=token // save token in database for verification

        await newUser.save();
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user:newUser
        })
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const verify = async (req,res) =>{
    try {
        const authHeader=req.headers.authorization
        
        // Check if authorization header is present and starts with "Bearer "
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            res.status(400).json({
                success:false,
                message:"Authorization token is missing or invalid"
            })
        }

        const token=authHeader.split(" ")[1] // [Bearer , fusdfgsdfkdjfgbsdf]
        let decoded;
        try {
            decoded = jwt.verify(token,process.env.SECRET_KEY)
        } catch (error) {
            if(error.name === "TokenExpiredError"){
                return res.status(400).json({
                    success:false,
                    message:"The registration token has expired"
                })
            }
            return res.status(400).json({
                success:false,
                message:"Token verification failed"
            })
            
        }

        const user = await User.findById(decoded.id)
        // Check if user exists
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
        }

       user.token=null
       user.isVerified=true
       await user.save()
         return res.status(200).json({
            success:true,
            message:"Email verified successfully"
         })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message: error.message })
    }
}

export const reVerify=async(req,res) =>{
    try {
        const {email}=req.body
        const user=await User.findOne({email})

        // Validate email
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
        }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '10m' })
    verifyEmail(token, email) // send email here    

    user.token=token
    await user.save();
    return res.status(200).json({
        success:true,
        message:"Verification email sent again successfully",
        token:user.token
    })


    } catch (error) {
        return res.status(500).json({
            success:false,
            error:error.message
        })
    }
}

export const login= async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Email and password are required"
            })
        }
        // Check if user exists
        const existingUser=await User.findOne({email})
        if(!existingUser){
            return res.status(400).json({
                success:false,
                message:"User not exists"
            }) 
        }

        //Check the password 
        const isPasswordValid=await bcrypt.compare(password,existingUser.password)
        if(!isPasswordValid){
            return res.status(400).json({
                success:false,
                message:"Invalid password"
            })
        }

        //Check user is verified or not
        if(existingUser.isVerified===false){
            return res.status(400).json({
                success:false,
                message:"Verify your account than login"
            })
        }
        //Generate JWT token for login
        const accessToken=jwt.sign({id:existingUser._id},process.env.SECRET_KEY,{expiresIn:'10d'});
        const refreshToken=jwt.sign({id:existingUser._id},process.env.SECRET_KEY,{expiresIn:'30d'})

        existingUser.isLoggedIn=true;
        await existingUser.save();

        //Existing session and delete it if exists because we want only one session for one user
        const existingSession=await Session.findOne({userId:existingUser._id})
            if(existingSession){
                await Session.deleteOne({userId:existingUser._id}) // delete existing session
            }

       // Create new session in database
        await Session.create({userId:existingUser._id}) // create session in database
        return res.status(200).json({
          success: true,
            message: `Welcome back ${existingUser.firstName}`,
            user: existingUser,
            accessToken,
            refreshToken
        })
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const logout = async (req, res) => {
    try {
        const userId = req.id
        await Session.deleteMany({ userId: userId })
        await User.findByIdAndUpdate(userId, { isLoggedIn: false })
        return res.status(200).json({
            success: true,
            message: 'User logged out successfully'
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const forgotPassword = async(req,res)=>{
    try{
        const {email}=req.body;
        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
        }
        const otp=Math.floor(100000 + Math.random() * 900000).toString() // generate 6 digit otp
        const otpExpiry=new Date(Date.now()+10*60*1000) // otp expiry time 10 minutes
        user.otp=otp
        user.otpExpiry=otpExpiry
        await user.save()
        // send otp to email
        await sendOTPMail(otp,email)
        return res.status(200).json({
            success:true,
            message:"OTP sent to email successfully"
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const verifyOTP= async(req,res)=>{
    try{
        const {otp}=req.body;
        const email=req.params.email
        if(!otp){
            return res.status(400).json({
                success:false, 
                message:"OTP is required" 
            })
        }
        const user=await User.findOne({email})
        // Validate user
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Otp is not generated or already verified"
            })
        }
        // Validate OTP
        if(!user.otp || !user.otpExpiry){
            return res.status(400).json({
                success:false,
                message:"OTP is not generated or already verified"
            })
        }

        //OTP expiry time validation
        if(user.otpExpiry < new Date()){
            return res.status(400).json({
                success:false,
                message:"OTP has expired please generate a new one"
            })
        }

        //Otp verification
        if(otp !== user.otp){
            return res.status(400).json({
                success:false,
                message:"Otp is invalid"
            })
        }
        user.otp=null
        user.otpExpiry=null
        await user.save()
        return res.status(200).json({
            success:true,
            message:"OTP verified successfully"
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const changePassword = async (req, res) => {
    try {
        const { newPassword, confirmPassword } = req.body
        const { email } = req.params
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found'
            })
        }
        if (!newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Password do not match'
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        await user.save()
        return res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const allUser= async(_,res)=>{
    try{
        const users=await User.find();
        return res.status(200).json({
            success:true,
            users
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const getUserById=async(req,res)=>{
    try{    
        const {userId}=req.params; //extract userId from req.params
         const user=await User.findById(userId).select("-password -otp -otpExpiry -token") // exclude password, otp, otpExpiry and token fields
         if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
         }
         res.status(200).json({
            success:true,
            user
         })                
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

export const updateUser = async (req, res) => {
    try {
        const userIdToUpdate = req.params.id; // the ID of the user we want to update
        const loggedInUser = req.user;        // from isAuthenticated middleware
        const { firstName, lastName, address, city, zipCode, phoneNo, role } = req.body;

        console.log("Logged-in user ID:", loggedInUser._id.toString());
        console.log("Requested user ID:", userIdToUpdate);

        // Check permission: only self or admin can update
        if (
            loggedInUser._id.toString() !== userIdToUpdate &&
            loggedInUser.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to update this profile",
            });
        }

        // Find user
        let user = await User.findById(userIdToUpdate);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        let profilePicUrl = user.profilePic;
        let profilePicPublicId = user.profilePicPublicId;

        // If a new file is uploaded
        if (req.file) {
            if (profilePicPublicId) {
                await cloudinary.uploader.destroy(profilePicPublicId);
            }

            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "profiles" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(req.file.buffer);
            });

            profilePicUrl = uploadResult.secure_url;
            profilePicPublicId = uploadResult.public_id;
        }

        // Update fields
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.address = address || user.address;
        user.city = city || user.city;
        user.zipCode = zipCode || user.zipCode;
        user.phoneNo = phoneNo || user.phoneNo;
        user.role = role;
        user.profilePic = profilePicUrl;
        user.profilePicPublicId = profilePicPublicId;

        const updatedUser = await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
