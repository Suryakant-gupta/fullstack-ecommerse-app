import mongoose from 'mongoose';

const connectdb = async()=>{

    mongoose.connection.on('connected' , ()=>{
        console.log('DB connected successfully');
        
    })

    await mongoose.connect(`${process.env.MONGODB_URI}/ecom`)

}


export default connectdb;