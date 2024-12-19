import mongoose from 'mongoose';

const LeaderboardPointsSchema = new mongoose.Schema({
  gifterWallet: {
    type: String,
    required: true,
    index: true,
    lowercase: true
  },
  points: [{
    chainId: {
      type: String,
      required: true,
      lowercase: true
    },
    points: {
      type: Number,
      default: 0
    }
  }, {
    _id: true,
    timestamps: false
  }]
}, {
  timestamps: false
});

// Ensure unique index on gifterWallet to prevent duplicates
LeaderboardPointsSchema.index({ gifterWallet: 1 }, { unique: true });

export default mongoose.models.LeaderboardPointsData || mongoose.model('LeaderboardPointsData', LeaderboardPointsSchema, 'LeaderboardPoints');