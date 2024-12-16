import { ethers } from 'ethers';
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  claimerWallet: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate: {
      validator: function(v) {
        return ethers.isAddress(v); // Ensure it's a valid Ethereum address
      },
      message: props => `${props.value} is not a valid Ethereum address!`
    }
  },
  claimerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true
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