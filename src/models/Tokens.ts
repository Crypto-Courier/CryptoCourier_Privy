import mongoose from 'mongoose';
import { TokenDocument } from '../types/token-schema-types';

const TokenSchema = new mongoose.Schema<TokenDocument>({
  chainId: {
    type: Number,
    required: true,
    index: true
  },
  contractAddress: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(this: TokenDocument, v: string) {
        return /^0x[a-fA-F0-9]{40}$/.test(v);
      },
      message: (props: { value: string }) => `${props.value} is not a valid contract address!`
    }
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  symbol: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  decimals: {
    type: Number,
    required: true,
    min: [0, 'Decimals must be a non-negative number'],
    max: [18, 'Decimals cannot exceed 18']
  }
}, {
  timestamps: false
});

// Compound unique index to allow same symbol on different chains
TokenSchema.index({ symbol: 1, chainId: 1 }, { unique: true });

export default mongoose.models.TokenData || mongoose.model<TokenDocument>('TokenData', TokenSchema, 'Tokens');