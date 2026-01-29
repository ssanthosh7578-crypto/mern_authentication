import { authenticationmodel } from "./schemamodel.js";
export const userData=async(req,res)=>{
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user=await authenticationmodel.findById(userId)
        if(!user){
            return res.status(404).json({message:'user not found'})
        }
        res.json({
            success:true,
            userData:{
                name:user.name,
                isAccountVerified:user.isAccountVerified
            }
        });
        
    } catch (error) {
        res.status(500).json({message:error.message})   
    }
}