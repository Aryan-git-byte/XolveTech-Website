/*
# Create contacts table for contact form submissions

1. New Tables
  - `contacts`
    - `id` (uuid, primary key)
    - `name` (text, sender's name)
    - `email` (text, email address)
    - `message` (text, inquiry content)
    - `timestamp` (timestamp)

2. Security
  - Enable RLS on `contacts` table
  - Add policy for public insert access
  - Add policy for admin read access
*/

CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  timestamp timestamptz DEFAULT now()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can send messages"
  ON contacts
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Only admin can view messages"
  ON contacts
  FOR SELECT
  TO authenticated
  USING (auth.email() = 'xolvetech@gmail.com');