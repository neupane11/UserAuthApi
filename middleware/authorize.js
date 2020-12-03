const jwt=require("jsonwebtoken")

//function to authorize
const authorize=(req,res,next)=>{
    try{
        const webtkn=req.header("x-auth-token")
        if(!webtkn)
        return res.status(401).json({msg:"no token,authorize denied"})
    const verified=jwt.verify(webtkn,process.env.jwt_key)
    //if not verified
    if(!verified){
        return res.status(401).json({msg:"not verified"})
    }
    req.user=verified.id
    next()
    }catch(err){
        res.status(500).json({error:err.message})
    }
}
module.exports=authorize