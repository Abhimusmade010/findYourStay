ER diagrams Link:https://erdplus.com/diagrams/260771


Implemented the feature in the backend with simple, student-friendly code.

What Was Added

Customer cancel endpoint

POST /api/bookings/:id/cancel
Lets a customer cancel their own booking if it is still Pending or Confirmed.
Confirmed bookings are released from the hotel’s bookedDates before cancellation.
Auto-expiry for old pending bookings

Every new pending booking now gets an expiresAt value.
A scheduled job checks old pending bookings every few minutes.
If a booking is still Pending after expiry, it becomes Expired automatically.
The customer also gets a notification when that happens.
Files Updated

server/src/models/booking.model.js
server/src/services/booking.service.js
server/src/controllers/booking.controller.js
server/src/routes/booking.routes.js
server/src/jobs/pending-booking-expiry.job.js
server/server.js
How It Works

When a booking is created, the backend stores:

status = Pending
expiresAt = current time + expiry minutes
The job runs on an interval and finds:

bookings where status is Pending
expiresAt is less than or equal to the current time
Those bookings are updated to:

status = Expired
cancelledAt = now
cancellationReason = Booking request expired before admin approval
For customer cancellation:

the backend verifies the booking belongs to that customer
only Pending and Confirmed can be cancelled
if Confirmed, the hotel’s bookedDates are cleaned up
booking becomes Cancelled
Small Data Model Improvements
The booking model now also stores:

expiresAt
cancelledAt
cancellationReason
Expired added to the status enum
This makes the booking lifecycle clearer and easier to manage later.

Useful Defaults
The code uses these environment variables if you want to tune timing:

PENDING_BOOKING_EXPIRY_MINUTES
default: 30
PENDING_BOOKING_EXPIRY_JOB_MINUTES
default: 5
If you do not add them, the defaults will still work.

How To Test

Create a booking as a customer.
Check the saved booking in MongoDB:
status should be Pending
expiresAt should be set
Call:
POST /api/bookings/{bookingId}/cancel
Confirm the booking becomes Cancelled.
Create another pending booking and leave it untouched.
Wait until expiry or temporarily set a very small expiry value in env.
Confirm it becomes Expired automatically.
Example API to test

Customer cancel:
POST /api/bookings/BOOKING_ID/cancel
Header: Authorization: Bearer TOKEN
Important Note
I validated the edited files for code errors, and they are clean. I did not start the server in this pass, so runtime verification against your local database is still worth doing.

Why This Version Is Good For Learning

The logic stays inside the service layer, so routes/controllers stay simple.
The scheduled job is just a plain setInterval, which is easy to understand before moving to cron or queues later.
The booking lifecycle is explicit and easier to extend.