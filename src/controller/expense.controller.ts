import { Request, Response } from "express";
import pool from "../data/db"


export const getAllTransaction = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * from transaction')
        res.json(result.rows)
    } catch (error) {
        console.log(error)
    };
};

export const getTransactonById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * from transaction where id = $1', [id])
        res.json(result.rows[0])
    } catch (error) {
        console.log(error);
        res.json(error);
    };
};

export const createTransaction = async (req: Request, res: Response) => {
    try {
        const { title, nominal, category, type, date } = req.body;
        const result = await pool.query(`insert into transaction (title,nominal,category,type,date)
                        values ($1,$2,$3,$4,$5) returning *`,
            [title, nominal, category, type, date]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.log(error);
    };
};

export const deleteTransaction = async (req: Request, res: Response) => {
    try {
        const  {id}  = req.params;
        const result = await pool.query('DELETE from transaction where id = $1 returning *', [id])
        res.json(result.rows[0])
    } catch (error) {
        console.log(error);
    };
};

export const updateTransaction = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, nominal, category, type, date } = req.body;

        const result = await pool.query(`UPDATE transaction 
            SET title = $2, nominal = $3, category = $4, type = $5, date = $6
            WHERE id = $1 
            RETURNING *`,
            [id, title, nominal, category, type, date],
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Transaction not found.' });
        };
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error updating transaction:", error);
        res.status(500).json({ message: 'Internal server error.' });
    };
};

export const totalTransactionByDate = async (req: Request, res: Response) => {
    try {
        const datestart = req.params.datestart;
        const dateend = req.params.dateend;

        if (!datestart || !dateend) {
            return res.status(400).json({ message: 'Both datestart and dateend are required.' });
        }

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(datestart) || !dateRegex.test(dateend)) {
            return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
        }

        const result = await pool.query(
            `SELECT COALESCE(SUM(nominal), 0) AS total_nominal
            FROM transaction
            WHERE date BETWEEN $1 AND $2 `,
            [datestart, dateend]
        );

        const totalNominal = parseFloat(result.rows[0].total_nominal);

        res.status(200).json({
            datestart,
            dateend,
            totalNominal
        });

    } catch (error) {
        console.error("Error fetching total transactions by date range:", error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

export const totalTransactionByCategory = async (req: Request, res: Response) => {
    try {
        const {category} = req.params;
    
        const result = await pool.query(`SELECT COALESCE(SUM(nominal), 0) AS total_nominal
            FROM transaction
            WHERE category = $1`,
            [category]);

        const totalNominal = parseFloat(result.rows[0].total_nominal as string);

        res.status(200).json({
            category: category, // Send back the category that was queried
            totalNominal: totalNominal,
        });
        
    } catch (error) {
        console.log(error)
        const err = "error server e khang"
        res.status(500).json({
            err,
        });
    };
};