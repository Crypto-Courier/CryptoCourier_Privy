import { Model } from "mongoose";
import dbConnect from "./dbConnect";
import UserData from "../models/Users";
import TransactionData from "../models/Transactions";
import LeaderboardPointsData from "../models/LeaderboardPoint";
import TokenData from "../models/Tokens";

// Generic function to get a collection
const getCollection = async <T>(
  model: Model<T>,
  errorMessage: string
): Promise<Model<T>> => {
  try {
    await dbConnect();
    return model;
  } catch (error) {
    throw new Error(errorMessage);
  }
};

// To get user collection
export const getUserCollection = () =>
  getCollection(UserData, "Database connection error for user collection");

// To get transaction collection
export const getTransactionCollection = () =>
  getCollection(
    TransactionData,
    "Database connection error for transaction collection"
  );

// To get leaderboard point collection
export const getLeaderboardPointsCollection = () =>
  getCollection(
    LeaderboardPointsData,
    "Database connection error for leaderboard point collection"
  );

// To get token collection
export const getTokenCollection = () =>
  getCollection(TokenData, "Database connection error for token collection");
