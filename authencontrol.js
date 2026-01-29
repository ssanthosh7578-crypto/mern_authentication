import dotenv from "dotenv";
dotenv.config();


import jwt from "jsonwebtoken"
import { authenticationmodel } from "./schemamodel.js"
import bcrypt from "bcryptjs"
import transport from "./Nodemailer.js"



export const registration = async (req, res) => {
    try {
        let { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).send("Enter all required fields");
        }

        // normalize email
        email = email.toLowerCase();

        const already = await authenticationmodel.findOne({ email });
        if (already) {
            return res.status(409).send("Email already registered");
        }

        const hashpassword = await bcrypt.hash(password, 10);

        const user = new authenticationmodel({
            name,
            email,
            password: hashpassword
        });

        await user.save();

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const emailoption = {
            from: process.env.SEND_EMAIL,
            to: email,
            subject: "Successfully Registered",
            text: `Welcome ${name}, you are registered with ${email}`
        };

        await transport.sendMail(emailoption);

        return res.status(201).json({success:true, message:"User registered successfully"});

    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({success:false, message:error.message || "Registration failed"});
    }
};

export const login=async (req,res)=>{
    const {email,password}=req.body
    if(!email || !password){
        return res.status(400).json({success:false, message:"Enter the email and password"});
    }
    try {
        const check=await authenticationmodel.findOne({email})
         if(!check){
            return res.status(401).json({success:false, message:"Enter correct email"})
        }
        const unhash=await bcrypt.compare(password,check.password)
        if(!unhash){
            return res.status(401).json({success:false, message:"Enter correct password"})
        }
        const token=jwt.sign({id:check._id},process.env.JWT_SECRET,{expiresIn:'7d'})
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?'none':'strict',
            maxAge:7*24*60*60*1000
        })
        return res.json({success:true, message:"User logged in successfully", token})
    } catch (error) {
        return res.status(500).json({success:false, message:error.message || "Login failed"})
    }

    }

export const logout=(req,res)=>{
    try {
         res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?'none':'strict',
          
        })
        return res.json({success:true, message:"User logged out successfully"})
    } catch (error) {
     return res.status(500).json({success:false, message:error.message || "Logout failed"})   
    }
}
export const userverfication = async (req, res) => {
    try {
        const userId = req.body?.userId || req.userId;

        const user = await authenticationmodel.findById(userId);
        if (!user) {
            return res.status(200).json({ success:false, message: "User not found" });
        }

        if (user.isAccountVerified) {
            return res.json({ message: "Account already verified" });
        }

        const otp = String(Math.floor(1000 + Math.random() * 9000));

        user.verifyotp = otp;
        user.verifyotpExpire = Date.now() + 24 * 60 * 60 * 1000;
        await user.save();

        const sendmail = {
            from: process.env.SEND_EMAIL,
            to: user.email,
            subject: "Email Verification OTP",
            html: `
                <h2>Email Verification</h2>
                <p>Your OTP code is: <strong>${otp}</strong></p>
                <p>This code is valid for 24 hours.</p>
                <p>Do not share this code with anyone.</p>
            `,
            text: `Your OTP is ${otp}. It is valid for 24 hours.`,
        };

        try {
            const info = await transport.sendMail(sendmail);
            console.log("Email sent successfully:", info.messageId);
            return res.json({ success:true, message: "OTP sent to your email" });
        } catch (emailError) {
            console.error("Email sending failed:", emailError);
            return res.status(200).json({ success:false, message: "Failed to send email", details: emailError?.message || String(emailError) });
        }

    } catch (error) {
        console.error('userverfication error:', error);
        return res.status(200).json({ success:false, message: error?.message || 'Internal error' });
    }
};
export const otpverification = async (req, res) => {
  try {
    const { otp } = req.body

    // 🔐 user id must come from auth middleware
    const userId = req.user?.id

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "Please enter OTP"
      })
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      })
    }

    const user = await authenticationmodel.findById(userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    if (!user.verifyotp || user.verifyotp !== String(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      })
    }

    if (user.verifyotpExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired"
      })
    }

    user.verifyotp = null
    user.verifyotpExpire = null
    user.isAccountVerified = true

    await user.save()

    return res.status(200).json({
      success: true,
      message: "Account verified successfully"
    })
  } catch (error) {
    console.error('otpverification error:', error)
    return res.status(500).json({
      success: false,
      message: "Verification failed"
    })
  }
}

export const resetotp=async (req,res)=>{
    const {email}=req.body
    if(!email){
        return res.status(404).send("no emial is available")
    }
    try {
        const user=await authenticationmodel.findOne({email})
        if(!user){
          return res.status(404).send("no user is availble in db")
        }
        const otp=String(Math.floor(10000+Math.random()*90000))
        user. resetotp=otp
        user.resetotpExpire=Date.now()+ 15* 60 * 1000;
        await user.save()
        const reset={
            from: process.env.SEND_EMAIL,
            to: user.email,
            subject: "Email resend  OTP",
            text: `Your OTP is ${otp}. It is valid for 15minutes.`,
        
        }
        await transport.sendMail(reset);
       
        return res.status(200).send("otp is sended success")
    } catch (error) {
        return res.status(500).send(error)
    }
    
}
export const resetemail=async (req,res)=>{
    const {email,otp,resetpassword}=req.body
    if(!email || !otp || !resetpassword){
        return res.status(400).send("email or otp is required")
    }
    try {
        const user=await authenticationmodel.findOne({email})
        if (!user){
            return res.status(404).send("no user is found")
        }
        if(!user.resetotp || user.resetotp!==otp){
            return res.status(404).send("no otp is not-found")
        }
        if(user.resetotpExpire < Date.now()){
            return res.status(404).send("otp is expired")
        }
        const hash = await bcrypt.hash(resetpassword,10)

        user.password=hash;
        user.resetotpExpire=null;
        user.resetotp=null;
        await user.save();
        return res.status(200).json({
  success: true,
  message: "Password reset successfully"
});

    } catch (error) {
         return res.status(500).send(error)
    }
}
export const isAuthenticated=async(req,res)=>{
    try {
        return res.status(200).json({authenticated:true});  
    } catch (error) {
        res.status(500).json({authenticated:false});
    }}