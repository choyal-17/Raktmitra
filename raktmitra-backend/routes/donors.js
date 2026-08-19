const router = require('express').Router();
const Donor  = require('../models/Donor');
const auth   = require('../middleware/auth');

// GET /user/donor  - list all donors
router.get('/user/donor', async (req, res) => {
  try {
    const { bloodGroup, city, state } = req.query;
    const filter = {};
    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (city)       filter.city = new RegExp(city, 'i');
    if (state)      filter.state = new RegExp(state, 'i');
    const donors = await Donor.find(filter).sort({ createdAt: -1 });
    res.json(donors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /user/donor/:id  - get donor by id or email
router.get('/user/donor/:id', async (req, res) => {
  try {
    // support lookup by email too
    const donor = await Donor.findOne({
      $or: [
        { _id: req.params.id.match(/^[a-f\d]{24}$/i) ? req.params.id : null },
        { email: req.params.id }
      ]
    });
    if (!donor) return res.status(404).json({ message: 'Donor not found' });
    res.json(donor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /user/check-email  - check if donor email exists
router.get('/user/check-email', async (req, res) => {
  try {
    const donor = await Donor.findOne({ email: req.query.email });
    res.json({ exists: !!donor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /user/register  - register as donor
router.post('/user/register', auth, async (req, res) => {
  try {
    const { name, email, phone, bloodGroup, city, state, age, gender, address } = req.body;
    const existing = await Donor.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Already registered as donor' });

    const donor = await Donor.create({
      name, email, phone, bloodGroup, city, state, age, gender, address,
      userId: req.user.id,
    });
    res.status(201).json(donor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin routes
// GET /admin/donors
router.get('/admin/donors', async (req, res) => {
  try {
    const donors = await Donor.find().sort({ createdAt: -1 });
    res.json(donors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /admin/donors/:id
router.get('/admin/donors/:id', async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) return res.status(404).json({ message: 'Donor not found' });
    res.json(donor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /admin/delete/:id
router.delete('/admin/delete/:id', async (req, res) => {
  try {
    await Donor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
