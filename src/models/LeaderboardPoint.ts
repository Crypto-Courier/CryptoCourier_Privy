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
  }],
  monthlyPoints: [{
    month: {
      type: String,
      required: true,
      match: /^(0[1-9]|1[0-2])\/\d{4}$/
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
    }]
  }, {
    _id: true,
    timestamps: false
  }]
}, {
  timestamps: false
});

LeaderboardPointsSchema.index({ gifterWallet: 1 }, { unique: true });
LeaderboardPointsSchema.index({ 'monthlyPoints.month': 1 });

export default mongoose.models.LeaderboardPointsData || mongoose.model('LeaderboardPointsData', LeaderboardPointsSchema, 'LeaderboardPoints');