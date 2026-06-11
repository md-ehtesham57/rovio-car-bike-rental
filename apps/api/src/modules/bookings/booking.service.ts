import { Booking, IBooking } from './booking.model';
import { Vehicle } from '../vehicles/vehicle.model';
import { AppError } from '../../middleware/error.middleware';

export class BookingService {
  /**
   * Create a new vehicle booking
   */
  static async createBooking(
    userId: string, 
    vehicleId: string, 
    startDate: Date, 
    endDate: Date, 
    totalPrice: number
  ): Promise<IBooking> {
    // 1. Verify vehicle existence and availability
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      throw new AppError('Vehicle not found', 404);
    }

    if (vehicle.status !== 'active' || !vehicle.available) {
      throw new AppError('Vehicle is currently not available for rent', 400);
    }

    // 2. Prevent booking own vehicle
    if (vehicle.sellerId.toString() === userId) {
      throw new AppError('You cannot rent your own vehicle', 400);
    }

    // 3. Date conflict check (overlapping active bookings)
    const overlappingBooking = await Booking.findOne({
      vehicleId,
      status: { $in: ['pending', 'confirmed', 'active'] },
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
      ]
    });

    if (overlappingBooking) {
      throw new AppError('Vehicle is already booked for the selected dates', 400);
    }

    // 4. Create booking instance
    const booking = new Booking({
      userId,
      vehicleId,
      startDate,
      endDate,
      totalPrice,
      status: 'pending'
    });

    return await booking.save();
  }

  /**
   * Get a single booking by ID with authorization check
   */
  static async getBookingById(bookingId: string, userId: string, userRole: string): Promise<IBooking> {
    const booking = await Booking.findById(bookingId).populate('vehicleId');
    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    // Authorization: User who booked, vehicle owner (seller), or admin can view
    const isOwner = booking.userId.toString() === userId;
    
    const vehicle = booking.vehicleId as any;
    const isSeller = vehicle && vehicle.sellerId && vehicle.sellerId.toString() === userId;
    const isAdmin = userRole === 'admin';

    if (!isOwner && !isSeller && !isAdmin) {
      throw new AppError('Unauthorized to view this booking', 403);
    }

    return booking;
  }

  /**
   * Cancel a booking
   */
  static async cancelBooking(bookingId: string, userId: string): Promise<IBooking> {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    // Only the user who made the booking can cancel it here
    if (booking.userId.toString() !== userId) {
      throw new AppError('Unauthorized to cancel this booking', 403);
    }

    if (booking.status === 'cancelled') {
      throw new AppError('Booking is already cancelled', 400);
    }

    if (['active', 'completed'].includes(booking.status)) {
      throw new AppError(`Bookings that are ${booking.status} cannot be cancelled`, 400);
    }

    booking.status = 'cancelled';
    return await booking.save();
  }

  /**
   * List all bookings for a specific user (History)
   */
  static async getUserBookings(userId: string): Promise<IBooking[]> {
    return await Booking.find({ userId })
      .populate('vehicleId')
      .sort({ createdAt: -1 });
  }
}