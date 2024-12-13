import mongoose from 'mongoose';

const LeaderboardPointsSchema = new mongoose.Schema({
  gifterWallet: {
    type: String,
    required: true,
    index: true
  },
  points: [{
    chainId: {
      type: String,
      required: true
    },
    points: {
      type: Number,
      default: 0
    }
  }]
}, {
  timestamps: true
});

// Ensure unique index on gifterWallet to prevent duplicates
LeaderboardPointsSchema.index({ gifterWallet: 1 }, { unique: true });

export default mongoose.models.LeaderboardPointsData || mongoose.model('LeaderboardPointsData', LeaderboardPointsSchema, 'LeaderboardPoints');