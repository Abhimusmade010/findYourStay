import { expirePendingBookingsService } from "../services/booking.service.js";

const JOB_INTERVAL_MINUTES = Number(process.env.PENDING_BOOKING_EXPIRY_JOB_MINUTES || 5);

export const startPendingBookingExpiryJob = () => {
  const runExpiryCheck = async () => {
    try {
      const { expiredCount } = await expirePendingBookingsService();
      if (expiredCount > 0) {
        console.log(`Expired ${expiredCount} pending booking(s)`);
      }
    } catch (error) {
      console.error("Pending booking expiry job failed:", error.message);
    }
  };

  runExpiryCheck();

  setInterval(runExpiryCheck, JOB_INTERVAL_MINUTES * 60 * 1000);
  console.log(`Pending booking expiry job started. Interval: ${JOB_INTERVAL_MINUTES} minute(s)`);
};
