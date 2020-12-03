const router=require("express").Router()
const User=require("../models/Usermodel")
const bcrypt=require('bcryptjs');
const e = require("express");
const jwt=require("jsonwebtoken")
const auth=require("../middleware/authorize")
//handle register
router.post('/register',async(req,res)=>{
    try
        {   
            //destruturing the field
            const{email,password,confirmpassword,name}=req.body;//these we get after user post the field
            //validation
            if(!email||!password||!confirmpassword){
                return res.status(400).json({msg:"all fields required"})}
            if(password.length<5){
                return res.status(400).json({msg:"password must be at least 5 char"})}
            if(password!=confirmpassword){
                return res.status(400).json({msg:"password do not match"})}
            const userexist=await User.findOne({email:email})
            //if found
            if(userexist){
                return res.status(400).json({msg:"user already exist"})
            }
            //if(!name){name=email}
            //hash password
            const salt=await bcrypt.genSalt()
            const hashpassword=await bcrypt.hash(password,salt)

            //save the user
            const newUser=new User({
                email:email,
                password:hashpassword,
                name:name
            });
            const savedUser=await newUser.save()
            res.json(savedUser)
        }
    catch(err){
        res.status(500).json({error:err.message})
    }
})

//route to login
router.post("/login",async(req,res)=>{
    try{
        const {email,password}=req.body//fields we get when user hit login
        //check if all field match
        //if user dont enter fileds
        if(!email || !password){
            return res.status(400).json({msg:"please enter all fileds"})
        }
        //find the user
        const user=await User.findOne({email:email})
        //if user is not found
        if (!user){
            return res.status(400).json({msg:"user not registered"})
        }
        //now match the password
        const passmatch=await bcrypt.compare(password,user.password)
        //if not match password
        if(!passmatch){
            return res.status(400).json({msg:"password inccorect"})
                }
        
        //if all went right
        //authorize the user
        //jwt use token insted of cookies to authorize
        const webtkn=jwt.sign({id:user._id},process.env.jwt_key)
        res.json({
            webtkn,
            user:{
                id:user._id,
                email:user.email,
            }
        })

    }catch(err){
        res.status(500).json({error:err.message})
    }
})

router.post("/IsTokenValid?",async(req,res)=>{
    try{
        const webtkn=req.header("x-auth-token");
        if(!webtkn){
            return res.json(false)

        }
        const verified=jwt.verify(webtkn,process.env.jwt_key)//compares user token and our token in backend
        if(!verified){
            return res.json(false)
        }
        //verify again that user exit in database
        const user=await User.findById(verified.id)
        if(!user){
            return res.json(false)

        }
        return res.json(true)
    }catch(err){
        res.status(500).json({error:err.message})
    }
})
//get user
router.get("/",auth,async(req,res)=>{
    const user=await User.findById(req.user)
    res.json(user)
})

module.exports=router;