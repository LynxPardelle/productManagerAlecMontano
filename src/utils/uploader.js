import __dirname from "../dirname.js";
import multer from "multer";
export default (img, type) => {
  let destination = "";
  switch (img) {
    case "perfil":
      destination = "profiles";
      break;
    case "producto":
      destination = "products";
      break;
    case "documento" || "documentos":
      destination = "documents";
      break;
    default:
      destination = "img";
      break;
  }
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `${__dirname}/../public/${destination}`);
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  switch (type) {
    case "single":
      return multer({ storage }).single(img);
    case "array":
      return multer({ storage }).array(img);
    default:
      return multer({ storage });
  }
};
