/*
  # Add Cashfree Payment Fields to Orders Table

  1. New Columns
    - Add payment-related fields to support Cashfree integration
    - Add order tracking and status management fields
    - Add shipping and cart data storage

  2. Security
    - Maintain existing RLS policies
    - Add indexes for better query performance
*/

-- Add new columns to orders table for Cashfree integration
ALTER TABLE orders ADD COLUMN IF NOT EXISTS cf_order_id text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_session_id text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS total_amount decimal(10,2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS currency text DEFAULT 'INR';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_amount decimal(10,2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_currency text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_time timestamptz;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS cart_items jsonb;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_details jsonb;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS webhook_data jsonb;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
ALTER TABLE orders ADD COLUMN IF NOT EXISTS email text;

-- Update the status enum to include new payment-related statuses
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t 
    JOIN pg_enum e ON t.oid = e.enumtypid 
    WHERE t.typname = 'order_status' AND e.enumlabel = 'payment_pending'
  ) THEN
    ALTER TYPE order_status ADD VALUE 'payment_pending';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t 
    JOIN pg_enum e ON t.oid = e.enumtypid 
    WHERE t.typname = 'order_status' AND e.enumlabel = 'payment_failed'
  ) THEN
    ALTER TYPE order_status ADD VALUE 'payment_failed';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t 
    JOIN pg_enum e ON t.oid = e.enumtypid 
    WHERE t.typname = 'order_status' AND e.enumlabel = 'pending_review'
  ) THEN
    ALTER TYPE order_status ADD VALUE 'pending_review';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t 
    JOIN pg_enum e ON t.oid = e.enumtypid 
    WHERE t.typname = 'order_status' AND e.enumlabel = 'cancelled'
  ) THEN
    ALTER TYPE order_status ADD VALUE 'cancelled';
  END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_cf_order_id ON orders(cf_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_session_id ON orders(payment_session_id);
CREATE INDEX IF NOT EXISTS idx_orders_updated_at ON orders(updated_at);

-- Add trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();