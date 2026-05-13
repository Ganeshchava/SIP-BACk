import client from "../config/db.js";


// CREATE FUND

export const createFund = async (req, res) => {

    try {

        const {
            amc_id,
            fund_name,
            fund_type,
            latest_nav
        } = req.body;

        const fund = await client.query(

            `
            INSERT INTO mutual_funds
            (
                amc_id,
                fund_name,
                fund_type,
                latest_nav
            )

            VALUES($1,$2,$3,$4)

            RETURNING *
            `,

            [
                amc_id,
                fund_name,
                fund_type,
                latest_nav
            ]
        );

        res.status(201).json({

            success: true,

            message: "Fund Created",

            fund: fund.rows[0]
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            error: error.message
        });
    }
};



// GET ALL FUNDS

export const getAllFunds = async (req, res) => {

    try {

        const funds = await client.query(

            `
            SELECT

                mf.*,

                a.amc_name

            FROM mutual_funds mf

            JOIN amcs a
            ON mf.amc_id = a.amc_id

            ORDER BY mf.fund_id ASC
            `
        );

        res.status(200).json({

            success: true,

            total_funds: funds.rows.length,

            funds: funds.rows
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            error: error.message
        });
    }
};



// UPDATE NAV

export const updateFundNAV = async (req, res) => {

    try {

        const { fundId } = req.params;

        const { latest_nav } = req.body;

        // update mutual fund NAV

        const updatedFund = await client.query(

            `
            UPDATE mutual_funds

            SET latest_nav = $1

            WHERE fund_id = $2

            RETURNING *
            `,

            [latest_nav, fundId]
        );

        // fund not found

        if (updatedFund.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Fund not found"
            });
        }

        // insert NAV history

        await client.query(

            `
            INSERT INTO nav_history
            (
                fund_id,
                nav_value,
                nav_date
            )

            VALUES($1,$2,CURRENT_DATE)
            `,

            [fundId, latest_nav]
        );

        res.status(200).json({

            success: true,

            message: "NAV Updated",

            fund: updatedFund.rows[0]
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            error: error.message
        });
    }
};