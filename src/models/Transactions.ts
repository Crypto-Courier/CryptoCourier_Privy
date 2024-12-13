import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  claimerWallet: String,
  gifterWallet: String,
  tokenAmount: String,
  tokenSymbol: String,
  claimerEmail: String,
  gifterEmail: String,
  chainId: String,
  transactionHash: String,
  authenticated: {
    type: Boolean,
    default: false
  },
  claimed: {
    type: Boolean,
    default: false
  },
  authenticatedAt: Date,
  claimedAt: Date,
}, {
  timestamps: true
});

TransactionSchema.index({ transactionHash: 1 }, { unique: true });

export default mongoose.models.TransactionData || mongoose.model('TransactionData', TransactionSchema, 'Transactions');
