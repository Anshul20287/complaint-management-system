require('dotenv').config({ path: require('path').join(__dirname, '../../.env.example') });
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const User         = require('../models/User.model');
const Issue        = require('../models/Issue.model');
const Notification = require('../models/Notification.model');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cityfix';

const zones    = ['Zone A', 'Zone B', 'Zone C', 'Zone D'];
const wards    = ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5'];
const categories = ['road', 'water', 'electricity', 'sanitation', 'street_light', 'drainage'];
const priorities  = ['low', 'medium', 'high', 'critical'];
const statuses    = ['pending', 'assigned', 'in_progress', 'resolved'];

const sampleAddresses = [
  'MG Road, Lucknow', 'Hazratganj, Lucknow', 'Gomti Nagar, Lucknow',
  'Alambagh, Lucknow', 'Indira Nagar, Lucknow', 'Aliganj, Lucknow',
];

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randCoords = () => ({
  lat: 26.85 + (Math.random() - 0.5) * 0.2,
  lng: 80.95 + (Math.random() - 0.5) * 0.2,
});

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅  Connected to MongoDB');

  // Wipe existing data
  await Promise.all([
    User.deleteMany({}),
    Issue.deleteMany({}),
    Notification.deleteMany({}),
  ]);
  console.log('🗑️   Cleared existing data');

  const hashedPw = await bcrypt.hash('password123', 12);

  // ── Create users ─────────────────────────────────────────
  const admin = await User.create({
    name: 'Admin User', email: 'admin@cityfix.app',
    password: hashedPw, role: 'admin', isActive: true,
  });

  const staffMembers = await User.insertMany([
    {
      name: 'Ravi Kumar', email: 'ravi@cityfix.app', password: hashedPw,
      role: 'staff', staffId: 'STAFF-1001', department: 'Roads & Infrastructure',
      assignedZones: ['Zone A', 'Zone B'], isAvailable: true, isActive: true,
    },
    {
      name: 'Priya Sharma', email: 'priya@cityfix.app', password: hashedPw,
      role: 'staff', staffId: 'STAFF-1002', department: 'Water & Sanitation',
      assignedZones: ['Zone C', 'Zone D'], isAvailable: true, isActive: true,
    },
    {
      name: 'Amit Singh', email: 'amit@cityfix.app', password: hashedPw,
      role: 'staff', staffId: 'STAFF-1003', department: 'Electricity',
      assignedZones: ['Zone A', 'Zone C'], isAvailable: false, isActive: true,
    },
  ]);

  const citizens = await User.insertMany(
    Array.from({ length: 8 }, (_, i) => ({
      name    : `Citizen ${i + 1}`,
      email   : `citizen${i + 1}@example.com`,
      password: hashedPw,
      role    : 'citizen',
      ward    : rand(wards),
      isActive: true,
    }))
  );

  console.log(`👤  Created: 1 admin, ${staffMembers.length} staff, ${citizens.length} citizens`);

  // ── Create issues ─────────────────────────────────────────
  const issueData = Array.from({ length: 30 }, (_, i) => {
    const status     = rand(statuses);
    const assignedTo = ['assigned', 'in_progress', 'resolved'].includes(status)
      ? rand(staffMembers)._id
      : null;
    return {
      title      : `Issue #${i + 1}: ${rand(categories).replace('_', ' ')} problem`,
      description: `There is a ${rand(categories)} issue at ${rand(sampleAddresses)}. Needs immediate attention.`,
      category   : rand(categories),
      priority   : rand(priorities),
      status,
      address    : rand(sampleAddresses),
      ward       : rand(wards),
      zone       : rand(zones),
      coordinates: randCoords(),
      reportedBy : rand(citizens)._id,
      assignedTo,
      resolvedAt : status === 'resolved' ? new Date() : undefined,
      upvoteCount: Math.floor(Math.random() * 20),
      statusHistory: [{ status: 'pending', changedAt: new Date(Date.now() - 86400000 * (i + 1)) }],
    };
  });

  const issues = await Issue.insertMany(issueData);
  console.log(`📋  Created ${issues.length} issues`);

  // ── Create sample notifications ────────────────────────────
  const notifData = citizens.slice(0, 3).map((c, i) => ({
    recipient: c._id,
    type     : 'issue_submitted',
    title    : 'Issue Submitted',
    message  : `Your issue has been submitted. Ticket: CF-${1001 + i}`,
    issue    : issues[i]._id,
    isRead   : false,
  }));

  await Notification.insertMany(notifData);
  console.log(`🔔  Created ${notifData.length} notifications`);

  console.log('\n✅  Seed complete!');
  console.log('─────────────────────────────────────');
  console.log('  Admin   : admin@cityfix.app   / password123');
  console.log('  Staff   : ravi@cityfix.app    / password123');
  console.log('  Citizen : citizen1@example.com / password123');
  console.log('─────────────────────────────────────\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
