import { Router } from 'express';
import { BookingController } from './booking.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { createBookingSchema } from '../../lib/schemas';

const router = Router();

// All booking routes are protected by the auth middleware
router.use(authenticate);

/**
 * @route   POST /api/v1/bookings
 * @desc    Create a new booking
 * @access  Private
 */
router.post('/', validate(createBookingSchema), BookingController.createBooking);

/**
 * @route   GET /api/v1/bookings
 * @desc    Get booking history for the logged-in user
 * @access  Private
 */
router.get('/', BookingController.getUserBookings);

/**
 * @route   GET /api/v1/bookings/:id
 * @desc    Get a single booking's details by ID
 * @access  Private
 */
router.get('/:id', BookingController.getBookingById);

/**
 * @route   POST /api/v1/bookings/:id/cancel
 * @desc    Cancel an existing booking
 * @access  Private
 */
router.post('/:id/cancel', BookingController.cancelBooking);

export default router;