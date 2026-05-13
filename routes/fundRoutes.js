import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
    createFund,
    getAllFunds,
    updateFundNAV
} from "../controllers/fundController.js";

const router = express.Router();


// CREATE FUND

router.post(
    "/",
    protect,
    createFund
);


// GET ALL FUNDS

router.get(
    "/",
    protect,
    getAllFunds
);


// UPDATE NAV

router.put(
    "/:fundId/nav",
    protect,
    updateFundNAV
);

export default router;