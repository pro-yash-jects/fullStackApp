import jwt from 'jsonwebtoken'

export const authenticate = async (req,res,next)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader){
        res.status(400).json({message: "Token not found"});
        console.log("token wasn't provided")
        return;
    }
    const token = authHeader.split(' ')[1];
    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
    }
    catch(err){
        res.status(400).send("invalid signature"); 
        return}
    
    next();
}

export const authorizeAdmin = async (req,res,next) =>{
    if (req.user.role !== "admin"){
        res.status(403).json({message:"Unauthorized"})
        return;
    }
    next();
    
}