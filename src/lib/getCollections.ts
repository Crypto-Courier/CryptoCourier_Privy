import dbConnect from './mongoose';
import UserData from '../models/Users';
import TransactionData from '../models/Transactions';
import LeaderboardPointsData from '../models/LeaderboardPoint';

export const getUserCollection = async () => {
    try {
        await dbConnect();
        return UserData;
    } catch (error) {
        throw new Error('Database connection error');
    }
};

export const getTransactionCollection = async () => {
    try {
        await dbConnect();
        return TransactionData;
    } catch (error) {
        throw new Error('Database connection error');
    }
};

export const getLeaderboardPointsCollection = async () => {
    try {
        await dbConnect();
        return LeaderboardPointsData;
    } catch (error) {
        throw new Error('Database connection error');
    }
};