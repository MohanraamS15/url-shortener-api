const cron=require('node-cron')

const Url=require('../models/urlSchema');

cron.schedule('0 0 * * *',async()=>{

    try{
        console.log('Cleaning up');

        const oneWeekAgo=new Date(
            Date.now() - 7*24*60*60*1000
        );

        await Url.deleteMany({
            lastAccessedAt:{$lt:oneWeekAgo}
        });
    }
    catch(err){
        console.log(err);
    }
})

