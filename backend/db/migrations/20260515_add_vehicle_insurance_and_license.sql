ALTER TABLE vehicle
  ADD COLUMN vehicle_license VARCHAR(100) NULL AFTER vehicle_number,
  ADD COLUMN insurance_provider VARCHAR(100) NULL AFTER price_per_day,
  ADD COLUMN insurance_start_date DATE NULL AFTER insurance_provider,
  ADD COLUMN insurance_end_date DATE NULL AFTER insurance_start_date;