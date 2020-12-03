const mongoose =require('mongoose')

const connectToDB=async()=>{
    try{
        const conncect=await mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser:true,
            useCreateIndex:true,
            useUnifiedTopology:true
            
        })
        console.log(`MOngoDB connected..`)
    }catch(err){
        console.log(`Error conectig: ${err.message}`)
    }
}
module.exports=connectToDB