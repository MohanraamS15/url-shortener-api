
const errorHandler =(err,req,res,next)=>{
    console.log(err);

    statusCode= err.statusCode || 500;
    msg=err.message || 'Server Not Found';
    console.log(err.kind);

    if(err.code === 11000){
        
        msg =`there is already a user with mail id '${err.keyValue.email}'`

        statusCode = 400;
    }
    res.status(statusCode).json({
        msg:msg
    })
}

module.exports=errorHandler