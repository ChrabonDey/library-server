import mongoose from "mongoose"
const booksSchema=new mongoose.Schema({
    title:{type:String,required:true},
    author: { type: String, required: true },
   genre: { type: String, required: true },
   isbn: { type: String, required: true },
   description: { type: String },
   copies: { type: Number, required: true },
   available: { type: Boolean, default: true },
})

export default mongoose.model('Book',booksSchema)