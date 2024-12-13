import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  claimerWallet: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  claimerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  authData: {
    type: Map,
    of: {
      authStatus: {
        type: Boolean,
        default: false
      },
      gifterAddress: {
        type: String,
        trim: true,
        lowercase: true
      },
      universalDepth: {
        type: Map,
        of: Number,
        default: {}
      },
      localDepth: {
        type: Map,
        of: Number,
        default: {}
      }
    },
    default: {}
  }
}, {
  timestamps: true
});

// Ensure unique index on claimerAddress
UserSchema.index({ claimerWallet: 1 }, { unique: true });

// Ensure unique index on claimerEmail
UserSchema.index({ claimerEmail: 1 }, { unique: true });

export default mongoose.models.UserData || mongoose.model('UserData', UserSchema, 'Users');