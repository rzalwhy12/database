import express from "express";
import {addData, deleteData, getByCategory, getData, updateData} from "../controller/expense.controller";



const router = express.Router();

router.get("/",getData);

router.get("/by-category/:categoryid", getByCategory);

router.post("/",addData);

router.patch("/:id",updateData);

router.delete("/:id",deleteData);


export default router;