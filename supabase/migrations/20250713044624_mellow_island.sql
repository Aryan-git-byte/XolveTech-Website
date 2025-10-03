/*
  # Fix Order ID Type Issue

  1. Changes
    - Change orders.id from UUID to TEXT to support custom order IDs like XLV_...
    - Update foreign key constraints
    - Ensure proper indexing

  2. Security
    - Maintain existing RLS policies
    - Keep all security constraints intact
*/

-- First, we need to drop the foreign key constraint from any tables that reference orders.id
-- (Currently no tables reference orders.id based on the schema, but let's be safe)

-- Change the orders.id column from UUID to TEXT
ALTER TABLE orders ALTER COLUMN id TYPE TEXT;

-- Update the default value generation to use custom format instead of UUID
ALTER TABLE orders ALTER COLUMN id DROP DEFAULT;

-- Ensure the primary key constraint is maintained
-- (It should automatically work with TEXT type)

-- Add a check constraint to ensure order IDs follow the expected format
ALTER TABLE orders ADD CONSTRAINT orders_id_format_check 
  CHECK (id ~ '^XLV_[0-9]+_[0-9]+$');

-- Create an index on the new TEXT id column for performance
CREATE INDEX IF NOT EXISTS idx_orders_id ON orders(id);

-- Update any existing UUID-based order IDs to the new format (if any exist)
-- This is safe to run even if no data exists
UPDATE orders 
SET id = 'XLV_' || extract(epoch from created_at)::bigint || '_' || (random() * 1000)::int
WHERE id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';