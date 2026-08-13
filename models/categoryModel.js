import mongoose from 'mongoose'
const categorySchema=new mongoose.Schema({
    name:{
        type: String,
        // required:true,
        // unique:true
    },
    //using slugify library use "npm install slugify" it is very best for SEO search engine 
    //optimization install it in terminal node server-->root
    //it is used for searching the things it romves spacing from string
    slug:{
      type:String,
      lowercase:true
    }
}
)

export default mongoose.model('Category',categorySchema);