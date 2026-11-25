-- Al Raza Travel: structured booking and payment foundation
-- Apply to a staging D1 database first. Safe to run repeatedly.
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  cnic TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS customers_phone_idx ON customers(phone);

CREATE TABLE IF NOT EXISTS travel_bookings (
  id TEXT PRIMARY KEY,
  ref TEXT NOT NULL UNIQUE,
  customer_id TEXT NOT NULL REFERENCES customers(id),
  agent_username TEXT NOT NULL,
  package_id TEXT,
  package_name TEXT,
  departure_date TEXT,
  return_date TEXT,
  room_type TEXT,
  adults INTEGER NOT NULL DEFAULT 1,
  children INTEGER NOT NULL DEFAULT 0,
  infants INTEGER NOT NULL DEFAULT 0,
  total_pkr INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Inquiry',
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS travel_bookings_agent_idx ON travel_bookings(agent_username, created_at);
CREATE INDEX IF NOT EXISTS travel_bookings_status_idx ON travel_bookings(status, departure_date);

CREATE TABLE IF NOT EXISTS booking_passengers (
  id TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL REFERENCES travel_bookings(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  gender TEXT,
  date_of_birth TEXT,
  passport_number TEXT,
  passport_expiry TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS booking_passengers_booking_idx ON booking_passengers(booking_id);

CREATE TABLE IF NOT EXISTS booking_payments (
  id TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL REFERENCES travel_bookings(id),
  amount_pkr INTEGER NOT NULL CHECK(amount_pkr > 0),
  method TEXT,
  reference TEXT,
  received_at TEXT NOT NULL,
  received_by TEXT NOT NULL,
  notes TEXT
);
CREATE INDEX IF NOT EXISTS booking_payments_booking_idx ON booking_payments(booking_id, received_at);

CREATE TABLE IF NOT EXISTS travel_audit_logs (
  id TEXT PRIMARY KEY,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  details TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS travel_audit_entity_idx ON travel_audit_logs(entity_type, entity_id, created_at);

