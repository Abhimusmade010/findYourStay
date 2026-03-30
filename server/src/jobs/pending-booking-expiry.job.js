import { expirePendingBookingsService } from "../services/booking.service.js";

//i want to cancel the booking after 24 hours of the booking creation if the booking is still in pending state and 
// also send a notification to the customer about the cancellation of the booking due to expiry of the pending state and
// also update the availability of the hotel rooms accordinglyj

const JOB_INTERVAL_MINUTES = Number(process.env.PENDING_BOOKING_EXPIRY_JOB_MINUTES || 60); 


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
