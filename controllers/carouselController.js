//___________Below these were simple src or photo logic way________________
//If you opt not to use formidable, you can still handle file uploads by using libraries like multer or by implementing custom logic to process the photo field. You'd read the file from the request, process it, and then save it to your desired location or database.

//for this in postman we would use the body form i.e {...}
// export const addCarouselController = async (req, res) => {
//   const {
//  //src
//   photo,
//   text,
//   detail,
//   showButton } = req.body;
//   try {
//     const newCarousel =new carouselModel({
//  src,
//       photo,
//       text,
//       detail,
//       showButton,
//     });
//     await newCarousel.save();
//     res.status(201).json({ success: true, data: newCarousel });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error,
//     });
//   }
// };

//_________________update carousel
// export const updateCarouselController = async (req, res) => {
//   const { carouselId, photo, text, detail, showButton } = req.body;
//   try {
//     const carousel = await carouselModel.findById(carouselId)
//     // .select('-photo');
//     if (carousel) {
//       carousel.photo = photo || carousel.photo;
//       carousel.text = text || carousel.text;
//       carousel.detail = detail || carousel.detail;
//       carousel.showButton = showButton !== undefined ? showButton : carousel.showButton;
//       await carousel.save();
//       res.status(200).json({ success: true, data: carousel });
//     } else {
//       res.status(404).json({ success: false, message: 'Carousel item not found' });
//     }
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error,
//     });
//   }
// };
//______________________________________________________________________
import fs from "fs";
import carouselModel from "../models/carouselModel.js";
import slugify from "slugify";

export const createCarouselController = async (req, res) => {
  try {
    const {text,detail,showButton, buttonText } = req.fields;
    const { photo } = req.files;
    //validation
    switch (true) {
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });


    }

    const carousel = new carouselModel({ ...req.fields});
    if (photo) {
      carousel.photo.data = fs.readFileSync(photo.path);
      carousel.photo.contentType = photo.type;
    }
    await carousel.save();
    res.status(201).send({
      success: true,
      message: "carousel added Successfully",
      carousel,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating carpusel",
    });
  }
};

//Below one is also best but a bit difficult above one is according to my project so i have
//used formidable in carouselRoutes just like productRoutes

// export const createCarouselController = async (req, res) => {
//   const form = formidable({ multiples: true, keepExtensions: true });

//   form.parse(req, async (err, fields, files) => {
//     if (err) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Form parsing error", err });
//     }

//     const { text, detail, showButton } = fields;
//     const { photo } = files;

//     // Validation
//     if (photo && photo.size > 1000000) {
//       return res
//         .status(500)
//         .json({ success: false, message: "Photo should be less than 1 MB" });
//     }

//     try {
//       const carousel = new carouselModel({ text, detail, showButton });
//       if (photo) {
//         carousel.photo.data = fs.readFileSync(photo.path);
//         carousel.photo.contentType = photo.type;
//       }
//       await carousel.save();
//       res.status(201).json({
//         success: true,
//         message: "Carousel added successfully",
//         data: carousel,
//       });
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({
//         success: false,
//         message: "Error in creating carousel",
//         error,
//       });
//     }
//   });
// };

//_________________________________________________________________________________

//__________get carousel
export const getCarouselController = async (req, res) => {
  try {
    const carousels = await carouselModel.find({})
    .select("-photo");
    // res.status(200).json({ success: true, data: carousels });
    res.status(200).send({
       success: true, 
       message:"Carousel Data",
       carousels
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error,
    });
  }
};
//____________________________________________________________________________

//get photo
export const carouselPhotoController = async (req, res) => {
  try {
    const carousel = await carouselModel.findById(req.params.Cid).select("photo");
    if (carousel.photo.data) {
      res.set("Content-type", carousel.photo.contentType);
      return res.status(200).send(carousel.photo.data);
    } else {
      return res.status(404).send({
        success: false,
        message: "Photo not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr while getting photo",
      error,
    });
  }
};
//________________________________________________________________________________

export const updateCarouselController = async (req, res) => {
  const { text, detail, showButton } = req.fields;
  const { photo } = req.files;

  if (!photo || !photo.filepath) {
    return res.status(400).json({
      success: false,
      message: "Photo is required",
    });
  } else {
    if (photo && photo.size > 1000000) {
      return res.status(500).json({
        success: false,
        message: "Photo is required and should be less than 1 mb",
      });
    }
  }

  try {
    const carousel = await carouselModel.findByIdAndUpdate(
      req.params.Cid,
      {
        ...req.fields,
      },
      { new: true }
    );
    if (photo) {
      carousel.photo.data = fs.readFileSync(photo.path);
      carousel.photo.contentType = photo.type;
    }
    await carousel.save();
    res
      .status(201)
      .json({ success: true, message: "carousel updatted", data: carousel });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error,
    });
  }
};

//_______delete carousel
export const deleteCarouselController = async (req, res) => {
  const { carouselId } = req.params;
  try {
    const carousel = await carouselModel.findByIdAndDelete(carouselId);
    if (carousel) {
      res.status(200).json({ success: true, message: "Carousel item deleted" });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Carousel item not found" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error,
    });
  }
};
