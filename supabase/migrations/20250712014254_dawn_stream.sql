/*
  # Clean up unused database indexes

  This migration removes unused indexes identified by Supabase's database linter.
  These indexes were consuming storage and potentially slowing down write operations
  without providing any query performance benefits.

  ## Indexes being removed:
  1. Orders table indexes (created_at, status) - not being used by current queries
  2. Products table indexes (category, difficulty) - difficulty column doesn't exist
  3. Learning resources indexes - table doesn't exist in current schema
  4. Users table indexes - table doesn't exist in current schema
*/

-- Remove unused indexes from orders table
DROP INDEX IF EXISTS idx_orders_created_at;
DROP INDEX IF EXISTS idx_orders_status;

-- Remove unused indexes from products table
DROP INDEX IF EXISTS idx_products_category;
DROP INDEX IF EXISTS idx_products_difficulty;

-- Remove indexes for non-existent tables
DROP INDEX IF EXISTS idx_learning_resources_type;
DROP INDEX IF EXISTS idx_learning_resources_category;
DROP INDEX IF EXISTS idx_users_email;
DROP INDEX IF EXISTS idx_users_role;
DROP INDEX IF EXISTS idx_users_uid;

-- Note: We keep the indexes that are actually being used:
-- - idx_products_created_at (used for product listing)
-- - idx_orders_product_id (used for order-product joins)
-- - idx_resources_kit_tag (used for resource filtering)
-- - idx_resources_type (used for resource type filtering)
-- - idx_resources_uploaded_at (used for resource ordering)