const validator=require('validator')


const validateURL=(req,res,next)=>{

const url=req.body.url;

    if(!url){
        return res.status(400).json({
            msg:"provide URL"
        })
    }

    const val=validator.isURL(req.body.url,{
        protocols:['http','https'],
        require_protocol:true
    })

    if(!val){
        return res.status(400).json({
            msg:"Invalid URL"
        })
    }

    console.log('done');

    next();

}

module.exports=validateURL;


