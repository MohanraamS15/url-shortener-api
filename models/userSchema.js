const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken');

const UserSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,'please provide the name'],
        trim:true,
        minlength:5
    },
    email:{
        type:String,
        required:[true,'email is mandatory'],
        unique:[true,'there exsist a email ,try login'],
        lowercase:true,
        match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
        ]
    },
    password:{
        type:String,
        required:[true,'Please provide Password'],
        minlength:[6,'Provide the password of minimum length of 6'],
        match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/,
        'Password must contain uppercase, lowercase, number and special character'
        ]
    },
    role:{
        type:String,
        enum:['admin','user'],
        default:'user'
    }

});


UserSchema.pre('save',async function (){
    if(!this.isModified('password')) return ;
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
})

UserSchema.methods.createJWT=function(){
    return jwt.sign({
        userId:this._id,
        name:this.name,
        role:this.role
    },
    process.env.JWT_SECRET,
    {
        expiresIn:'10d'
    }
    );
}

UserSchema.methods.comparePassword = async function(checkPassword){
    const isMatch=await bcrypt.compare(checkPassword,this.password);
    return isMatch;
}

module.exports=mongoose.model('User',UserSchema);