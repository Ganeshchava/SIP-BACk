import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
    createInvestor,
    getInvestorById,
    getInvestorHoldings,
    getInvestorNetWorth,
    getInvestorByUserId
} from "../controllers/investorController.js";

const router = express.Router();


// CREATE INVESTOR

router.post(
    "/",
    protect,
    createInvestor
);


// GET INVESTOR USING USER ID

router.get(
    "/user/:userId",
    protect,
    getInvestorByUserId
);


// HOLDINGS

router.get(
    "/:investorId/holdings",
    protect,
    getInvestorHoldings
);


// NET WORTH

router.get(
    "/:investorId/networth",
    protect,
    getInvestorNetWorth
);


// GET INVESTOR BY ID

router.get(
    "/:investorId",
    protect,
    getInvestorById
);

export default router;