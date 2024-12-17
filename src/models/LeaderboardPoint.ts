import mongoose from 'mongoose';

const LeaderboardPointsSchema = new mongoose.Schema({
  gifterWallet: {
    type: String,
    required: true,
    index: true
  },
  points: [{
    chain: {
      type: String,
      required: true,
      alias: 'chainId'  // This creates an alias for backward compatibility
    },
    points: {
      type: Number,
      default: 0
    }
  }]
}, {
  timestamps: true,
  // Enable virtuals to be included in toJSON output
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Ensure unique index on gifterWallet to prevent duplicates
LeaderboardPointsSchema.index({ gifterWallet: 1 }, { unique: true });

// Add a virtual getter/setter for chainId
LeaderboardPointsSchema.virtual('points.chainId')
  .get(function () {
    return this.points.map(point => point.chain);
  })
  .set(function (chainId: string) {
    if (this.points && this.points.length > 0) {
      this.points[0].chain = chainId;
    }
  });

export default mongoose.models.LeaderboardPointsData || mongoose.model('LeaderboardPointsData', LeaderboardPointsSchema, 'LeaderboardPoints');