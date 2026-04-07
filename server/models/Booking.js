import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    passengerName: {
      type: String,
      required: [true, 'Passenger name is required'],
      trim: true,
    },
    from: {
      type: String,
      required: [true, 'Origin is required'],
      trim: true,
    },
    to: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true,
    },
    travelDate: {
      type: Date,
      required: [true, 'Travel date is required'],
    },
    departureDate: {
      type: Date,
      required: [true, 'Departure date is required'],
    },
    arrivalDate: {
      type: Date,
      required: [true, 'Arrival date is required'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Booking', bookingSchema);
