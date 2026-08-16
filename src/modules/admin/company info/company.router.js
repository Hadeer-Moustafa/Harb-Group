import { Router } from "express";
import { isAuthenticated } from "../../../middleware/isAuth.js";
import { getCompanyInfo , updateCompanyInfo , uploadCompanyLogo , deleteCompanyLogo} from "./company.controller.js";
import { validate } from "../../../middleware/validate.schema.js";
import { updateCompanyInfoSchema } from "./company.validation.js";
import { uploadImagesArray } from "../../../middleware/multer.js";
import { processAndUpload } from "../../../middleware/imageProcessing+upload.js";

const router = Router();
// get company info 
router.get("/",isAuthenticated,getCompanyInfo);
//update company info
router.put("/",isAuthenticated,validate(updateCompanyInfoSchema), updateCompanyInfo);
//upload company logo
router.post("/logo",isAuthenticated,uploadImagesArray("logo",1,true),processAndUpload({folder:"Logo"}),uploadCompanyLogo);
//delete company logo
router.delete("/logo",isAuthenticated,deleteCompanyLogo)
export default router