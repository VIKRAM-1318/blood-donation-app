/**
 * Database Seed Script
 * Seeds the database with initial admin user, sample donors, and blood requests.
 *
 * Usage: npm run seed  (or)  node seeds/seed.js
 */
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load env from server root
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Donor = require('../models/Donor');
const BloodRequest = require('../models/BloodRequest');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Donor.deleteMany({}),
      BloodRequest.deleteMany({}),
    ]);
    console.log('Cleared all collections.');

    // -----------------------------------------------------------------------
    // Create Admin User
    // -----------------------------------------------------------------------
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@lifelink.com',
      password: 'Admin@123',
      role: 'admin',
      status: 'Active',
    });
    console.log(`Admin user created: ${adminUser.email}`);

    // -----------------------------------------------------------------------
    // Create Sample Regular Users
    // -----------------------------------------------------------------------
    const users = await User.insertMany([
      { name: 'Kasun Perera', email: 'kasun@example.com', password: await hashPassword('User@123'), role: 'user' },
      { name: 'Nimalka Silva', email: 'nimalka@example.com', password: await hashPassword('User@123'), role: 'user' },
      { name: 'Amara Fernando', email: 'amara@example.com', password: await hashPassword('User@123'), role: 'user' },
      { name: 'Ruwan Jayasinghe', email: 'ruwan@example.com', password: await hashPassword('User@123'), role: 'user' },
      { name: 'Dilini Kumari', email: 'dilini@example.com', password: await hashPassword('User@123'), role: 'user' },
    ]);
    console.log(`${users.length} sample users created.`);

    // -----------------------------------------------------------------------
    // Create Sample Donors
    // -----------------------------------------------------------------------
    const donors = await Donor.insertMany([
      {
        userId: users[0]._id,
        name: 'Kasun Perera',
        email: 'kasun@example.com',
        phone: '+94771234567',
        bloodGroup: 'A+',
        district: 'Colombo',
        city: 'Dehiwala',
        dateOfBirth: new Date('1990-05-15'),
        lastDonationDate: new Date('2024-06-01'),
        availability: true,
      },
      {
        userId: users[1]._id,
        name: 'Nimalka Silva',
        email: 'nimalka@example.com',
        phone: '+94772345678',
        bloodGroup: 'O-',
        district: 'Kandy',
        city: 'Peradeniya',
        dateOfBirth: new Date('1988-11-20'),
        lastDonationDate: new Date('2024-03-15'),
        availability: true,
      },
      {
        userId: users[2]._id,
        name: 'Amara Fernando',
        email: 'amara@example.com',
        phone: '+94773456789',
        bloodGroup: 'B+',
        district: 'Galle',
        city: 'Unawatuna',
        dateOfBirth: new Date('1995-02-28'),
        availability: true,
      },
      {
        userId: users[3]._id,
        name: 'Ruwan Jayasinghe',
        email: 'ruwan@example.com',
        phone: '+94774567890',
        bloodGroup: 'AB+',
        district: 'Jaffna',
        city: 'Nallur',
        dateOfBirth: new Date('1992-08-10'),
        lastDonationDate: new Date('2024-01-20'),
        availability: false,
      },
      {
        userId: users[4]._id,
        name: 'Dilini Kumari',
        email: 'dilini@example.com',
        phone: '+94775678901',
        bloodGroup: 'O+',
        district: 'Gampaha',
        city: 'Negombo',
        dateOfBirth: new Date('1993-12-05'),
        lastDonationDate: new Date('2024-08-10'),
        availability: true,
      },
    ]);
    console.log(`${donors.length} sample donors created.`);

    // -----------------------------------------------------------------------
    // Create Sample Blood Requests
    // -----------------------------------------------------------------------
    const requests = await BloodRequest.insertMany([
      {
        patientName: 'Sunil Bandara',
        bloodGroup: 'A+',
        district: 'Colombo',
        hospital: 'National Hospital Colombo',
        unitsNeeded: 3,
        urgency: 'Critical',
        status: 'Pending',
        contactNumber: '+94776789012',
        additionalNotes: 'Patient undergoing emergency surgery. Needs blood urgently.',
        requestedBy: users[0]._id,
      },
      {
        patientName: 'Kamala Wijesinghe',
        bloodGroup: 'O-',
        district: 'Kandy',
        hospital: 'Teaching Hospital Kandy',
        unitsNeeded: 2,
        urgency: 'Urgent',
        status: 'Under Coordination',
        contactNumber: '+94777890123',
        additionalNotes: 'Scheduled surgery next week.',
        requestedBy: users[1]._id,
      },
      {
        patientName: 'Priya Mendis',
        bloodGroup: 'B+',
        district: 'Galle',
        hospital: 'Karapitiya Teaching Hospital',
        unitsNeeded: 1,
        urgency: 'Standard',
        status: 'Pending',
        contactNumber: '+94778901234',
        requestedBy: users[2]._id,
      },
    ]);
    console.log(`${requests.length} sample blood requests created.`);

    // -----------------------------------------------------------------------
    console.log('\n--- Seed Summary ---');
    console.log(`Admin:    admin@lifelink.com / Admin@123`);
    console.log(`Users:    ${users.length} sample users (password: User@123)`);
    console.log(`Donors:   ${donors.length} sample donors`);
    console.log(`Requests: ${requests.length} sample blood requests`);
    console.log('--- Seeding Complete ---\n');

    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

/**
 * Hash a password manually for insertMany (which skips pre-save hooks).
 */
async function hashPassword(password) {
  const bcrypt = require('bcryptjs');
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

seedDatabase();
