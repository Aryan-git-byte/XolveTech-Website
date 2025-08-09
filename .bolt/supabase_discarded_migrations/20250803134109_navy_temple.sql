/*
  # Add image_urls column to products table

  1. Changes
    - Add image_urls column as text array to support multiple product images
    - Migrate existing image_url data to new image_urls array format
    - Remove old image_url column after migration

  2. Security
    - Maintains existing RLS policies
    - No changes to access permissions
*/

-- Add the new image_urls column as text array
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_urls text[];

-- Migrate existing image_url data to image_urls array
UPDATE products 
SET image_urls = CASE 
  WHEN image_url IS NOT NULL AND image_url != '' THEN ARRAY[image_url]
  ELSE NULL
END
WHERE image_urls IS NULL;

-- Remove the old image_url column
ALTER TABLE products DROP COLUMN IF EXISTS image_url;