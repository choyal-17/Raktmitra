const router  = require('express').Router();
const Patient = require('../models/Patient');
const auth    = require('../middleware/auth');

// GET /user/patients - list all patients
router.get('/user/patients', async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /user/patient/:id
router.get('/user/patient/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /user/patient/register
router.post('/user/patient/register', auth, async (req, res) => {
  try {
    const { name, email, phone, bloodGroup, city, state, hospital, units, urgency } = req.body;
    const patient = await Patient.create({
      name, email, phone, bloodGroup, city, state, hospital, units, urgency,
      userId: req.user.id,
    });
    res.status(201).json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin routes
// GET /admin/patients
router.get('/admin/patients', async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /admin/patient/:id
router.get('/admin/patient/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
