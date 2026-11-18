const Donor = require('../models/Donor');
const User = require('../models/User');

/**
 * @desc    Get all donors with filters and pagination
 * @route   GET /api/donors
 * @access  Public
 */
const getDonors = async (req, res) => {
  try {
    const { bloodGroup, district, city, availability, search, page = 1, limit = 100 } = req.query;

    const filter = { status: 'Active' };
    if (bloodGroup && bloodGroup !== 'ALL') filter.bloodGroup = bloodGroup;
    if (district && district !== 'ALL') filter.district = { $regex: district, $options: 'i' };
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (availability !== undefined && availability !== 'ALL') {
      filter.availability = availability === 'true' || availability === true;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { district: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [donors, total] = await Promise.all([
      Donor.find(filter)
        .populate('userId', 'name email isVerified')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Donor.countDocuments(filter),
    ]);

    res.json({
      success: true,
      donors,
      data: donors,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    console.error('GetDonors error:', error.message);
    res.status(500).json({ message: 'Server error fetching donors.', error: error.message });
  }
};

/**
 * @desc    Get a single donor by ID
 * @route   GET /api/donors/:id
 * @access  Public
 */
const getDonorById = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id).populate('userId', 'name email isVerified');
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found.' });
    }
    res.json(donor);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Donor not found.' });
    }
    console.error('GetDonorById error:', error.message);
    res.status(500).json({ message: 'Server error fetching donor.' });
  }
};

/**
 * @desc    Create a new donor profile
 * @route   POST /api/donors
 * @access  Public / Private
 */
const createDonor = async (req, res) => {
  try {
    const {
      name, email, phone, bloodGroup, district, city,
      dateOfBirth, lastDonationDate, availability,
    } = req.body;

    const donor = await Donor.create({
      userId: req.user ? req.user._id : null,
      name,
      email,
      phone,
      bloodGroup,
      district: district || 'Colombo',
      city: city || 'Colombo',
      dateOfBirth,
      lastDonationDate,
      availability: availability !== undefined ? availability : true,
      status: 'Active',
    });

    res.status(201).json(donor);
  } catch (error) {
    console.error('CreateDonor error:', error.message);
    res.status(500).json({ message: 'Server error creating donor.', error: error.message });
  }
};

/**
 * @desc    Update donor profile
 * @route   PUT /api/donors/:id
 * @access  Private
 */
const updateDonor = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found.' });
    }

    const allowedFields = [
      'name', 'email', 'phone', 'bloodGroup', 'district', 'city',
      'dateOfBirth', 'lastDonationDate', 'availability', 'status'
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        donor[field] = req.body[field];
      }
    });

    const updatedDonor = await donor.save();
    res.json(updatedDonor);
  } catch (error) {
    console.error('UpdateDonor error:', error.message);
    res.status(500).json({ message: 'Server error updating donor.' });
  }
};

/**
 * @desc    Update donor status
 * @route   PUT /api/donors/:id/status
 * @route   PATCH /api/donors/:id/status
 * @access  Private
 */
const updateDonorStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found.' });
    }

    if (status) donor.status = status;
    if (req.body.availability !== undefined) donor.availability = req.body.availability;

    const updated = await donor.save();
    res.json(updated);
  } catch (error) {
    console.error('UpdateDonorStatus error:', error.message);
    res.status(500).json({ message: 'Server error updating donor status.' });
  }
};

/**
 * @desc    Delete a donor
 * @route   DELETE /api/donors/:id
 * @access  Private/Admin
 */
const deleteDonor = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found.' });
    }

    await donor.deleteOne();
    res.json({ message: 'Donor removed successfully.' });
  } catch (error) {
    console.error('DeleteDonor error:', error.message);
    res.status(500).json({ message: 'Server error deleting donor.' });
  }
};

module.exports = {
  getDonors,
  getDonorById,
  createDonor,
  updateDonor,
  updateDonorStatus,
  deleteDonor,
};
