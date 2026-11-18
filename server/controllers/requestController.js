const BloodRequest = require('../models/BloodRequest');

/**
 * @desc    Get all blood requests with filters and pagination
 * @route   GET /api/requests
 * @access  Public
 */
const getRequests = async (req, res) => {
  try {
    const { bloodGroup, district, urgency, status, search, page = 1, limit = 100 } = req.query;

    const filter = {};
    if (bloodGroup && bloodGroup !== 'ALL') filter.bloodGroup = bloodGroup;
    if (district && district !== 'ALL') filter.district = { $regex: district, $options: 'i' };
    if (urgency) filter.urgency = { $regex: urgency, $options: 'i' };
    if (status && status !== 'all') filter.status = { $regex: status, $options: 'i' };
    if (search) {
      filter.$or = [
        { patientName: { $regex: search, $options: 'i' } },
        { hospital: { $regex: search, $options: 'i' } },
        { district: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [requests, total] = await Promise.all([
      BloodRequest.find(filter)
        .populate('requestedBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      BloodRequest.countDocuments(filter),
    ]);

    res.json({
      success: true,
      requests,
      data: requests,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    console.error('GetRequests error:', error.message);
    res.status(500).json({ message: 'Server error fetching blood requests.', error: error.message });
  }
};

/**
 * @desc    Get a single blood request by ID
 * @route   GET /api/requests/:id
 * @access  Public
 */
const getRequestById = async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id).populate('requestedBy', 'name email');
    if (!request) {
      return res.status(404).json({ message: 'Blood request not found.' });
    }
    res.json(request);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Blood request not found.' });
    }
    console.error('GetRequestById error:', error.message);
    res.status(500).json({ message: 'Server error fetching blood request.' });
  }
};

/**
 * @desc    Create a new blood request
 * @route   POST /api/requests
 * @access  Public / Private (supports both)
 */
const createRequest = async (req, res) => {
  try {
    const {
      patientName,
      bloodGroup,
      district,
      hospital,
      hospitalName,
      unitsNeeded,
      urgency,
      contactNumber,
      contactPhone,
      additionalNotes,
    } = req.body;

    const normalizedHospital = hospital || hospitalName || 'National Hospital of Sri Lanka';
    const normalizedPhone = contactNumber || contactPhone || '0771234567';
    const normalizedDistrict = district || 'Colombo';
    const normalizedPatient = patientName || 'Anonymous Patient';
    const normalizedBloodGroup = bloodGroup || 'O+';
    const normalizedUnits = Number(unitsNeeded) || 1;

    let normalizedUrgency = 'Standard';
    if (urgency) {
      const u = urgency.toLowerCase();
      if (u.includes('crit')) normalizedUrgency = 'Critical';
      else if (u.includes('urg')) normalizedUrgency = 'Urgent';
      else normalizedUrgency = 'Standard';
    }

    const bloodRequest = await BloodRequest.create({
      patientName: normalizedPatient,
      bloodGroup: normalizedBloodGroup,
      district: normalizedDistrict,
      hospital: normalizedHospital,
      unitsNeeded: normalizedUnits,
      urgency: normalizedUrgency,
      status: 'Pending',
      contactNumber: normalizedPhone,
      additionalNotes: additionalNotes || '',
      requestedBy: req.user ? req.user._id : null,
    });

    res.status(201).json({
      success: true,
      request: bloodRequest,
      data: bloodRequest,
      ...bloodRequest.toObject(),
    });
  } catch (error) {
    console.error('CreateRequest error:', error.message);
    res.status(500).json({ message: 'Server error creating blood request.', error: error.message });
  }
};

/**
 * @desc    Update request status
 * @route   PATCH /api/requests/:id/status
 * @access  Public / Private
 */
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required.' });
    }

    const bloodRequest = await BloodRequest.findById(req.params.id);
    if (!bloodRequest) {
      return res.status(404).json({ message: 'Blood request not found.' });
    }

    bloodRequest.status = status;
    const updated = await bloodRequest.save();

    res.json({
      success: true,
      request: updated,
      data: updated,
      ...updated.toObject(),
    });
  } catch (error) {
    console.error('UpdateRequestStatus error:', error.message);
    res.status(500).json({ message: 'Server error updating request status.', error: error.message });
  }
};

/**
 * @desc    Delete a blood request (admin only)
 * @route   DELETE /api/requests/:id
 * @access  Private/Admin
 */
const deleteRequest = async (req, res) => {
  try {
    const bloodRequest = await BloodRequest.findById(req.params.id);
    if (!bloodRequest) {
      return res.status(404).json({ message: 'Blood request not found.' });
    }

    await bloodRequest.deleteOne();
    res.json({ success: true, message: 'Blood request deleted successfully.' });
  } catch (error) {
    console.error('DeleteRequest error:', error.message);
    res.status(500).json({ message: 'Server error deleting request.' });
  }
};

module.exports = {
  getRequests,
  getRequestById,
  createRequest,
  updateRequestStatus,
  deleteRequest,
};
