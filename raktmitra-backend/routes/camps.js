const router    = require('express').Router();
const BloodCamp = require('../models/BloodCamp');
const auth      = require('../middleware/auth');

// GET /api/camps?city=Indore&upcoming=true
router.get('/', async (req, res) => {
  try {
    const { city, state, upcoming, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (city)  filter.city  = new RegExp(city, 'i');
    if (state) filter.state = new RegExp(state, 'i');
    if (upcoming === 'true') filter.date = { $gte: new Date() };

    const camps = await BloodCamp.find(filter)
      .populate('organizer', 'name phone')
      .sort({ date: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await BloodCamp.countDocuments(filter);
    res.json({ camps, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/camps/:id
router.get('/:id', async (req, res) => {
  try {
    const camp = await BloodCamp.findById(req.params.id)
      .populate('organizer', 'name phone email')
      .populate('registeredDonors', 'name bloodGroup city');
    if (!camp) return res.status(404).json({ message: 'Camp not found' });
    res.json(camp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/camps  - create camp (protected)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, venue, city, state, date, startTime, endTime, contactPhone, targetUnits } = req.body;
    const camp = await BloodCamp.create({
      organizer: req.user.id,
      title, description, venue, city, state, date, startTime, endTime, contactPhone, targetUnits,
    });
    res.status(201).json(camp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/camps/:id/register  - register as donor for a camp (protected)
router.post('/:id/register', auth, async (req, res) => {
  try {
    const camp = await BloodCamp.findById(req.params.id);
    if (!camp) return res.status(404).json({ message: 'Camp not found' });

    if (camp.registeredDonors.includes(req.user.id))
      return res.status(400).json({ message: 'Already registered' });

    camp.registeredDonors.push(req.user.id);
    await camp.save();
    res.json({ message: 'Registered successfully', registeredCount: camp.registeredDonors.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/camps/:id/register  - unregister from camp (protected)
router.delete('/:id/register', auth, async (req, res) => {
  try {
    const camp = await BloodCamp.findById(req.params.id);
    if (!camp) return res.status(404).json({ message: 'Camp not found' });

    camp.registeredDonors = camp.registeredDonors.filter(d => d.toString() !== req.user.id);
    await camp.save();
    res.json({ message: 'Unregistered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/camps/:id  - delete own camp (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const camp = await BloodCamp.findById(req.params.id);
    if (!camp) return res.status(404).json({ message: 'Camp not found' });
    if (camp.organizer.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    await camp.deleteOne();
    res.json({ message: 'Camp deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
