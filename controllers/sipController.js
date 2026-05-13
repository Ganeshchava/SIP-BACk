import client from "../config/db.js";


// CREATE SIP

export const createSIP = async (req, res) => {

    try {

        const {
            portfolio_id,
            fund_id,
            sip_amount,
            sip_frequency,
            sip_date,
            start_date
        } = req.body;

        const sip = await client.query(

            `
            INSERT INTO sip_registrations
            (
                portfolio_id,
                fund_id,
                sip_amount,
                sip_frequency,
                sip_date,
                start_date
            )

            VALUES($1,$2,$3,$4,$5,$6)

            RETURNING *
            `,

            [
                portfolio_id,
                fund_id,
                sip_amount,
                sip_frequency,
                sip_date,
                start_date
            ]
        );

        res.status(201).json({

            success: true,

            message: "SIP Created",

            sip: sip.rows[0]
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            error: error.message
        });
    }
};



// GET SIP BY ID

export const getSIPById = async (req, res) => {

    try {

        const { sipId } = req.params;

        const sip = await client.query(

            `
            SELECT

                sr.*,

                mf.fund_name,

                mf.latest_nav

            FROM sip_registrations sr

            JOIN mutual_funds mf
            ON sr.fund_id = mf.fund_id

            WHERE sr.sip_id = $1
            `,

            [sipId]
        );

        if (sip.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "SIP not found"
            });
        }

        res.status(200).json({

            success: true,

            sip: sip.rows[0]
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            error: error.message
        });
    }
};



// PROCESS SIP

export const processSIP = async (req, res) => {

    try {

        const { sipId } = req.params;

        // get SIP details

        const sipData = await client.query(

            `
            SELECT *

            FROM sip_registrations

            WHERE sip_id = $1
            `,

            [sipId]
        );

        if (sipData.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "SIP not found"
            });
        }

        const sip = sipData.rows[0];

        // get fund NAV

        const fundData = await client.query(

            `
            SELECT *

            FROM mutual_funds

            WHERE fund_id = $1
            `,

            [sip.fund_id]
        );

        const fund = fundData.rows[0];

        // calculate units

        const unitsAllocated =
            sip.sip_amount / fund.latest_nav;

        // create transaction

        const transaction = await client.query(

            `
            INSERT INTO investment_transactions
            (
                sip_id,
                fund_id,
                transaction_amount,
                nav_at_purchase,
                units_allocated
            )

            VALUES($1,$2,$3,$4,$5)

            RETURNING *
            `,

            [
                sip.sip_id,
                sip.fund_id,
                sip.sip_amount,
                fund.latest_nav,
                unitsAllocated
            ]
        );

        res.status(201).json({

            success: true,

            message: "SIP Processed",

            transaction: transaction.rows[0]
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            error: error.message
        });
    }
};



// SIP TRANSACTIONS

export const getSIPTransactions = async (req, res) => {

    try {

        const { sipId } = req.params;

        const transactions = await client.query(

            `
            SELECT *

            FROM investment_transactions

            WHERE sip_id = $1

            ORDER BY transaction_date DESC
            `,

            [sipId]
        );

        res.status(200).json({

            success: true,

            total_transactions:
                transactions.rows.length,

            transactions: transactions.rows
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            error: error.message
        });
    }
};