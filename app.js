require('dotenv').config();

const express=require('express');
const app=express();

const connectDB=require('./db/connect');
const urlRouter=require('./routes/urlRoute');

require('./cron/deleteInactiveURL');
const notFound=require('./middleware/notFoundMiddleware');
const errorHandler=require('./middleware/errorHandlerMiddleware');

app.use(express.json());

app.use('/shorten',urlRouter);

app.use(notFound)
app.use(errorHandler)

port=process.env.PORT || 5000
const start=async ()=>{
    await connectDB(process.env.MONGO_URI);
    app.listen(port,()=>{
        console.log('Server is running....');  
    })

}

start();
