export interface Product {
  id: string
  title: string
  description: string
  price: number
  kit_contents: string[]
  learning_outcomes: string[]
  assembly_steps: string
  tools_required: string[]
  image_urls?: string[]
  category: string
  created_at: string
  on_offer?: boolean
  discount_type?: 'flat' | 'percentage'
  discount_value?: number
  discount_expiry_date?: string
}

export interface Order {
  id: string // Custom format: XLV_timestamp_random (e.g., XLV_1752381587100_973)
  product_id?: string // Made optional since we now use cart_items
  name: string
  contact: string
  address: string
  email?: string
  status: 'pending' | 'confirmed' | 'delivered' | 'payment_pending' | 'payment_failed' | 'pending_review' | 'cancelled'
  created_at: string
  updated_at?: string
  cf_order_id?: string
  payment_session_id?: string
  total_amount?: number
  currency?: string
  payment_status?: string
  payment_amount?: number
  payment_currency?: string
  payment_method?: string
  payment_time?: string
  cart_items?: any
  shipping_details?: any
  webhook_data?: any
}

export interface Resource {
  id: string
  title: string
  type: 'pdf' | 'video'
  kit_tag: string
  file_url: string
  uploaded_at: string
}

export interface Contact {
  id: string
  name: string
  email: string
  message: string
  timestamp: string
}

export interface TeamMember {
  name: string
  title: string
  role: string
  vision: string
  image: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Component {
  id: string
  name: string
  price: number
  image_url?: string
  stock_status: boolean
  description: string
  category: string
  created_at: string
}

export interface ComponentRequest {
  id: string
  name: string
  email: string
  component: string
  reason?: string
  created_at: string
}

export interface CustomProject {
  id: string
  name: string
  contact_info: string
  project_desc: string
  budget_range: string
  image_url?: string
  status: 'pending' | 'in-review' | 'approved' | 'completed' | 'cancelled'
  created_at: string
}
