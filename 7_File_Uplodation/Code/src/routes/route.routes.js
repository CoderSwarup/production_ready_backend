import { Router } from "express";
import fileUploadController from "../controller/fileUpload.controller";

const router = Router();
router.route("/img-upload").post(multiUpload, fileUploadController);
