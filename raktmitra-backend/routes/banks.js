const router    = require('express').Router();
const BloodBank = require('../models/BloodBank');

// GET /banks - public list
router.get('/banks', async (req, res) => {
  try {
    const banks = await BloodBank.find().sort({ name: 1 });
    res.json(banks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin routes
// GET /admin/banks
router.get('/admin/banks', async (req, res) => {
  try {
    const banks = await BloodBank.find().sort({ createdAt: -1 });
    res.json(banks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /admin/add
router.post('/admin/add', async (req, res) => {
  try {
    const { name, city, state, phone, address, email } = req.body;
    const bank = await BloodBank.create({ name, city, state, phone, address, email });
    res.status(201).json(bank);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /admin/delete/:id
router.delete('/admin/delete/:id', async (req, res) => {
  try {
    await BloodBank.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
