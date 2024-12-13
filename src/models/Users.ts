import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  email: {
    type: String,
    sparse: true,
    index: true,
  },
  authStatus: {
    type: Boolean,
    default: false,
  },
  authenticatedAt: {
    type: Date,
  },
  invitedUsers: [{
    type: String,
  }],
  numberOfInvitedUsers: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastConnectedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

export default mongoose.models.UserData || mongoose.model('UserData', UserSchema, 'Users'); 