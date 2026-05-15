const Url=require('../models/urlSchema')
const {nanoid}=require('nanoid');
const {BadRequestError,NotFoundError}=require('../errors');

const urlCreate=async (req,res)=>{
    
    if(!req.body.url){
        throw new BadRequestError('Please provide URL');
    }

    const shortCode=nanoid(6);
    const existingUrl=await Url.findOne({
        url:req.body.url
    });

    if(existingUrl){
        return res.status(200).json({
            id:existingUrl._id,
            url:existingUrl.url,
            shortCode:existingUrl.shortCode,
            createdAt:existingUrl.createdAt,
            updatedAt:existingUrl.updatedAt,
            accessCount:existingUrl.accessCount,
            lastAccessedAt:existingUrl.lastAccessedAt
        });
    }


    const url=await Url.create({...req.body,shortCode});
    console.log(url);
    const responseData={
        id:url._id,
        url:url.url,
        shortCode:url.shortCode,
        createdAt:url.createdAt,
        updatedAt:url.updatedAt,
        accessCount:url.accessCount,
        lastAccessedAt:url.lastAccessedAt
    }

    res.status(201).json(responseData);
}

const urlGet=async (req,res)=>{
    const shortCode=req.params.id;
    const url=await Url.findOne({
        shortCode:shortCode
    })

    if(!url){
        throw new NotFoundError('Please provide URL');
    }

    url.accessCount+=1
    url.lastAccessedAt=Date.now()
    await url.save();

    const responseData = {
        id:url._id,
        url: url.url,
        shortCode: url.shortCode,
        createdAt: url.createdAt,
        updatedAt: url.updatedAt
    }
    res.redirect(url.url);

    // return res.status(200).json(responseData);

}

const urlGetAll=(req,res)=>{
    res.send('got all url');
}

const urlUpdate=async (req,res)=>{
    const shortCode=req.params.id;
    const url=await Url.findOneAndUpdate({
        shortCode:shortCode,
        
    },{...req.body},{
        new:true,
        runValidators:true
    })
    .select('-accessCount')

    if(!url){

        return res.status(404).json({
            msg:"resource not found"
        })
    }

    const responseData = {
        id:url._id,
        url: url.url,
        shortCode: url.shortCode,
        createdAt: url.createdAt,
        updatedAt: url.updatedAt
    }

    res.status(200).json(url);
}

const urlDelete=async (req,res)=>{
    const shortCode=req.params.id;

    const url=await Url.findOneAndDelete({
        shortCode:shortCode
    })

    if(!url){
        throw new NotFoundError('resource not found');
    }
    res.status(204).send('');
}

const urlGetStat=async (req,res)=>{
    const shortCode=req.params.id;

    const url=await Url.findOne({
        shortCode:shortCode
    });

    if(!url){
        throw new NotFoundError('resource not found');
    }

    const {_id,url:originalUrl,createdAt,updatedAt,accessCount,
        lastAccessedAt}=url;

    return res.status(200).json({
        id:_id,
        url:originalUrl,
        shortCode,
        createdAt,
        updatedAt,
        accessCount,
        lastAccessedAt
    })

    

}

module.exports={
    urlCreate,urlGet,urlUpdate,urlDelete,urlGetAll,urlGetStat
};