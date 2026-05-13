import client from "../config/db.js";


// CREATE INVESTOR

export const createInvestor = async (req, res) => {

    try {

        const {
            phone,
            pan_number,
            address
        } = req.body;

        // logged in user id

        const userId = req.user.id;

        // check already exists

        const existingInvestor = await client.query(

            `SELECT * FROM investors
             WHERE user_id=$1`,

            [userId]
        );

        if (existingInvestor.rows.length > 0) {

            return res.status(400).json({

                success: false,

                message: "Investor profile already exists"
            });
        }

        // create investor

        const investor = await client.query(

            `INSERT INTO investors
            (user_id, phone, pan_number, address)

            VALUES($1,$2,$3,$4)

            RETURNING *`,

            [
                userId,
                phone,
                pan_number,
                address
            ]
        );

        res.status(201).json({

            success: true,

            message: "Investor Created",

            investor: investor.rows[0]
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            error: error.message
        });
    }
};



// GET INVESTOR BY ID

export const getInvestorById = async (req, res) => {

    try {

        const { investorId } = req.params;

        const investor = await client.query(

            `SELECT
                investors.*,
                users.full_name,
                users.email

             FROM investors

             JOIN users
             ON investors.user_id = users.user_id

             WHERE investor_id=$1`,

            [investorId]
        );

        if (investor.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Investor not found"
            });
        }

        res.status(200).json({

            success: true,

            investor: investor.rows[0]
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            error: error.message
        });
    }
};

export const getInvestorHoldings = async (req, res) => {

    try {

        const { investorId } = req.params;

        const holdings = await client.query(

            `
            SELECT

                mf.fund_id,

                mf.fund_name,

                mf.latest_nav,

                ROUND(
                    SUM(it.units_allocated)::numeric,
                    4
                ) AS total_units,

                ROUND(
                    (
                        SUM(it.units_allocated)
                        * mf.latest_nav
                    )::numeric,
                    2
                ) AS current_value

            FROM investors i

            JOIN portfolios p
            ON i.investor_id = p.investor_id

            JOIN sip_registrations sr
            ON p.portfolio_id = sr.portfolio_id

            JOIN investment_transactions it
            ON sr.sip_id = it.sip_id

            JOIN mutual_funds mf
            ON it.fund_id = mf.fund_id

            WHERE i.investor_id = $1

            GROUP BY
                mf.fund_id,
                mf.fund_name,
                mf.latest_nav
            `,

            [investorId]
        );

        res.status(200).json({

            success: true,

            investor_id: investorId,

            total_funds: holdings.rows.length,

            holdings: holdings.rows
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            error: error.message
        });
    }
};

export const getInvestorNetWorth = async (req, res) => {

    try {

        const { investorId } = req.params;

        const netWorth = await client.query(

            `
            SELECT

                ROUND(
                    SUM(
                        it.units_allocated
                        * mf.latest_nav
                    )::numeric,
                    2
                ) AS total_net_worth

            FROM investors i

            JOIN portfolios p
            ON i.investor_id = p.investor_id

            JOIN sip_registrations sr
            ON p.portfolio_id = sr.portfolio_id

            JOIN investment_transactions it
            ON sr.sip_id = it.sip_id

            JOIN mutual_funds mf
            ON it.fund_id = mf.fund_id

            WHERE i.investor_id = $1
            `,

            [investorId]
        );

        res.status(200).json({

            success: true,

            investor_id: investorId,

            total_net_worth:
                netWorth.rows[0].total_net_worth
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            error: error.message
        });
    }
};

export const getInvestorByUserId = async (
    req,
    res
) => {

    try {

        const { userId } = req.params;

        const investor = await client.query(

            `
            SELECT *

            FROM investors

            WHERE user_id = $1
            `,

            [userId]
        );

        if (investor.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Investor not found"
            });
        }

        res.status(200).json({

            success: true,

            investor: investor.rows[0]
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            error: error.message
        });
    }
};