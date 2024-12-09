ALTER TABLE reservations
ADD COLUMN created_by_id BIGINT,
ADD CONSTRAINT fk_reservation_created_by FOREIGN KEY (created_by_id) REFERENCES users(id);

-- Make the column NOT NULL after adding it to avoid issues with existing records
ALTER TABLE reservations ALTER COLUMN created_by_id SET NOT NULL;
