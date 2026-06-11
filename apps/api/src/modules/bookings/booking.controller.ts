import { Response } from 'express';
import { AuthRequest } from '../../types';
import { BookingService } from './booking.service';

export class BookingController {
  /**
   * Create a new booking
   * POST /api/v1/bookings
   */
  static async createBooking(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { vehicleId, startDate, endDate, totalPrice } = req.body;

    const booking = await BookingService.createBooking(
      userId,
      vehicleId,
      new Date(startDate),
      new Date(endDate),
      totalPrice
    );

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  }

  /**
   * Get a single booking's details
   * GET /api/v1/bookings/:id
   */
  static async getBookingById(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const userRole = req.user?.role || 'user';
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const bookingId = String(req.params.id);
    const booking = await BookingService.getBookingById(bookingId, userId, userRole);

    res.status(200).json({
      success: true,
      data: booking
    });
  }

  /**
   * Cancel an existing booking
   * POST /api/v1/bookings/:id/cancel
   */
  static async cancelBooking(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const bookingId = String(req.params.id);
    const booking = await BookingService.cancelBooking(bookingId, userId);

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  }

  /**
   * Get booking history for the logged-in user
   * GET /api/v1/bookings
   */
  static async getUserBookings(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const bookings = await BookingService.getUserBookings(userId);

    res.status(200).json({
      success: true,
      data: bookings
    });
  }
}