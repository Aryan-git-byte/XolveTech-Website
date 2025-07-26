/*
  # Create missing tables for XolveTech application

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `price` (integer)
      - `category` (text)
      - `kit_contents` (text array)
      - `learning_outcomes` (text array)
      - `tools_required` (text array)
      - `assembly_steps` (text)
      - `image_url` (text, optional)
      - `created_at` (timestamp)

    - `orders`
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key to products)
      - `name` (text)
      - `contact` (text)
      - `address` (text)
      - `status` (enum: pending, confirmed, delivered)
      - `created_at` (timestamp)

    - `resources`
      - `id` (uuid, primary key)
      - `title` (text)
      - `type` (enum: pdf, video)
      - `kit_tag` (text)
      - `file_url` (text)
      - `uploaded_at` (timestamp)

  2. Security
    - Enable RLS on all new tables
    - Add policies for public access to products and resources
    - Add policies for authenticated admin access to orders
    - Contacts table already exists with proper policies

  3. Changes
    - Create ENUM types for order status and resource type
    - Add foreign key relationship between orders and products
    - Set up proper indexes for performance
*/

-- Create ENUM types
DO $$ BEGIN
  CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'delivered');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE resource_type AS ENUM ('pdf', 'video');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  title text NOT NULL,
  description text NOT NULL,
  price integer NOT NULL,
  category text NOT NULL,
  kit_contents text[] DEFAULT '{}',
  learning_outcomes text[] DEFAULT '{}',
  tools_required text[] DEFAULT '{}',
  assembly_steps text DEFAULT '',
  image_url text
);

-- Create orders table with foreign key to products
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name text NOT NULL,
  contact text NOT NULL,
  address text NOT NULL,
  status order_status DEFAULT 'pending'
);

-- Create resources table
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  uploaded_at timestamptz DEFAULT now(),
  title text NOT NULL,
  type resource_type NOT NULL,
  kit_tag text NOT NULL,
  file_url text NOT NULL
);

-- Enable RLS on all new tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Products policies (public read access, admin write access)
CREATE POLICY "Anyone can view products"
  ON products
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin can manage products"
  ON products
  FOR ALL
  TO authenticated
  USING (auth.email() = 'xolvetech@gmail.com');

-- Orders policies (admin only access)
CREATE POLICY "Admin can view all orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.email() = 'xolvetech@gmail.com');

CREATE POLICY "Anyone can create orders"
  ON orders
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admin can update orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (auth.email() = 'xolvetech@gmail.com');

-- Resources policies (public read access, admin write access)
CREATE POLICY "Anyone can view resources"
  ON resources
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin can manage resources"
  ON resources
  FOR ALL
  TO authenticated
  USING (auth.email() = 'xolvetech@gmail.com');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_product_id ON orders(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);
CREATE INDEX IF NOT EXISTS idx_resources_kit_tag ON resources(kit_tag);
CREATE INDEX IF NOT EXISTS idx_resources_uploaded_at ON resources(uploaded_at);