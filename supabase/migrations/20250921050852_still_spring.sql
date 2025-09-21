/*
  # Partner Management System for XolveTech

  1. New Tables
    - `users` - Partner authentication and profiles
    - `partners` - Extended partner information with profit shares
    - `projects` - Project containers for organizing work
    - `task_buckets` - Kanban-style task organization
    - `tasks` - Individual tasks with full project management features
    - `work_logs` - Work time tracking and deliverables
    - `expense_logs` - Expense tracking with receipts and approvals
    - `transaction_logs` - Income tracking
    - `contribution_logs` - Partner capital contributions
    - `withdrawal_logs` - Money withdrawal tracking
    - `comments` - Comments system for all logs and tasks
    - `attachments` - File storage references
    - `notifications` - Real-time notifications
    - `audit_trail_entries` - Immutable audit history

  2. Security
    - Enable RLS on all tables
    - Partner-specific access policies
    - Admin approval workflows

  3. Features
    - Complete log management system
    - Task/project management with Kanban
    - Approval workflows
    - Audit trails
    - Partner profit sharing tracking
*/

-- Create custom types
CREATE TYPE log_status AS ENUM ('pending', 'approved', 'rejected', 'archived');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'delivered', 'payment_pending', 'payment_failed', 'pending_review', 'cancelled');
CREATE TYPE resource_type AS ENUM ('pdf', 'video');

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text,
  role text DEFAULT 'partner',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create partners table with profit sharing info
CREATE TABLE IF NOT EXISTS partners (
  id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  full_name text,
  organization text,
  contact_email text UNIQUE,
  phone_number text,
  profit_share_percentage decimal(5,2) DEFAULT 25.00,
  total_contributions decimal(12,2) DEFAULT 0,
  total_withdrawals decimal(12,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create task buckets (Kanban columns)
CREATE TABLE IF NOT EXISTS task_buckets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  order_index integer NOT NULL,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE task_buckets ENABLE ROW LEVEL SECURITY;

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  status text DEFAULT 'open',
  due_date date,
  priority text,
  assigned_to uuid REFERENCES users(id),
  bucket_id uuid REFERENCES task_buckets(id),
  project_id uuid REFERENCES projects(id),
  is_recurring boolean DEFAULT false,
  parent_task_id uuid REFERENCES tasks(id),
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create attachments table
CREATE TABLE IF NOT EXISTS attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text,
  file_size bigint,
  uploaded_by uuid REFERENCES users(id),
  uploaded_at timestamptz DEFAULT now()
);

ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;

-- Create work logs table
CREATE TABLE IF NOT EXISTS work_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  status log_status DEFAULT 'pending',
  decision_by uuid REFERENCES users(id),
  decision_at timestamptz,
  signed_off_at timestamptz,
  attachments jsonb DEFAULT '[]',
  tags text[] DEFAULT '{}',
  project_id uuid REFERENCES projects(id),
  notes text,
  -- Work-specific fields
  title text NOT NULL,
  project text,
  hours_spent decimal(5,2),
  date date,
  deliverables text,
  code_repo_link text,
  blockers text,
  task_priority text,
  due_date date
);

ALTER TABLE work_logs ENABLE ROW LEVEL SECURITY;

-- Create expense logs table
CREATE TABLE IF NOT EXISTS expense_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  status log_status DEFAULT 'pending',
  decision_by uuid REFERENCES users(id),
  decision_at timestamptz,
  signed_off_at timestamptz,
  attachments jsonb DEFAULT '[]',
  tags text[] DEFAULT '{}',
  project_id uuid REFERENCES projects(id),
  notes text,
  -- Expense-specific fields
  title text NOT NULL,
  description text,
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'INR',
  category text,
  vendor_name text,
  purchase_date date,
  payment_method text,
  invoice_number text,
  gst_applicable boolean DEFAULT false,
  gst_amount decimal(10,2),
  reimbursable boolean DEFAULT false,
  reimbursement_to text,
  bank_txn_id text,
  proof_image text,
  estimated_budget decimal(10,2),
  priority text
);

ALTER TABLE expense_logs ENABLE ROW LEVEL SECURITY;

-- Create transaction logs table
CREATE TABLE IF NOT EXISTS transaction_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  status log_status DEFAULT 'pending',
  decision_by uuid REFERENCES users(id),
  decision_at timestamptz,
  signed_off_at timestamptz,
  attachments jsonb DEFAULT '[]',
  tags text[] DEFAULT '{}',
  project_id uuid REFERENCES projects(id),
  notes text,
  -- Transaction-specific fields
  title text NOT NULL,
  amount decimal(10,2) NOT NULL,
  mode text,
  customer_name text,
  invoice_id text,
  received_date date
);

ALTER TABLE transaction_logs ENABLE ROW LEVEL SECURITY;

-- Create contribution logs table
CREATE TABLE IF NOT EXISTS contribution_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  status log_status DEFAULT 'pending',
  decision_by uuid REFERENCES users(id),
  decision_at timestamptz,
  signed_off_at timestamptz,
  attachments jsonb DEFAULT '[]',
  tags text[] DEFAULT '{}',
  project_id uuid REFERENCES projects(id),
  notes text,
  -- Contribution-specific fields
  contribution_type text NOT NULL,
  amount decimal(10,2),
  mode text,
  proof text,
  remarks text
);

ALTER TABLE contribution_logs ENABLE ROW LEVEL SECURITY;

-- Create withdrawal logs table
CREATE TABLE IF NOT EXISTS withdrawal_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  status log_status DEFAULT 'pending',
  decision_by uuid REFERENCES users(id),
  decision_at timestamptz,
  signed_off_at timestamptz,
  attachments jsonb DEFAULT '[]',
  tags text[] DEFAULT '{}',
  project_id uuid REFERENCES projects(id),
  notes text,
  -- Withdrawal-specific fields
  purpose text NOT NULL,
  amount decimal(10,2) NOT NULL,
  method text,
  requested_by uuid REFERENCES users(id),
  approved_by uuid REFERENCES users(id),
  withdrawal_date date,
  balance_after decimal(10,2),
  emergency_flag boolean DEFAULT false
);

ALTER TABLE withdrawal_logs ENABLE ROW LEVEL SECURITY;

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  log_id uuid,
  task_id uuid REFERENCES tasks(id)
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Add foreign key constraints for comments to different log types
ALTER TABLE comments ADD CONSTRAINT fk_comment_work_log 
  FOREIGN KEY (log_id) REFERENCES work_logs(id);
ALTER TABLE comments ADD CONSTRAINT fk_comment_expense_log 
  FOREIGN KEY (log_id) REFERENCES expense_logs(id);
ALTER TABLE comments ADD CONSTRAINT fk_comment_transaction_log 
  FOREIGN KEY (log_id) REFERENCES transaction_logs(id);
ALTER TABLE comments ADD CONSTRAINT fk_comment_contribution_log 
  FOREIGN KEY (log_id) REFERENCES contribution_logs(id);
ALTER TABLE comments ADD CONSTRAINT fk_comment_withdrawal_log 
  FOREIGN KEY (log_id) REFERENCES withdrawal_logs(id);

-- Add constraint to ensure comment belongs to either a log or task
ALTER TABLE comments ADD CONSTRAINT chk_comment_target 
  CHECK (
    (log_id IS NOT NULL AND task_id IS NULL) OR 
    (log_id IS NULL AND task_id IS NOT NULL)
  );

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id uuid REFERENCES users(id),
  message text NOT NULL,
  type text,
  read_at timestamptz,
  created_at timestamptz DEFAULT now(),
  related_entity_id uuid,
  related_entity_type text
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create audit trail table
CREATE TABLE IF NOT EXISTS audit_trail_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  action text NOT NULL,
  old_value jsonb,
  new_value jsonb,
  changed_by uuid REFERENCES users(id),
  changed_at timestamptz DEFAULT now()
);

ALTER TABLE audit_trail_entries ENABLE ROW LEVEL SECURITY;

-- Insert default partners
INSERT INTO users (id, email, full_name, role) VALUES
  ('00000000-0000-0000-0000-000000000001', 'aryan@xolvetech.in', 'Aryan Kumar', 'founder'),
  ('00000000-0000-0000-0000-000000000002', 'ayush@xolvetech.in', 'Ayush', 'partner'),
  ('00000000-0000-0000-0000-000000000003', 'rishav@xolvetech.in', 'Rishav', 'partner'),
  ('00000000-0000-0000-0000-000000000004', 'shubham@xolvetech.in', 'Shubham', 'partner')
ON CONFLICT (email) DO NOTHING;

INSERT INTO partners (id, full_name, contact_email, profit_share_percentage) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Aryan Kumar', 'aryan@xolvetech.in', 40.00),
  ('00000000-0000-0000-0000-000000000002', 'Ayush', 'ayush@xolvetech.in', 20.00),
  ('00000000-0000-0000-0000-000000000003', 'Rishav', 'rishav@xolvetech.in', 20.00),
  ('00000000-0000-0000-0000-000000000004', 'Shubham', 'shubham@xolvetech.in', 20.00)
ON CONFLICT (contact_email) DO NOTHING;

-- Create default task buckets
INSERT INTO task_buckets (name, order_index, created_by) VALUES
  ('To Do', 1, '00000000-0000-0000-0000-000000000001'),
  ('In Progress', 2, '00000000-0000-0000-0000-000000000001'),
  ('Review', 3, '00000000-0000-0000-0000-000000000001'),
  ('Done', 4, '00000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

-- RLS Policies

-- Users policies
CREATE POLICY "Partners can view their own profile." ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Partners can update their own profile." ON users
  FOR UPDATE USING (auth.uid() = id);

-- Partners policies
CREATE POLICY "Partners can view their own profile." ON partners
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Partners can update their own profile." ON partners
  FOR UPDATE USING (auth.uid() = id);

-- Projects policies
CREATE POLICY "Partners can view their projects." ON projects
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Partners can create projects." ON projects
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Partners can update their projects." ON projects
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Partners can delete their projects." ON projects
  FOR DELETE USING (auth.uid() = created_by);

-- Task buckets policies
CREATE POLICY "Partners can view task buckets." ON task_buckets
  FOR SELECT USING (true);

CREATE POLICY "Partners can create task buckets." ON task_buckets
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Partners can update task buckets." ON task_buckets
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Partners can delete task buckets." ON task_buckets
  FOR DELETE USING (auth.uid() = created_by);

-- Tasks policies
CREATE POLICY "Partners can manage their own tasks." ON tasks
  FOR ALL USING (auth.uid() = created_by OR auth.uid() = assigned_to);

-- Work logs policies
CREATE POLICY "Partners can manage their own work logs." ON work_logs
  FOR ALL USING (auth.uid() = created_by);

-- Expense logs policies
CREATE POLICY "Partners can manage their own expense logs." ON expense_logs
  FOR ALL USING (auth.uid() = created_by);

-- Transaction logs policies
CREATE POLICY "Partners can manage their own transaction logs." ON transaction_logs
  FOR ALL USING (auth.uid() = created_by);

-- Contribution logs policies
CREATE POLICY "Partners can manage their own contribution logs." ON contribution_logs
  FOR ALL USING (auth.uid() = created_by);

-- Withdrawal logs policies
CREATE POLICY "Partners can manage their own withdrawal logs." ON withdrawal_logs
  FOR ALL USING (auth.uid() = created_by OR auth.uid() = requested_by OR auth.uid() = approved_by);

-- Comments policies
CREATE POLICY "Partners can manage their own comments." ON comments
  FOR ALL USING (auth.uid() = created_by);

-- Attachments policies
CREATE POLICY "Partners can view their own attachments." ON attachments
  FOR SELECT USING (auth.uid() = uploaded_by);

CREATE POLICY "Partners can upload attachments." ON attachments
  FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Partners can delete their own attachments." ON attachments
  FOR DELETE USING (auth.uid() = uploaded_by);

-- Notifications policies
CREATE POLICY "Users can view their own notifications." ON notifications
  FOR SELECT USING (auth.uid() = recipient_id);

CREATE POLICY "Users can update their own notifications." ON notifications
  FOR UPDATE USING (auth.uid() = recipient_id);

CREATE POLICY "Users can create notifications." ON notifications
  FOR INSERT WITH CHECK (auth.uid() = recipient_id);

-- Audit trail policies (read-only for partners)
CREATE POLICY "Partners can view audit trail." ON audit_trail_entries
  FOR SELECT USING (true);

-- Helper functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user_partner()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  
  -- Create partner profile if email matches known partners
  IF NEW.email IN ('aryan@xolvetech.in', 'ayush@xolvetech.in', 'rishav@xolvetech.in', 'shubham@xolvetech.in') THEN
    INSERT INTO partners (id, full_name, contact_email)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email);
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql' security definer;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created_partner
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_partner();

-- Function to log database changes
CREATE OR REPLACE FUNCTION log_database_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_trail_entries (
    entity_type,
    entity_id,
    action,
    old_value,
    new_value,
    changed_by
  ) VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END,
    auth.uid()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql' security definer;

-- Add audit triggers to important tables
CREATE TRIGGER audit_work_logs_changes
  AFTER INSERT OR UPDATE OR DELETE ON work_logs
  FOR EACH ROW EXECUTE FUNCTION log_database_changes();

CREATE TRIGGER audit_expense_logs_changes
  AFTER INSERT OR UPDATE OR DELETE ON expense_logs
  FOR EACH ROW EXECUTE FUNCTION log_database_changes();

CREATE TRIGGER audit_transaction_logs_changes
  AFTER INSERT OR UPDATE OR DELETE ON transaction_logs
  FOR EACH ROW EXECUTE FUNCTION log_database_changes();

CREATE TRIGGER audit_contribution_logs_changes
  AFTER INSERT OR UPDATE OR DELETE ON contribution_logs
  FOR EACH ROW EXECUTE FUNCTION log_database_changes();

CREATE TRIGGER audit_withdrawal_logs_changes
  AFTER INSERT OR UPDATE OR DELETE ON withdrawal_logs
  FOR EACH ROW EXECUTE FUNCTION log_database_changes();