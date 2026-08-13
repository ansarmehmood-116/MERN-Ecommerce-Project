// const mongoose = require('mongoose');
import mongoose from "mongoose";

const CarouselSchema = new mongoose.Schema({
  text: {
    type: String,
  },
  //__________________________________
  detail: {
    type: String,
  },
  //__________________________________
   //we also can use photo instead of url both are best if you choose any one but in products
  //model we have used photo here i will use url

  photo: {
    data: Buffer,
    contentType: String,
    // required: true // Assuming the photo field is required
  },
  // src:
  // {
  //     type: String,
  //     required: true
  // },
  //___________________________________
  showButton: {
    type: Boolean,
    default: false,
  },
  buttonText: {  // Add this field
    type: String,
    trim: true,
  }
  //__________________________________
});

// module.exports = mongoose.model('Carousel', CarouselSchema);
export default mongoose.model("Carousel", CarouselSchema);
