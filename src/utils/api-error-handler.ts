import { NextApiResponse } from "next";

// For Handle and Throw error
export const handleError = (res: NextApiResponse, status: number, message: string, error?: any) => {
    console.error(message, error);
    return res.status(status).json({ message, error });
};