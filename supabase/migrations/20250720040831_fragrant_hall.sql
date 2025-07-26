/*
  # Create Components and Custom Projects Tables

  1. New Tables
    - `components`
      - `id` (uuid, primary key)
      - `name` (text, component name)
      - `price` (integer, price in rupees)
      - `image_url` (text, optional image)
      - `stock_status` (boolean, in stock status)
      - `description` (text, component details)
      - `category` (text, component category)
      - `created_at` (timestamp)

    - `component_requests`
      - `id` (uuid, primary key)
      - `name` (text, requester name)
      - `email` (text, contact email)
      - `component` (text, requested component name)
      - `reason` (text, optional usage description)
      - `created_at` (timestamp)

    - `custom_projects`
      - `id` (uuid, primary key)
      - `name` (text, customer name)
      - `contact_info` (text, email/phone)
      - `project_desc` (text, project description)
      - `budget_range` (text, budget range)
      - `image_url` (text, optional sketch/image)
      - `status` (text, project status)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Public read access for components
    - Public insert for requests
    - Admin-only access for management

  3. Updates
    - Add order_type column to orders table
*/

-- Create components table
CREATE TABLE IF NOT EXISTS components (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price integer NOT NULL,
  image_url text,
  stock_status boolean DEFAULT true,
  description text NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create component_requests table
CREATE TABLE IF NOT EXISTS component_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  component text NOT NULL,
  reason text,
  created_at timestamptz DEFAULT now()
);

-- Create custom_projects table
CREATE TABLE IF NOT EXISTS custom_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  contact_info text NOT NULL,
  project_desc text NOT NULL,
  budget_range text NOT NULL,
  image_url text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Add order_type column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_type text DEFAULT 'kit';

-- Enable RLS on all new tables
ALTER TABLE components ENABLE ROW LEVEL SECURITY;
ALTER TABLE component_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_projects ENABLE ROW LEVEL SECURITY;

-- Components policies (public read, admin write)
CREATE POLICY "Anyone can view components"
  ON components
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin can manage components"
  ON components
  FOR ALL
  TO authenticated
  USING (auth.email() = 'xolvetech@gmail.com');

-- Component requests policies (public insert, admin read)
CREATE POLICY "Anyone can submit component requests"
  ON component_requests
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admin can view component requests"
  ON component_requests
  FOR SELECT
  TO authenticated
  USING (auth.email() = 'xolvetech@gmail.com');

-- Custom projects policies (public insert, admin read/update)
CREATE POLICY "Anyone can submit custom projects"
  ON custom_projects
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admin can view custom projects"
  ON custom_projects
  FOR SELECT
  TO authenticated
  USING (auth.email() = 'xolvetech@gmail.com');

CREATE POLICY "Admin can update custom projects"
  ON custom_projects
  FOR UPDATE
  TO authenticated
  USING (auth.email() = 'xolvetech@gmail.com');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_components_category ON components(category);
CREATE INDEX IF NOT EXISTS idx_components_stock_status ON components(stock_status);
CREATE INDEX IF NOT EXISTS idx_components_created_at ON components(created_at);
CREATE INDEX IF NOT EXISTS idx_component_requests_created_at ON component_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_custom_projects_status ON custom_projects(status);
CREATE INDEX IF NOT EXISTS idx_custom_projects_created_at ON custom_projects(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_order_type ON orders(order_type);