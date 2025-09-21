-- Create ENUM for log status
CREATE TYPE public.log_status AS ENUM ('pending', 'approved', 'rejected', 'archived');

-- Table: partners
CREATE TABLE public.partners (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text,
    organization text,
    contact_email text UNIQUE,
    phone_number text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Partners can view their own profile." ON public.partners FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Partners can update their own profile." ON public.partners FOR UPDATE USING (auth.uid() = id);

-- Function to create partner profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user_partner()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.partners (id, contact_email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function
CREATE TRIGGER on_auth_user_created_partner
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_partner();

-- Table: projects
CREATE TABLE public.projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    created_by uuid REFERENCES auth.users(id),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Partners can view their projects." ON public.projects FOR SELECT USING (auth.uid() = created_by);
CREATE POLICY "Partners can create projects." ON public.projects FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Partners can update their projects." ON public.projects FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Partners can delete their projects." ON public.projects FOR DELETE USING (auth.uid() = created_by);

-- Table: attachments
CREATE TABLE public.attachments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name text NOT NULL,
    file_url text NOT NULL, -- URL from Supabase Storage
    file_type text,
    file_size bigint,
    uploaded_by uuid REFERENCES auth.users(id),
    uploaded_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own attachments." ON public.attachments FOR SELECT USING (auth.uid() = uploaded_by);
CREATE POLICY "Users can upload attachments." ON public.attachments FOR INSERT WITH CHECK (auth.uid() = uploaded_by);
CREATE POLICY "Users can delete their own attachments." ON public.attachments FOR DELETE USING (auth.uid() = uploaded_by);

-- Table: expense_logs
CREATE TABLE public.expense_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by uuid REFERENCES auth.users(id),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    status log_status DEFAULT 'pending',
    decision_by uuid REFERENCES auth.users(id),
    decision_at timestamp with time zone,
    signed_off_at timestamp with time zone,
    attachments jsonb DEFAULT '[]'::jsonb, -- Array of attachment IDs
    tags text[] DEFAULT '{}'::text[],
    project_id uuid REFERENCES public.projects(id),
    notes text,
    
    -- Specific fields
    title text NOT NULL,
    description text,
    amount numeric(10, 2) NOT NULL,
    currency text DEFAULT 'INR',
    category text,
    vendor_name text,
    purchase_date date,
    payment_method text,
    invoice_number text,
    gst_applicable boolean DEFAULT FALSE,
    gst_amount numeric(10, 2),
    reimbursable boolean DEFAULT FALSE,
    reimbursement_to text,
    bank_txn_id text,
    proof_image text, -- URL to attachment
    estimated_budget numeric(10, 2),
    priority text -- e.g., 'low', 'medium', 'high', 'urgent'
);
ALTER TABLE public.expense_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Partners can manage their own expense logs." ON public.expense_logs FOR ALL USING (auth.uid() = created_by);

-- Table: transaction_logs
CREATE TABLE public.transaction_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by uuid REFERENCES auth.users(id),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    status log_status DEFAULT 'pending',
    decision_by uuid REFERENCES auth.users(id),
    decision_at timestamp with time zone,
    signed_off_at timestamp with time zone,
    attachments jsonb DEFAULT '[]'::jsonb,
    tags text[] DEFAULT '{}'::text[],
    project_id uuid REFERENCES public.projects(id),
    notes text,

    -- Specific fields
    title text NOT NULL,
    amount numeric(10, 2) NOT NULL,
    mode text, -- e.g., 'cash', 'online', 'cheque'
    customer_name text,
    invoice_id text,
    received_date date
);
ALTER TABLE public.transaction_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Partners can manage their own transaction logs." ON public.transaction_logs FOR ALL USING (auth.uid() = created_by);

-- Table: contribution_logs
CREATE TABLE public.contribution_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by uuid REFERENCES auth.users(id),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    status log_status DEFAULT 'pending',
    decision_by uuid REFERENCES auth.users(id),
    decision_at timestamp with time zone,
    signed_off_at timestamp with time zone,
    attachments jsonb DEFAULT '[]'::jsonb,
    tags text[] DEFAULT '{}'::text[],
    project_id uuid REFERENCES public.projects(id),
    notes text,

    -- Specific fields
    contribution_type text NOT NULL, -- e.g., 'financial', 'time', 'material'
    amount numeric(10, 2), -- Applicable for financial/material
    mode text, -- e.g., 'cash', 'online', 'in-kind'
    proof text, -- URL to attachment or description
    remarks text
);
ALTER TABLE public.contribution_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Partners can manage their own contribution logs." ON public.contribution_logs FOR ALL USING (auth.uid() = created_by);

-- Table: withdrawal_logs
CREATE TABLE public.withdrawal_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by uuid REFERENCES auth.users(id),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    status log_status DEFAULT 'pending',
    decision_by uuid REFERENCES auth.users(id),
    decision_at timestamp with time zone,
    signed_off_at timestamp with time zone,
    attachments jsonb DEFAULT '[]'::jsonb,
    tags text[] DEFAULT '{}'::text[],
    project_id uuid REFERENCES public.projects(id),
    notes text,

    -- Specific fields
    purpose text NOT NULL,
    amount numeric(10, 2) NOT NULL,
    method text, -- e.g., 'bank transfer', 'cash'
    requested_by uuid REFERENCES auth.users(id),
    approved_by uuid REFERENCES auth.users(id),
    withdrawal_date date,
    balance_after numeric(10, 2),
    emergency_flag boolean DEFAULT FALSE
);
ALTER TABLE public.withdrawal_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Partners can manage their own withdrawal logs." ON public.withdrawal_logs FOR ALL USING (auth.uid() = created_by OR auth.uid() = requested_by OR auth.uid() = approved_by);

-- Table: work_logs
CREATE TABLE public.work_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by uuid REFERENCES auth.users(id),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    status log_status DEFAULT 'pending',
    decision_by uuid REFERENCES auth.users(id),
    decision_at timestamp with time zone,
    signed_off_at timestamp with time zone,
    attachments jsonb DEFAULT '[]'::jsonb,
    tags text[] DEFAULT '{}'::text[],
    project_id uuid REFERENCES public.projects(id),
    notes text,

    -- Specific fields
    title text NOT NULL,
    project text, -- Can be linked to projects table if needed
    hours_spent numeric(5, 2),
    date date,
    deliverables text,
    code_repo_link text,
    blockers text,
    task_priority text, -- e.g., 'low', 'medium', 'high', 'urgent'
    due_date date
);
ALTER TABLE public.work_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Partners can manage their own work logs." ON public.work_logs FOR ALL USING (auth.uid() = created_by);

-- Table: task_buckets
CREATE TABLE public.task_buckets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL, -- e.g., 'To Do', 'Doing', 'Review', 'Done'
    order_index integer NOT NULL,
    created_by uuid REFERENCES auth.users(id),
    created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.task_buckets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Partners can view task buckets." ON public.task_buckets FOR SELECT USING (TRUE);
CREATE POLICY "Partners can create task buckets." ON public.task_buckets FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Partners can update task buckets." ON public.task_buckets FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Partners can delete task buckets." ON public.task_buckets FOR DELETE USING (auth.uid() = created_by);

-- Table: tasks
CREATE TABLE public.tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    due_date date,
    priority text, -- e.g., 'low', 'medium', 'high', 'urgent'
    assigned_to uuid REFERENCES auth.users(id),
    bucket_id uuid REFERENCES public.task_buckets(id),
    project_id uuid REFERENCES public.projects(id),
    is_recurring boolean DEFAULT FALSE,
    parent_task_id uuid REFERENCES public.tasks(id), -- For task dependency
    created_by uuid REFERENCES auth.users(id),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    status text DEFAULT 'open' -- e.g., 'open', 'in-progress', 'completed'
);
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Partners can manage their own tasks." ON public.tasks FOR ALL USING (auth.uid() = created_by OR auth.uid() = assigned_to);

-- Table: comments
CREATE TABLE public.comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    content text NOT NULL,
    created_by uuid REFERENCES auth.users(id),
    created_at timestamp with time zone DEFAULT now(),
    
    -- Polymorphic relation to logs/tasks
    log_id uuid, -- Can be any log type ID
    task_id uuid REFERENCES public.tasks(id),
    
    -- Foreign key constraints for logs (example, you'd need one for each log type)
    CONSTRAINT fk_comment_expense_log FOREIGN KEY (log_id) REFERENCES public.expense_logs(id),
    CONSTRAINT fk_comment_transaction_log FOREIGN KEY (log_id) REFERENCES public.transaction_logs(id),
    CONSTRAINT fk_comment_contribution_log FOREIGN KEY (log_id) REFERENCES public.contribution_logs(id),
    CONSTRAINT fk_comment_withdrawal_log FOREIGN KEY (log_id) REFERENCES public.withdrawal_logs(id),
    CONSTRAINT fk_comment_work_log FOREIGN KEY (log_id) REFERENCES public.work_logs(id),

    -- Ensure only one foreign key is set
    CONSTRAINT chk_comment_target CHECK (
        (log_id IS NOT NULL AND task_id IS NULL) OR
        (log_id IS NULL AND task_id IS NOT NULL)
    )
);
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Partners can manage their own comments." ON public.comments FOR ALL USING (auth.uid() = created_by);

-- Table: notifications
CREATE TABLE public.notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id uuid REFERENCES auth.users(id),
    message text NOT NULL,
    type text, -- e.g., 'new_log', 'task_assigned', 'approval_request', 'reminder'
    read_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    related_entity_id uuid, -- ID of the log/task/etc.
    related_entity_type text -- Type of the related entity (e.g., 'expense_log', 'task')
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own notifications." ON public.notifications FOR SELECT USING (auth.uid() = recipient_id);
CREATE POLICY "Users can create notifications." ON public.notifications FOR INSERT WITH CHECK (auth.uid() = recipient_id); -- Or allow service role to insert
CREATE POLICY "Users can update their own notifications." ON public.notifications FOR UPDATE USING (auth.uid() = recipient_id);

-- Table: audit_trail_entries
CREATE TABLE public.audit_trail_entries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type text NOT NULL, -- e.g., 'expense_log', 'task', 'user'
    entity_id uuid NOT NULL, -- ID of the affected entity
    action text NOT NULL, -- e.g., 'create', 'update', 'delete', 'status_change'
    old_value jsonb,
    new_value jsonb,
    changed_by uuid REFERENCES auth.users(id),
    changed_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.audit_trail_entries ENABLE ROW LEVEL SECURITY;
-- RLS for audit_trail_entries should be very restrictive, usually only for admins
-- For example, only service role can insert, and only specific admin users can select.
-- CREATE POLICY "Admins can view all audit trail." ON public.audit_trail_entries FOR SELECT USING (auth.email() = 'admin@example.com');
