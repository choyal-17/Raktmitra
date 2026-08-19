const router       = require('express').Router();
const BloodRequest = require('../models/BloodRequest');
const auth         = require('../middleware/auth');

// GET /api/requests?bloodGroup=O+&city=Indore&status=Open&page=1
// Public - view all blood requests
router.get('/', async (req, res) => {
  try {
    const { bloodGroup, city, state, status = 'Open', urgency, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status)     filter.status = status;
    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (city)       filter.city = new RegExp(city, 'i');
    if (state)      filter.state = new RegExp(state, 'i');
    if (urgency)    filter.urgency = urgency;

    const requests = await BloodRequest.find(filter)
      .populate('requester', 'name phone city')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await BloodRequest.countDocuments(filter);
    res.json({ requests, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/requests/:id
router.get('/:id', async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id).populate('requester', 'name phone city state');
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/requests  - create (protected)
router.post('/', auth, async (req, res) => {
  try {
    const { patientName, bloodGroup, units, hospital, city, state, contactPhone, urgency, description } = req.body;
    const request = await BloodRequest.create({
      requester: req.user.id,
      patientName, bloodGroup, units, hospital, city, state, contactPhone, urgency, description,
    });
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/requests/:id  - update own request (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.requester.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    const allowed = ['patientName', 'units', 'hospital', 'city', 'state', 'contactPhone', 'urgency', 'status', 'description'];
    allowed.forEach(k => { if (req.body[k] !== undefined) request[k] = req.body[k]; });
    await request.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/requests/:id  - delete own request (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.requester.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    await request.deleteOne();
    res.json({ message: 'Request deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/requests/my/requests  - get current user's own requests (protected)
router.get('/my/requests', auth, async (req, res) => {
  try {
    const requests = await BloodRequest.find({ requester: req.user.id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
