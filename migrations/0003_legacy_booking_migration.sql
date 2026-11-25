-- Al Raza Travel Step 03: support idempotent migration from legacy booking documents.
-- Apply after 0002_travel_booking_core.sql on a staging D1 database.
ALTER TABLE travel_bookings ADD COLUMN legacy_id TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS travel_bookings_legacy_idx ON travel_bookings(legacy_id);
ALTER TABLE booking_payments ADD COLUMN type TEXT NOT NULL DEFAULT 'Payment';
