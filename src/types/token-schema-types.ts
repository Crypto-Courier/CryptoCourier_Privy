import mongoose from "mongoose";

export interface TokenDocument extends mongoose.Document {
  chainId: number;
  contractAddress: string;
  name: string;
  symbol: string;
  decimals: number;
}