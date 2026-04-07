import express from 'express';
import Booking from '../models/Booking.js';

const router = express.Router();

const normalizePhone = (value = '') => value.replace(/\s+/g, '').trim();

router.post('/', async (req, res) => {
  try {
    const payload = {
      ...req.body,
      phoneNumber: normalizePhone(req.body.phoneNumber),
    };

    const booking = await Booking.create(payload);
    res.status(201).json({ message: 'Passenger details added successfully.', booking });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'A booking already exists for this phone number.' });
    }

    return res.status(400).json({ message: error.message || 'Unable to create booking.' });
  }
});

router.get('/', async (_req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch bookings.' });
  }
});

router.get('/:phoneNumber', async (req, res) => {
  try {
    const booking = await Booking.findOne({ phoneNumber: normalizePhone(req.params.phoneNumber) });

    if (!booking) {
      return res.status(404).json({ message: 'Passenger record not found.' });
    }

    return res.json(booking);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch the passenger record.' });
  }
});

router.put('/:phoneNumber', async (req, res) => {
  try {
    const currentPhone = normalizePhone(req.params.phoneNumber);
    const updatedPhone = normalizePhone(req.body.phoneNumber || currentPhone);

    const booking = await Booking.findOneAndUpdate(
      { phoneNumber: currentPhone },
      {
        ...req.body,
        phoneNumber: updatedPhone,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!booking) {
      return res.status(404).json({ message: 'Passenger record not found.' });
    }

    return res.json({ message: 'Passenger details updated successfully.', booking });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Another record already uses this phone number.' });
    }

    return res.status(400).json({ message: error.message || 'Unable to update booking.' });
  }
});

router.delete('/:phoneNumber', async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({ phoneNumber: normalizePhone(req.params.phoneNumber) });

    if (!booking) {
      return res.status(404).json({ message: 'Passenger record not found.' });
    }

    return res.json({ message: 'Passenger record deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to delete the passenger record.' });
  }
});

export default router;
