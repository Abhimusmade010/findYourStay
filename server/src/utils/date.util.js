

// Converts input into a proper Date object
// Checks if date is valid
// Sets time to midnight (00:00:00)
// Returns clean date
export function normalizeDate(date) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  d.setHours(0, 0, 0, 0);
  return d;
}


// checkOut must be AFTER checkIn
export function validateDateRange(checkIn, checkOut) {
  if (!checkIn || !checkOut) return false;
  return checkOut > checkIn;
}



// Creates an array of all nights between checkIn and checkOut.
// Track booked dates
// Mark calendar unavailable
// Store per-day availability
export function buildDateRangeArray(startDate, endDate) {
  const arr = [];
  const cur = new Date(startDate);
  const end = new Date(endDate);

  while (cur < end) {
    arr.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return arr;
}