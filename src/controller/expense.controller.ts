
import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { transaction } from "../../prisma/generated/client";

// Read Data + pagination
export const getData = async (req: Request, res: Response) => {
    try {
        const filterData: Partial<transaction> = {};
        //partial : seluruh type yang ada di buat di <transactions> akan dibuat opsional
        // const untuk pagination
        const pagination: { take?: number; skip?: number } = {};
        // skip: 0, // define default
        // take: 0, // ambil default
        //cara baca : ex. skip 10 data, lalu ambil 30 data setelahnya

        if (req.query.id) {
            filterData.id = parseInt(req.query.id as string);
        }
        if (req.query.categoryid) {
            filterData.categoryId = parseInt(req.query.categoryid as string);
        }
        // Pengaturan Pagination
        if (req.query.page && req.query.limit) {
            pagination.take = parseInt(req.query.limit as string);
            pagination.skip =
                (parseInt(req.query.page as string) - 1) * pagination.take;
            // rumusnya : page ke-n dikurangi 1 dikali jumlah limit per page
        }
        // skip : melompati data

        const transactions: transaction[] = await prisma.transaction.findMany({
            ...pagination,
            where: filterData,
            include: {
                categories: {
                    select: {
                        category: true,
                        type: true,
                        created_at: true,
                    },
                },
            },
        });
        res.status(200).send(transactions);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};

// Add Data
export const addData = async (req: Request, res: Response) => {
    try {
        await prisma.transaction.create({
            data: req.body,
        });
        res.status(200).send({
            success: true,
            message: "Add data success",
        });
    } catch (error: any) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: error.message,
            error: error,
            body: req.body
        });
    }
};
// Update Data
export const updateData = async (req: Request, res: Response) => {
    try {
        const update = await prisma.transaction.update({
            where: {
                id: parseInt(req.params.id as string),
            },
            data: req.body,
        });

        res.status(200).send({
            success: true,
            message: "Update Data Success",
            result: update,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};

// Delete Data
export const deleteData = async (req: Request, res: Response) => {
    try {
        const remove = await prisma.transaction.delete({
            where: {
                id: parseInt(req.params.id as string),
            },
        });

        res.status(200).send({
            success: true,
            message: "Remove Data Success",
            result: remove,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};

export const getByCategory = async (req: Request, res: Response) => {
    try {
        const result = await prisma.transaction.aggregate({
            _sum: {
                nominal: true,
            }, where: {
                categoryId: req.params.categoryId as any
                //kenapa tidak butuh as string?
                //bedanya params dengan query? params kalo gadiisi akan error, kalo query bisa ada bisa tidak
            }
        });

        const get = await prisma.transaction.findMany({
            where: {
                categoryId: req.params.categoryId as any,
            },
            include: {
                categories: {
                    select: {
                        category: true,
                        type: true,
                        created_at: true,
                    },
                },
            },

        })

        res.status(200).send({
            total: result._sum.nominal,
            data: get
        });

    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
}
