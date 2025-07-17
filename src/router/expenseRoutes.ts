import express from "express";
import { createTransaction, deleteTransaction, getAllTransaction, getTransactonById, totalTransactionByCategory, totalTransactionByDate, updateTransaction } from "../controller/expense.controller";



const router = express.Router();

router.get("/",getAllTransaction);
router.get("/:datestart/:dateend", totalTransactionByDate);
router.get("/:id",getTransactonById);
router.get("/total/category/:category", totalTransactionByCategory);
router.post("/",createTransaction);
router.delete("/:id",deleteTransaction);
router.put("/:id", updateTransaction);

export default router;