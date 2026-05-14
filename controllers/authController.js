
const User=require('../models/UserSchema')
const {BadRequestError,UnauthenticatedError,NotFoundError}=require('../errors'); 
const register=async (req,res)=>{

    const user=await User.create(req.body); 
    
    const token = user.createJWT();

    // console.log(token);
    return res.status(201).json({
        name:user.name,
        email:user.email,
        token:token
    });
 
    
}

const login=async (req,res)=>{
    const {email,password}=req.body;

    if(!email || !password){
        throw new BadRequestError('Provide email and password');
    }
    const user=await User.findOne({email});

    

    if(!user){
        throw new UnauthenticatedError("provide valid credentials");
        // return res.status(400).send(`there is no user with email ${email}`);
    }


    //compare password
    const isPasswordMatch=await user.comparePassword(password);

    if(!isPasswordMatch){
        throw new UnauthenticatedError("provide valid credentials");
    }

    const token = user.createJWT();


    return res.status(200).json({
        name:user.name,
        token:token
    });
}

module.exports={register,login};