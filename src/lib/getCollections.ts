import clientPromise from "./mongodb";

export const getAuthCollection = async () => {
    try {
        const client = await clientPromise;
        return client.db('authenticationDB').collection('authentication');
    } catch (error) {
        throw new Error('Database connection error');
    }
};

export const getTransactionCollection = async () => {
    try {
        const client = await clientPromise;
        return client.db('transactionDB').collection('transactions');
    } catch (error) {
        throw new Error('Database connection error');
    }
};