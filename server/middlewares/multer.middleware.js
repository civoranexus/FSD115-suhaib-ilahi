import multer from "multer";
import path from "path"

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    console.log("file is saving to the local storage")
    cb(null, file.fieldname + "-" + uniqueSuffix +  path.extname(file.originalname));
  },
});

export const upload = multer({
  storage,
});
