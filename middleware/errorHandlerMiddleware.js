
const errorHandler =(err,req,res,next)=>{
    console.log(err);

    statusCode= err.statusCode || 500;
    msg=err.message || 'Server Not Found';

    res.status(statusCode).json({
        msg:msg
    })
}

module.exports=errorHandler