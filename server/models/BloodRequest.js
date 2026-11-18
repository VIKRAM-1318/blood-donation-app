const mongoose = require('mongoose');
const { BLOOD_GROUPS, SRI_LANKA_DISTRICTS } = require('./Donor');

const bloodRequestSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: [true, 'Patient name is required'],
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
    hospital: {
      type: String,
      required: [true, 'Hospital name is required'],
      trim: true,
    },
    unitsNeeded: {
      type: Number,
      required: [true, 'Number of units needed is required'],
      min: [1, 'At least 1 unit is required'],
    },
    urgency: {
      type: String,
      enum: ['Critical', 'Urgent', 'Standard'],
      default: 'Standard',
    },
    status: {
      type: String,
      enum: ['Pending', 'Under Coordination', 'Fulfilled'],
      default: 'Pending',
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true,
    },
    additionalNotes: {
      type: String,
      trim: true,
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Index for common query patterns
bloodRequestSchema.index({ bloodGroup: 1, district: 1, status: 1 });
bloodRequestSchema.index({ urgency: 1 });

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
