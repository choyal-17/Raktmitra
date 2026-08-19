/**
 * RaktMitra - MongoDB Seed Script
 * Run: node seed.js
 * Seeds: Users, Donors, Patients, BloodBanks, BloodCamps, BloodRequests
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const User         = require('./models/User');
const Donor        = require('./models/Donor');
const Patient      = require('./models/Patient');
const BloodBank    = require('./models/BloodBank');
const BloodCamp    = require('./models/BloodCamp');
const BloodRequest = require('./models/BloodRequest');

// ─── Dummy Data ────────────────────────────────────────────────────────────────

const usersData = [
  { name: 'Aarav Sharma',  email: 'aarav@example.com',  password: 'Test@1234', phone: '9876543210', bloodGroup: 'A+',  city: 'Bhopal',    state: 'Madhya Pradesh', age: 28, gender: 'Male',   isAvailable: true,  totalDonations: 3 },
  { name: 'Priya Verma',   email: 'priya@example.com',  password: 'Test@1234', phone: '9812345678', bloodGroup: 'B+',  city: 'Indore',    state: 'Madhya Pradesh', age: 25, gender: 'Female', isAvailable: true,  totalDonations: 1 },
  { name: 'Rahul Gupta',   email: 'rahul@example.com',  password: 'Test@1234', phone: '9934561234', bloodGroup: 'O+',  city: 'Mumbai',    state: 'Maharashtra',    age: 32, gender: 'Male',   isAvailable: false, totalDonations: 5, lastDonatedAt: new Date('2025-11-10') },
  { name: 'Sneha Joshi',   email: 'sneha@example.com',  password: 'Test@1234', phone: '9901234567', bloodGroup: 'AB+', city: 'Pune',      state: 'Maharashtra',    age: 30, gender: 'Female', isAvailable: true,  totalDonations: 2 },
  { name: 'Amit Patel',    email: 'amit@example.com',   password: 'Test@1234', phone: '9856789012', bloodGroup: 'A-',  city: 'Ahmedabad', state: 'Gujarat',        age: 35, gender: 'Male',   isAvailable: true,  totalDonations: 0 },
  { name: 'Kavita Singh',  email: 'kavita@example.com', password: 'Test@1234', phone: '9823456780', bloodGroup: 'B-',  city: 'Jaipur',    state: 'Rajasthan',      age: 27, gender: 'Female', isAvailable: true,  totalDonations: 4 },
  { name: 'Deepak Mishra', email: 'deepak@example.com', password: 'Test@1234', phone: '9798765432', bloodGroup: 'O-',  city: 'Lucknow',   state: 'Uttar Pradesh',  age: 40, gender: 'Male',   isAvailable: false, totalDonations: 8, lastDonatedAt: new Date('2026-01-15') },
  { name: 'Riya Kapoor',   email: 'riya@example.com',   password: 'Test@1234', phone: '9711234560', bloodGroup: 'AB-', city: 'Delhi',     state: 'Delhi',          age: 22, gender: 'Female', isAvailable: true,  totalDonations: 1 },
  { name: 'Suresh Yadav',  email: 'suresh@example.com', password: 'Test@1234', phone: '9645678901', bloodGroup: 'A+',  city: 'Nagpur',    state: 'Maharashtra',    age: 45, gender: 'Male',   isAvailable: true,  totalDonations: 10 },
  { name: 'Anita Tiwari',  email: 'anita@example.com',  password: 'Test@1234', phone: '9534567890', bloodGroup: 'B+',  city: 'Bhopal',    state: 'Madhya Pradesh', age: 29, gender: 'Female', isAvailable: true,  totalDonations: 2 },
];

const bloodBanksData = [
  { name: 'Hamidia Blood Bank',          city: 'Bhopal',     state: 'Madhya Pradesh', phone: '0755-2540231', address: 'Royal Market, Bhopal - 462001',       email: 'hamidia.bb@mp.gov.in' },
  { name: 'Bansal Hospital Blood Bank',  city: 'Bhopal',     state: 'Madhya Pradesh', phone: '0755-4004000', address: 'C-Sector, Shahpura, Bhopal - 462016', email: 'blood@bansalhospital.com' },
  { name: 'Red Cross Blood Bank Indore', city: 'Indore',     state: 'Madhya Pradesh', phone: '0731-2530981', address: 'MG Road, Indore - 452001',            email: 'redcross.indore@gmail.com' },
  { name: 'KEM Hospital Blood Bank',     city: 'Mumbai',     state: 'Maharashtra',    phone: '022-24136051', address: 'Parel, Mumbai - 400012',              email: 'blood@kemhospital.org' },
  { name: 'Sassoon Blood Bank',          city: 'Pune',       state: 'Maharashtra',    phone: '020-26128000', address: 'Sassoon Road, Pune - 411001',         email: 'sassoon.bb@pune.gov.in' },
  { name: 'Civil Hospital Blood Bank',   city: 'Ahmedabad',  state: 'Gujarat',        phone: '079-22681111', address: 'Asarwa, Ahmedabad - 380016',          email: 'civil.bb@gujarat.gov.in' },
  { name: 'SMS Hospital Blood Bank',     city: 'Jaipur',     state: 'Rajasthan',      phone: '0141-2518888', address: 'JLN Marg, Jaipur - 302004',           email: 'sms.bb@rajasthan.gov.in' },
  { name: 'KGMU Blood Bank',             city: 'Lucknow',    state: 'Uttar Pradesh',  phone: '0522-2258397', address: 'Shahmina Road, Lucknow - 226003',     email: 'kgmu.blood@up.gov.in' },
  { name: 'AIIMS Blood Bank',            city: 'Delhi',      state: 'Delhi',          phone: '011-26588500', address: 'Ansari Nagar, New Delhi - 110029',    email: 'blood@aiims.edu' },
  { name: 'LARRA Blood Bank',            city: 'Nagpur',     state: 'Maharashtra',    phone: '0712-2743800', address: 'Indora Chowk, Nagpur - 440010',       email: 'larra.bb@nagpur.gov.in' },
];

function buildDonors(users) {
  return users.slice(0, 8).map((u, i) => ({
    name:           u.name,
    email:          u.email,
    phone:          u.phone,
    bloodGroup:     u.bloodGroup,
    city:           u.city,
    state:          u.state,
    age:            u.age,
    gender:         u.gender,
    address:        `${i + 1}, Shanti Nagar, ${u.city}`,
    isAvailable:    u.isAvailable,
    lastDonatedAt:  u.lastDonatedAt || null,
    totalDonations: u.totalDonations,
    userId:         u._id,
  }));
}

function buildPatients(users) {
  return [
    { name: 'Mohan Lal',     phone: '9876501111', bloodGroup: 'O-',  city: 'Bhopal',    state: 'Madhya Pradesh', hospital: 'Hamidia Hospital',  units: 2, urgency: 'Critical', status: 'Open',      email: 'mohan@example.com',   userId: users[0]._id },
    { name: 'Sunita Rawat',  phone: '9812302222', bloodGroup: 'A+',  city: 'Indore',    state: 'Madhya Pradesh', hospital: 'Bombay Hospital',   units: 1, urgency: 'Urgent',   status: 'Open',      email: 'sunita@example.com',  userId: users[1]._id },
    { name: 'Rakesh Pandey', phone: '9934563333', bloodGroup: 'B+',  city: 'Mumbai',    state: 'Maharashtra',    hospital: 'KEM Hospital',      units: 3, urgency: 'Normal',   status: 'Fulfilled', email: 'rakesh@example.com',  userId: users[2]._id },
    { name: 'Pooja Nair',    phone: '9901234440', bloodGroup: 'AB+', city: 'Pune',      state: 'Maharashtra',    hospital: 'Ruby Hall Clinic',  units: 2, urgency: 'Urgent',   status: 'Open',      email: 'pooja@example.com',   userId: users[3]._id },
    { name: 'Vijay Kumar',   phone: '9856785555', bloodGroup: 'A-',  city: 'Jaipur',    state: 'Rajasthan',      hospital: 'Fortis Hospital',   units: 1, urgency: 'Critical', status: 'Open',      email: 'vijay@example.com',   userId: users[4]._id },
    { name: 'Meera Desai',   phone: '9823456660', bloodGroup: 'O+',  city: 'Ahmedabad', state: 'Gujarat',        hospital: 'Civil Hospital',    units: 4, urgency: 'Normal',   status: 'Closed',    email: 'meera@example.com',   userId: users[5]._id },
    { name: 'Arjun Das',     phone: '9798767777', bloodGroup: 'B-',  city: 'Delhi',     state: 'Delhi',          hospital: 'AIIMS',             units: 2, urgency: 'Urgent',   status: 'Open',      email: 'arjun@example.com',   userId: users[6]._id },
    { name: 'Lakshmi Iyer',  phone: '9711238880', bloodGroup: 'AB-', city: 'Nagpur',    state: 'Maharashtra',    hospital: 'LARRA Hospital',    units: 1, urgency: 'Normal',   status: 'Open',      email: 'lakshmi@example.com', userId: users[7]._id },
  ];
}

function buildCamps(users) {
  return [
    {
      organizer: users[0]._id, title: 'Bhopal Blood Donation Drive',
      description: 'Annual blood donation camp organised by RaktMitra volunteers.',
      venue: 'TT Nagar Stadium', city: 'Bhopal', state: 'Madhya Pradesh',
      date: new Date('2026-09-15'), startTime: '09:00', endTime: '17:00',
      contactPhone: '9876543210', targetUnits: 200,
      registeredDonors: [users[1]._id, users[2]._id],
    },
    {
      organizer: users[2]._id, title: 'Mumbai Mega Blood Camp',
      description: 'Join us to save lives — every drop counts!',
      venue: 'Shivaji Park, Dadar', city: 'Mumbai', state: 'Maharashtra',
      date: new Date('2026-10-02'), startTime: '08:00', endTime: '18:00',
      contactPhone: '9934561234', targetUnits: 500,
      registeredDonors: [users[0]._id, users[3]._id, users[4]._id],
    },
    {
      organizer: users[5]._id, title: 'Jaipur Pinkcity Blood Drive',
      description: 'Organised by Rotary Club in partnership with SMS Hospital.',
      venue: 'Jawahar Kala Kendra', city: 'Jaipur', state: 'Rajasthan',
      date: new Date('2026-08-28'), startTime: '10:00', endTime: '16:00',
      contactPhone: '9823456780', targetUnits: 150,
      registeredDonors: [],
    },
  ];
}

function buildRequests(users) {
  return [
    { requester: users[0]._id, patientName: 'Mohan Lal',    bloodGroup: 'O-',  units: 2, hospital: 'Hamidia Hospital', city: 'Bhopal',    state: 'Madhya Pradesh', contactPhone: '9876543210', urgency: 'Critical', status: 'Open',      description: 'Accident patient — urgent requirement.' },
    { requester: users[1]._id, patientName: 'Sunita Rawat', bloodGroup: 'A+',  units: 1, hospital: 'Bombay Hospital', city: 'Indore',    state: 'Madhya Pradesh', contactPhone: '9812345678', urgency: 'Urgent',   status: 'Open',      description: 'Surgery scheduled tomorrow morning.' },
    { requester: users[2]._id, patientName: 'Rakesh P.',    bloodGroup: 'B+',  units: 3, hospital: 'KEM Hospital',    city: 'Mumbai',    state: 'Maharashtra',    contactPhone: '9934561234', urgency: 'Normal',   status: 'Fulfilled', description: 'Thalassaemia patient, monthly requirement.' },
    { requester: users[3]._id, patientName: 'Pooja Nair',   bloodGroup: 'AB+', units: 2, hospital: 'Ruby Hall Clinic',city: 'Pune',      state: 'Maharashtra',    contactPhone: '9901234567', urgency: 'Urgent',   status: 'Open',      description: 'Dengue patient with low platelet count.' },
    { requester: users[4]._id, patientName: 'Vijay Kumar',  bloodGroup: 'A-',  units: 1, hospital: 'Fortis Hospital', city: 'Jaipur',    state: 'Rajasthan',      contactPhone: '9856789012', urgency: 'Critical', status: 'Open',      description: 'Post-operative bleeding — critical need.' },
  ];
}

// ─── Seed Function ─────────────────────────────────────────────────────────────

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Donor.deleteMany({}),
      Patient.deleteMany({}),
      BloodBank.deleteMany({}),
      BloodCamp.deleteMany({}),
      BloodRequest.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // Hash passwords and insert users
    const hashedUsers = await Promise.all(
      usersData.map(async (u) => ({ ...u, password: await bcrypt.hash(u.password, 10) }))
    );
    const users = await User.insertMany(hashedUsers);
    console.log(`👤 Inserted ${users.length} users`);

    const banks = await BloodBank.insertMany(bloodBanksData);
    console.log(`🏥 Inserted ${banks.length} blood banks`);

    const donors = await Donor.insertMany(buildDonors(users));
    console.log(`💉 Inserted ${donors.length} donors`);

    const patients = await Patient.insertMany(buildPatients(users));
    console.log(`🤕 Inserted ${patients.length} patients`);

    const camps = await BloodCamp.insertMany(buildCamps(users));
    console.log(`⛺ Inserted ${camps.length} blood camps`);

    const requests = await BloodRequest.insertMany(buildRequests(users));
    console.log(`📋 Inserted ${requests.length} blood requests`);

    console.log('\n🎉 Seed complete! Password for all users: Test@1234');
    console.log('\n📧 Sample logins:');
    users.slice(0, 4).forEach(u => console.log(`   ${u.email}  /  Test@1234`));

  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected');
  }
}

seed();
