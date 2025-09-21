/*
  # Remove product_id column from orders table

  1. Changes
    - Remove product_id column from orders table since we now use cart_items array
    - Remove foreign key constraint
    - Update any indexes that reference product_id

  2. Security
    - Maintains existing RLS policies
*/

-- Remove the foreign key constraint first
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_product_id_fkey;

-- Remove any indexes that reference product_id
DROP INDEX IF EXISTS idx_orders_product_id;

-- Remove the product_id column
ALTER TABLE orders DROP COLUMN IF EXISTS product_id;