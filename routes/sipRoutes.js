import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
    createSIP,
    getSIPById,
    processSIP,
    getSIPTransactions
} from "../controllers/sipController.js";

const router = express.Router();


// CREATE SIP

router.post(
    "/",
    protect,
    createSIP
);


// GET SIP

router.get(
    "/:sipId",
    protect,
    getSIPById
);


// PROCESS SIP

router.post(
    "/:sipId/process",
    protect,
    processSIP
);


// SIP TRANSACTIONS

router.get(
    "/:sipId/transactions",
    protect,
    getSIPTransactions
);

export default router;