const mongoose = require('mongoose');

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const SRI_LANKA_DISTRICTS = [
  'Ampara',
  'Anuradhapura',
  'Badulla',
  'Batticaloa',
  'Colombo',
  'Galle',
  'Gampaha',
  'Hambantota',
  'Jaffna',
  'Kalutara',
  'Kandy',
  'Kegalle',
  'Kilinochchi',
  'Kurunegala',
  'Mannar',
  'Matale',
  'Matara',
  'Monaragala',
  'Mullaitivu',
  'Nuwara Eliya',
  'Polonnaruwa',
  'Puttalam',
  'Ratnapura',
  'Trincomalee',
  'Vavuniya',
];

const donorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    bloodGroup: {
      type: String,
      required: [true, 'Blood group is required'],
      enum: {
        values: BLOOD_GROUPS,
        message: '{VALUE} is not a valid blood group',
      },
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      enum: {
        values: SRI_LANKA_DISTRICTS,
        message: '{VALUE} is not a valid Sri Lankan district',
      },
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    lastDonationDate: {
      type: Date,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Suspended'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

// Index for common query patterns
donorSchema.index({ bloodGroup: 1, district: 1 });
donorSchema.index({ userId: 1 });

module.exports = mongoose.model('Donor', donorSchema);
module.exports.BLOOD_GROUPS = BLOOD_GROUPS;
module.exports.SRI_LANKA_DISTRICTS = SRI_LANKA_DISTRICTS;
