# XolveTech - STEM Learning Kits Platform

> Youth-Led STEM Innovation from Bihar, India | Arduino Electronics & Programming Education for Students

A modern, full-stack e-commerce platform for Arduino STEM learning kits, electronics components, and custom robotics projects. Built by students, for students.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [File & Folder Structure](#file--folder-structure)
4. [Design System](#design-system)
   - [Color Palette](#color-palette)
   - [Typography](#typography)
   - [Icons & Illustrations](#icons--illustrations)
   - [Spacing & Layout](#spacing--layout)
5. [UI Components](#ui-components)
6. [Pages & Structure](#pages--structure)
7. [Functionality & Workflow](#functionality--workflow)
8. [Database Architecture](#database-architecture)
9. [Setup & Installation](#setup--installation)
10. [Deployment](#deployment)
11. [Environment Variables](#environment-variables)
12. [Contribution Guidelines](#contribution-guidelines)
13. [Credits](#credits)
14. [License](#license)

---

## Project Overview

**XolveTech** is a student-led STEM education startup from Patna, Bihar, India, focused on making hands-on Arduino learning accessible and affordable across India. The platform offers:

- **Pre-built STEM Kits**: Arduino electronics, programming, and robotics learning kits
- **Individual Components**: Purchase individual electronic components (LEDs, sensors, motors, etc.)
- **Custom Robotics Projects**: Submit custom project requests with specifications
- **Learning Resources**: Educational guides, tutorials, and project documentation
- **Partner Ecosystem**: Collaborate with educational partners and track project progress
- **Admin Dashboard**: Manage products, orders, contacts, and inventory

**Core Mission**: Deliver affordable, eco-friendly STEM education that builds the next generation of innovators.

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | ^18.3.1 | UI library for building component-based interface |
| **TypeScript** | ^5.5.3 | Type-safe JavaScript for better developer experience |
| **Vite** | ^5.4.2 | Fast build tool and dev server |
| **React Router DOM** | ^6.20.1 | Client-side routing and navigation |
| **Tailwind CSS** | ^3.4.1 | Utility-first CSS framework for styling |
| **Lucide React** | ^0.344.0 | Modern icon library |

### Backend & Database
| Technology | Purpose |
|-----------|---------|
| **Supabase** | PostgreSQL database with built-in authentication |
| **Supabase Auth** | Email/password authentication with RLS security |
| **Edge Functions** | Serverless functions for payment processing |

### Payment Integration
| Service | Purpose |
|---------|---------|
| **Razorpay** | Payment gateway for Indian transactions |

### Security & Optimization
| Feature | Implementation |
|---------|---------------|
| **DOMPurify** | XSS protection and HTML sanitization |
| **Content Security Policy** | Header-based security controls |
| **Row Level Security** | Database-level access control |
| **React Helmet Async** | SEO metadata management |

### Hosting & Deployment
| Platform | Purpose |
|----------|---------|
| **Netlify** | Frontend hosting with CI/CD |
| **Supabase Cloud** | Database and serverless functions hosting |

---

## File & Folder Structure

```
project/
├── public/                          # Static assets
│   ├── _headers                     # Netlify security headers
│   ├── _redirects                   # SPA routing configuration
│   ├── favicon.ico                  # Browser favicon
│   ├── manifest.json                # PWA manifest
│   ├── robots.txt                   # SEO crawler directives
│   ├── sitemap.xml                  # SEO sitemap
│   └── sw.js                        # Service worker for PWA
│
├── src/                             # Source code
│   ├── assets/                      # Images and media files
│   │   ├── aryan.jpg               # Team member photo
│   │   ├── ayush.jpg               # Team member photo
│   │   ├── rishav.jpg              # Team member photo
│   │   ├── shubham.jpg             # Team member photo
│   │   └── xolvetech-logo.png      # Company logo
│   │
│   ├── components/                  # Reusable React components
│   │   ├── admin/                   # Admin dashboard components
│   │   │   ├── AdminDashboard.tsx   # Main admin panel
│   │   │   ├── AdminStats.tsx       # Analytics and statistics
│   │   │   ├── BillMaker.tsx        # Invoice generation
│   │   │   ├── ComponentsManager.tsx # Manage electronic components
│   │   │   ├── ContactsManager.tsx  # Customer inquiries management
│   │   │   ├── CustomProjectsManager.tsx # Handle custom project requests
│   │   │   ├── OrdersManager.tsx    # Order tracking and fulfillment
│   │   │   ├── ProductsManager.tsx  # Product catalog management
│   │   │   └── ResourcesManager.tsx # Learning resource management
│   │   │
│   │   ├── auth/                    # Authentication components
│   │   │   ├── AuthModal.tsx        # Login/signup modal
│   │   │   ├── EmailConfirmationGuard.tsx # Email verification guard
│   │   │   └── ProtectedRoute.tsx   # Route access control
│   │   │
│   │   ├── cart/                    # Shopping cart functionality
│   │   │   ├── CartDrawer.tsx       # Slide-out cart sidebar
│   │   │   └── CheckoutModal.tsx    # Payment checkout interface
│   │   │
│   │   ├── components/              # Components page features
│   │   │   ├── ComponentCard.tsx    # Individual component display
│   │   │   └── ComponentRequestModal.tsx # Custom component request
│   │   │
│   │   ├── layout/                  # Layout components
│   │   │   ├── Header.tsx           # Navigation header
│   │   │   └── Footer.tsx           # Site footer
│   │   │
│   │   ├── partners/                # Partner dashboard components
│   │   │   ├── AnalyticsDashboard.tsx # Partner performance metrics
│   │   │   ├── LogDetailModal.tsx   # View detailed logs
│   │   │   ├── LogFormModal.tsx     # Create/edit logs
│   │   │   ├── LogsManager.tsx      # Partner activity logging
│   │   │   ├── NotificationsPanel.tsx # Real-time notifications
│   │   │   ├── PartnerDashboard.tsx # Partner home screen
│   │   │   ├── TaskDetailModal.tsx  # View task details
│   │   │   ├── TaskFormModal.tsx    # Create/assign tasks
│   │   │   └── TasksManager.tsx     # Task tracking system
│   │   │
│   │   ├── payment/                 # Payment components
│   │   │   └── PaymentStatus.tsx    # Payment confirmation UI
│   │   │
│   │   ├── products/                # Product display components
│   │   │   ├── ProductCard.tsx      # Product listing card
│   │   │   └── ProductModal.tsx     # Product detail modal
│   │   │
│   │   └── ui/                      # Base UI components
│   │       ├── Button.tsx           # Reusable button component
│   │       ├── Input.tsx            # Form input component
│   │       ├── Modal.tsx            # Modal dialog wrapper
│   │       └── SearchBar.tsx        # Search input component
│   │
│   ├── contexts/                    # React Context providers
│   │   ├── AuthContext.tsx          # Authentication state management
│   │   └── CartContext.tsx          # Shopping cart state management
│   │
│   ├── lib/                         # Utility libraries
│   │   ├── payment.ts               # Razorpay integration logic
│   │   ├── paymentLogger.ts         # Payment event logging
│   │   └── supabase.ts              # Supabase client setup
│   │
│   ├── pages/                       # Route-level page components
│   │   ├── admin/                   # Admin-only pages
│   │   │   ├── AdminDashboard.tsx   # Admin control panel
│   │   │   └── AdminLogin.tsx       # Admin authentication
│   │   │
│   │   ├── CancellationRefundPolicy.tsx # Cancellation policy
│   │   ├── Components.tsx           # Electronics components catalog
│   │   ├── Contact.tsx              # Contact form page
│   │   ├── CustomProjects.tsx       # Custom project request page
│   │   ├── Home.tsx                 # Landing page
│   │   ├── HowItWorks.tsx           # Process explanation
│   │   ├── Learning.tsx             # Educational resources
│   │   ├── OrderSuccess.tsx         # Order confirmation
│   │   ├── PartnerLogin.tsx         # Partner authentication
│   │   ├── Partners.tsx             # Partner dashboard
│   │   ├── PasswordReset.tsx        # Password recovery
│   │   ├── PaymentSuccess.tsx       # Payment confirmation
│   │   ├── PrivacyPolicy.tsx        # Privacy policy
│   │   ├── Products.tsx             # Product catalog
│   │   ├── ShippingDeliveryPolicy.tsx # Shipping terms
│   │   ├── Team.tsx                 # Team member profiles
│   │   └── TermsOfService.tsx       # Terms and conditions
│   │
│   ├── types/                       # TypeScript type definitions
│   │   └── index.ts                 # Centralized type exports
│   │
│   ├── utils/                       # Utility functions
│   │   └── sanitize.ts              # HTML sanitization helpers
│   │
│   ├── App.tsx                      # Root application component
│   ├── index.css                    # Global styles (Tailwind imports)
│   ├── main.tsx                     # Application entry point
│   └── vite-env.d.ts                # Vite type declarations
│
├── supabase/                        # Supabase backend configuration
│   ├── functions/                   # Edge Functions (serverless)
│   │   ├── create-razorpay-order/   # Payment order creation
│   │   └── razorpay-webhook/        # Payment webhook handler
│   │
│   └── migrations/                  # Database migrations (SQL)
│       ├── 20250703131212_foggy_river.sql    # Contacts table
│       ├── 20250703132818_silent_ocean.sql   # Products tables
│       ├── 20250703133334_jolly_glitter.sql  # Components catalog
│       ├── 20250712014254_dawn_stream.sql    # Custom projects
│       ├── 20250713043107_broken_gate.sql    # Orders system
│       ├── 20250713044624_mellow_island.sql  # Partner tasks
│       ├── 20250714114649_scarlet_pond.sql   # Partner logs
│       ├── 20250720040831_fragrant_hall.sql  # Learning resources
│       └── 20250921050852_still_spring.sql   # Payment logs
│
├── .env                             # Environment variables
├── .gitignore                       # Git ignore rules
├── .hintrc                          # Webhint configuration
├── eslint.config.js                 # ESLint rules
├── index.html                       # HTML entry point
├── netlify.toml                     # Netlify deployment config
├── package.json                     # Dependencies and scripts
├── package-lock.json                # Dependency lock file
├── postcss.config.js                # PostCSS configuration
├── sitemap.xml                      # Root sitemap
├── tailwind.config.js               # Tailwind customization
├── tsconfig.json                    # TypeScript configuration
├── tsconfig.app.json                # App-specific TS config
├── tsconfig.node.json               # Node-specific TS config
└── vite.config.ts                   # Vite build configuration
```

---

## Design System

### Color Palette

The design uses a professional, accessible color system optimized for STEM education branding.

#### Primary Colors

| Color Name | Hex Code | Tailwind Class | Usage |
|------------|----------|----------------|-------|
| Blue 50 | `#eff6ff` | `blue-50` | Backgrounds, hover states |
| Blue 100 | `#dbeafe` | `blue-100` | Light backgrounds |
| Blue 200 | `#bfdbfe` | `blue-200` | Borders, dividers |
| Blue 300 | `#93c5fd` | `blue-300` | Disabled states |
| Blue 400 | `#60a5fa` | `blue-400` | Interactive elements |
| Blue 500 | `#3b82f6` | `blue-500` | Primary brand color |
| Blue 600 | `#2563eb` | `blue-600` | Primary buttons, links |
| Blue 700 | `#1d4ed8` | `blue-700` | Hover states |
| Blue 800 | `#1e40af` | `blue-800` | Dark backgrounds |
| Blue 900 | `#1e3a8a` | `blue-900` | Hero sections |

#### Accent Colors

| Color Name | Hex Code | Tailwind Class | Usage |
|------------|----------|----------------|-------|
| Orange 500 | `#f97316` | `orange-500` | Secondary accent |
| Orange 600 | `#ea580c` | `orange-600` | CTA buttons, highlights |
| Orange 700 | `#c2410c` | `orange-700` | Hover states |
| Green 500 | `#22c55e` | `green-500` | Success states |
| Green 600 | `#16a34a` | `green-600` | Success buttons |
| Green 700 | `#15803d` | `green-700` | Impact sections |

#### Neutral Colors

| Color Name | Hex Code | Tailwind Class | Usage |
|------------|----------|----------------|-------|
| Gray 50 | `#f9fafb` | `gray-50` | Page backgrounds |
| Gray 100 | `#f3f4f6` | `gray-100` | Section backgrounds |
| Gray 200 | `#e5e7eb` | `gray-200` | Borders |
| Gray 400 | `#9ca3af` | `gray-400` | Placeholders |
| Gray 600 | `#4b5563` | `gray-600` | Secondary text |
| Gray 700 | `#374151` | `gray-700` | Body text |
| Gray 900 | `#111827` | `gray-900` | Headings, footer |

`[Insert color palette visualization here]`

---

### Typography

#### Font Family
- **System Font Stack**: Uses native system fonts for optimal performance and readability
- **Fallback**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`

#### Font Weights
| Weight | Value | Usage |
|--------|-------|-------|
| Regular | 400 | Body text, descriptions |
| Medium | 500 | Subheadings, labels |
| Semi-Bold | 600 | Buttons, emphasized text |
| Bold | 700 | Headings, hero text |

#### Type Scale
| Element | Size (Desktop) | Size (Mobile) | Weight | Line Height |
|---------|---------------|---------------|--------|-------------|
| Hero Heading | 3rem (48px) | 2.25rem (36px) | 700 | 1.2 |
| Page Heading (h1) | 2.25rem (36px) | 1.875rem (30px) | 700 | 1.2 |
| Section Heading (h2) | 1.875rem (30px) | 1.5rem (24px) | 700 | 1.3 |
| Subsection (h3) | 1.5rem (24px) | 1.25rem (20px) | 600 | 1.4 |
| Body Large | 1.125rem (18px) | 1rem (16px) | 400 | 1.6 |
| Body Regular | 1rem (16px) | 0.875rem (14px) | 400 | 1.5 |
| Small Text | 0.875rem (14px) | 0.75rem (12px) | 400 | 1.4 |

---

### Icons & Illustrations

#### Icon Library
- **Primary**: [Lucide React](https://lucide.dev/) (^0.344.0)
- **Style**: Outline/stroke-based icons
- **Default Size**: 24px (w-6 h-6)
- **Stroke Width**: 2px

#### Common Icons Used
| Icon | Component | Usage |
|------|-----------|-------|
| `Lightbulb` | Electronics | Category indicator |
| `Wrench` | Mechanics | Tools and components |
| `BookOpen` | Learning | Educational resources |
| `Users` | Team | Collaboration features |
| `Award` | Achievement | Rewards and recognition |
| `ShoppingCart` | Cart | E-commerce actions |
| `Menu` / `X` | Navigation | Mobile menu toggle |
| `ArrowRight` | CTA | Direction and progression |
| `Mail` / `Phone` | Contact | Communication channels |

#### Team Photos
- Located in `src/assets/`
- Format: JPG
- Team members: Aryan, Ayush, Rishav, Shubham

#### Brand Assets
- **Logo**: `xolvetech-logo.png`
- **Favicon**: `favicon.ico` and `favicon.png`
- **Apple Touch Icon**: `apple-touch-icon-180x180.png`

`[Insert icon usage examples here]`

---

### Spacing & Layout

#### Spacing System (8px Grid)
| Scale | Tailwind | Pixels | Usage |
|-------|----------|--------|-------|
| 0.5 | `spacing-0.5` | 2px | Micro spacing |
| 1 | `spacing-1` | 4px | Tight spacing |
| 2 | `spacing-2` | 8px | Base unit |
| 3 | `spacing-3` | 12px | Small gaps |
| 4 | `spacing-4` | 16px | Standard spacing |
| 6 | `spacing-6` | 24px | Medium spacing |
| 8 | `spacing-8` | 32px | Large spacing |
| 12 | `spacing-12` | 48px | Section spacing |
| 16 | `spacing-16` | 64px | Major sections |

#### Container Widths
| Breakpoint | Max Width | Usage |
|------------|-----------|-------|
| Default | 100% | Full-width mobile |
| sm | 640px | Small screens |
| md | 768px | Tablets |
| lg | 1024px | Desktop |
| xl | 1280px | Large desktop |
| Content Container | 1280px (max-w-7xl) | Main content area |

#### Border Radius
| Size | Tailwind | Pixels | Usage |
|------|----------|--------|-------|
| Small | `rounded` | 4px | Buttons, badges |
| Medium | `rounded-lg` | 8px | Cards, inputs |
| Large | `rounded-xl` | 12px | Modals, panels |
| Extra Large | `rounded-2xl` | 16px | Hero cards |
| Full | `rounded-full` | 9999px | Badges, avatars |

---

## UI Components

### Header (Navigation Bar)

**File**: `src/components/layout/Header.tsx`

**Features**:
- Sticky navigation bar with shadow
- Logo and brand name
- Desktop horizontal navigation
- Mobile hamburger menu with slide-down panel
- Dropdown menu for Products (STEM Kits, Components, Custom Projects)
- Shopping cart icon with item count badge
- User authentication status (Sign In/Sign Up or User Avatar)
- Admin and Partner dashboard quick links
- Active route highlighting

**States**:
- Default, Hover, Active
- Mobile menu open/closed
- Dropdown expanded/collapsed
- User logged in/out

`[Insert header screenshot here]`

---

### Footer

**File**: `src/components/layout/Footer.tsx`

**Sections**:
- Company info and tagline
- Quick Links (Products, How It Works, Learning, Team, Contact)
- Contact Information (Email, Phone, Instagram, Location)
- Legal links (Terms, Privacy, Cancellation, Shipping policies)
- Copyright notice

**Design**: Dark background (gray-900) with white text and subtle hover effects.

`[Insert footer screenshot here]`

---

### Button Component

**File**: `src/components/ui/Button.tsx`

**Variants**:
| Variant | Usage | Colors |
|---------|-------|--------|
| `primary` | Main CTAs | Blue background, white text |
| `secondary` | Alternative actions | Orange background, white text |
| `outline` | Low-emphasis actions | White background, gray border |
| `ghost` | Subtle actions | Transparent background, gray text |

**Sizes**:
- `sm`: Small (px-3 py-1.5, text-sm)
- `md`: Medium (px-4 py-2, text-sm)
- `lg`: Large (px-6 py-3, text-base)

**Features**:
- Focus ring for accessibility
- Disabled state with reduced opacity
- Transition animations
- TypeScript props with aria-label support

`[Insert button variants screenshot here]`

---

### Input Component

**File**: `src/components/ui/Input.tsx`

**Features**:
- Standard text input styling
- Focus states with blue ring
- Error state support
- Placeholder text styling
- Label integration

`[Insert input examples here]`

---

### Modal Component

**File**: `src/components/ui/Modal.tsx`

**Features**:
- Backdrop overlay (semi-transparent black)
- Centered modal window
- Close button (X icon)
- Smooth fade-in/fade-out animations
- Click outside to close
- Escape key to close

**Used For**:
- Authentication (Sign In/Sign Up)
- Product details
- Checkout process
- Custom project requests
- Task and log management

`[Insert modal example here]`

---

### Product Card

**File**: `src/components/products/ProductCard.tsx`

**Display**:
- Product image (if available)
- Product name
- Category badge
- Price (INR)
- Description excerpt
- "View Details" and "Add to Cart" buttons

**Hover Effect**: Card elevation increases, subtle scale transform.

`[Insert product card screenshot here]`

---

### Component Card

**File**: `src/components/components/ComponentCard.tsx`

**Display**:
- Component name
- Category
- Price
- Specifications
- Stock status
- Add to Cart button

**Used For**: Individual electronic components (LEDs, resistors, sensors, motors).

`[Insert component card screenshot here]`

---

### Shopping Cart Drawer

**File**: `src/components/cart/CartDrawer.tsx`

**Features**:
- Slide-out panel from right side
- Cart items list with thumbnails
- Quantity adjustment (+/-)
- Remove item button
- Subtotal calculation
- "Proceed to Checkout" button
- Empty cart message

`[Insert cart drawer screenshot here]`

---

### Checkout Modal

**File**: `src/components/cart/CheckoutModal.tsx`

**Features**:
- Order summary
- Shipping address form
- Phone number input
- Razorpay payment integration
- Order notes field
- Total amount display
- "Complete Payment" button

`[Insert checkout modal screenshot here]`

---

### Authentication Modal

**File**: `src/components/auth/AuthModal.tsx`

**Modes**:
- **Sign In**: Email and password login
- **Sign Up**: Full name, email, password registration

**Features**:
- Form validation
- Error message display
- Toggle between Sign In and Sign Up
- Password visibility toggle
- Loading states

`[Insert auth modal screenshot here]`

---

### Search Bar

**File**: `src/components/ui/SearchBar.tsx`

**Features**:
- Text input with search icon
- Real-time filtering (client-side)
- Clear button
- Placeholder text

**Used On**: Products page, Components page, Admin dashboard.

`[Insert search bar screenshot here]`

---

## Pages & Structure

### Home Page (`/`)

**File**: `src/pages/Home.tsx`

**Sections**:
1. **Hero Section**: Bold headline, logo display, CTA buttons (View STEM Kits, Electronics Components, Custom Projects)
2. **Mission Banner**: Orange background, delivery promise, no hidden fees message
3. **Product Categories**: Electronics, Mechanics, Programming, Collaborative learning
4. **What's in the Box**: Components, guidebook, rewards explanation
5. **Revenue Flow Model**: Green section explaining profit reinvestment into innovation
6. **Featured Recognition**: Bihar youth innovation spotlight
7. **Final CTA**: "Ready to Start Building?" with Shop Kits and Contact buttons

**SEO**: Extensive structured data (JSON-LD), Open Graph tags, Twitter cards.

`[Insert home page screenshot here]`

---

### Products Page (`/products`)

**File**: `src/pages/Products.tsx`

**Features**:
- Search bar
- Category filter (Electronics, Programming, Mechanics, All)
- Product grid (responsive: 1 column mobile, 2 tablet, 3 desktop)
- Product cards with "Add to Cart" and "View Details"
- Product detail modal

`[Insert products page screenshot here]`

---

### Components Page (`/components`)

**File**: `src/pages/Components.tsx`

**Features**:
- Search and filter by component type
- Component cards with specifications
- "Add to Cart" functionality
- "Request a Component" button (opens modal for custom requests)

**Component Categories**: LEDs, Resistors, Sensors, Motors, Microcontrollers, Breadboards, Wires, etc.

`[Insert components page screenshot here]`

---

### Custom Projects Page (`/custom-projects`)

**File**: `src/pages/CustomProjects.tsx`

**Features**:
- Explanation of custom project service
- Request form (Name, Email, Project Description, Budget, Timeline)
- Form submission to Supabase
- Admin receives and manages requests

`[Insert custom projects page screenshot here]`

---

### How It Works Page (`/how-it-works`)

**File**: `src/pages/HowItWorks.tsx`

**Content**:
- Step-by-step process explanation
- Visual flow diagram (placeholders)
- From browsing products to receiving kit and learning

`[Insert how it works page screenshot here]`

---

### Learning Page (`/learning`)

**File**: `src/pages/Learning.tsx`

**Features**:
- Educational resource library
- Tutorials, guides, video links
- Project ideas and inspiration
- Filterable by category

`[Insert learning page screenshot here]`

---

### Team Page (`/team`)

**File**: `src/pages/Team.tsx`

**Content**:
- Team member profiles with photos
- Names: Aryan, Ayush, Rishav, Shubham
- Roles and descriptions
- Mission statement

`[Insert team page screenshot here]`

---

### Contact Page (`/contact`)

**File**: `src/pages/Contact.tsx`

**Features**:
- Contact form (Name, Email, Message)
- Form submission to Supabase `contacts` table
- Company contact information
- Social media links

`[Insert contact page screenshot here]`

---

### Admin Dashboard (`/admin`)

**File**: `src/pages/admin/AdminDashboard.tsx`

**Access Control**: Protected route, only accessible to admin users (email: xolvetech@gmail.com)

**Tabs**:
- **Overview**: Statistics dashboard (total orders, revenue, products, contacts)
- **Products**: Manage STEM kit catalog (add, edit, delete)
- **Components**: Manage electronic components inventory
- **Orders**: View and update order status, generate bills
- **Contacts**: View customer inquiries from contact form
- **Custom Projects**: Review and respond to custom project requests
- **Learning Resources**: Manage tutorials and educational content
- **Bill Maker**: Generate invoices for orders

`[Insert admin dashboard screenshot here]`

---

### Partners Dashboard (`/partners`)

**File**: `src/pages/Partners.tsx`

**Access Control**: Protected route for partner users

**Features**:
- **Tasks Manager**: View assigned tasks, update status, mark complete
- **Logs Manager**: Create activity logs, track project progress
- **Notifications Panel**: Real-time updates and alerts
- **Analytics Dashboard**: Performance metrics and insights

`[Insert partners dashboard screenshot here]`

---

### Policy Pages

**Files**:
- `src/pages/TermsOfService.tsx`
- `src/pages/PrivacyPolicy.tsx`
- `src/pages/CancellationRefundPolicy.tsx`
- `src/pages/ShippingDeliveryPolicy.tsx`

**Content**: Legal and operational policies formatted with clear headings and sections.

---

### Success Pages

**Order Success** (`/order-success`): Confirmation message after order placement.

**Payment Success** (`/payment-success`): Confirmation after successful Razorpay payment.

---

## Functionality & Workflow

### Authentication Flow

1. **User Registration**:
   - User clicks "Sign Up" button
   - Modal opens with registration form (Full Name, Email, Password)
   - Form submission calls `supabase.auth.signUp()`
   - User account created in `auth.users` table
   - User automatically logged in

2. **User Login**:
   - User clicks "Sign In" button
   - Modal opens with login form (Email, Password)
   - Form submission calls `supabase.auth.signInWithPassword()`
   - Session stored in browser
   - User redirected to appropriate dashboard if admin/partner

3. **Session Management**:
   - Auth state managed via `AuthContext.tsx`
   - `useAuth()` hook provides `user`, `isAdmin`, `isPartner`, `signOut()`
   - Protected routes check authentication status
   - Admin access verified by checking email against whitelist

4. **Password Reset**:
   - User clicks "Forgot Password?"
   - Enters email address
   - Supabase sends password reset email
   - User clicks link and sets new password

---

### Shopping Cart Workflow

1. **Add to Cart**:
   - User clicks "Add to Cart" on product/component
   - Item added to cart state (`CartContext.tsx`)
   - Cart count badge updates in header

2. **View Cart**:
   - User clicks cart icon in header
   - Cart drawer slides out from right
   - Shows all items with thumbnails, quantities, prices

3. **Update Quantities**:
   - User clicks +/- buttons
   - Cart state updates
   - Subtotal recalculates

4. **Proceed to Checkout**:
   - User clicks "Proceed to Checkout"
   - Checkout modal opens
   - User enters shipping details (Name, Address, Phone, Email)

5. **Payment Processing**:
   - User clicks "Complete Payment"
   - Edge function creates Razorpay order
   - Razorpay modal opens
   - User completes payment
   - Webhook verifies payment
   - Order saved to database
   - User redirected to success page

---

### Product Management (Admin)

1. **Add Product**:
   - Admin navigates to Products tab
   - Clicks "Add Product" button
   - Fills form (Name, Description, Price, Category, Stock)
   - Submits to `products` table in Supabase

2. **Edit Product**:
   - Admin clicks "Edit" on product row
   - Modal opens with pre-filled data
   - Admin updates fields
   - Changes saved to database

3. **Delete Product**:
   - Admin clicks "Delete" button
   - Confirmation prompt appears
   - Product removed from database (with safeguards to prevent deletion if orders exist)

---

### Order Fulfillment (Admin)

1. **View Orders**:
   - Admin navigates to Orders tab
   - Table displays all orders with customer details, items, amounts, status

2. **Update Order Status**:
   - Admin clicks order row
   - Changes status (Pending → Processing → Shipped → Delivered)
   - Customer notified (future enhancement)

3. **Generate Bill/Invoice**:
   - Admin selects order
   - Clicks "Generate Bill"
   - PDF invoice created with company details, order items, total

---

### Partner Task Management

1. **View Tasks**:
   - Partner logs in
   - Navigates to Tasks tab
   - Sees assigned tasks with descriptions, deadlines, status

2. **Update Task**:
   - Partner clicks task
   - Updates status or adds notes
   - Changes saved to `tasks` table

3. **Create Log**:
   - Partner navigates to Logs tab
   - Clicks "Add Log"
   - Enters activity details (Title, Description, Date)
   - Log saved to `logs` table

---

### Custom Project Requests

1. **Customer Submission**:
   - User navigates to Custom Projects page
   - Fills request form (Name, Email, Project Details, Budget, Timeline)
   - Form submitted to `custom_projects` table

2. **Admin Review**:
   - Admin views requests in Custom Projects tab
   - Reviews details
   - Responds via email or updates status
   - Can convert request to order if feasible

---

### Search & Filter

**Client-Side Filtering**:
- Products and Components pages use local state filtering
- Search input filters by name and description
- Category dropdown filters by product/component type
- Real-time results update as user types

---

### Animations & Interactions

**Hover Effects**:
- Cards: Elevation increase, subtle scale transform
- Buttons: Background color darkens, shadow increases
- Links: Color change (gray → blue)

**Transitions**:
- All interactive elements use `transition-colors` or `transition-all` with 200ms duration
- Modal and drawer animations use opacity and transform transitions

**Loading States**:
- Buttons show loading spinner during async operations
- Skeleton loaders for data fetching (future enhancement)

---

## Database Architecture

### Authentication

**Table**: `auth.users` (Supabase built-in)

**Custom Metadata**:
- `full_name`: User's display name
- `role`: 'admin', 'partner', or 'customer'

---

### Products & Components

**Table**: `products`

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `title` | text | Product name |
| `description` | text | Product details |
| `price` | numeric | Price in INR |
| `category` | text | Electronics, Programming, Mechanics |
| `image_urls` | text[] | Product images array |
| `kit_contents` | text[] | List of items in kit |
| `learning_outcomes` | text[] | Educational outcomes |
| `tools_required` | text[] | Required tools |
| `assembly_steps` | text | Assembly instructions |
| `on_offer` | boolean | Offer status |
| `discount_type` | text | Percentage or fixed |
| `discount_value` | numeric | Discount amount |
| `created_at` | timestamptz | Creation timestamp |

**RLS Policies**:
- Public can view products
- Only admin can insert/update/delete

---

**Table**: `components`

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `name` | text | Component name (e.g., "LED Red 5mm") |
| `category` | text | LEDs, Resistors, Sensors, etc. |
| `description` | text | Component details |
| `price` | numeric | Price in INR |
| `stock_status` | text | In Stock, Out of Stock |
| `image_url` | text | Component image |
| `created_at` | timestamptz | Creation timestamp |

---

### Orders

**Table**: `orders`

| Column | Type | Description |
|--------|------|-------------|
| `id` | text | Custom order ID (XLV_timestamp_random) |
| `user_id` | uuid | Foreign key to auth.users |
| `cart_items` | jsonb | Array of ordered items with details |
| `shipping_details` | jsonb | Delivery address and contact info |
| `total_amount` | numeric | Total price |
| `currency` | text | INR |
| `status` | enum | pending, processing, shipped, delivered, cancelled |
| `payment_status` | enum | pending, success, failed |
| `payment_id` | text | Razorpay payment transaction ID |
| `payment_method` | text | Payment method used |
| `webhook_data` | jsonb | Webhook payload from Razorpay |
| `cf_order_id` | text | Cashfree order ID (if applicable) |
| `created_at` | timestamptz | Order timestamp |

**RLS Policies**:
- Users can view their own orders
- Admin can view all orders

---

### Contact Form

**Table**: `contacts`

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `name` | text | Sender's name |
| `email` | text | Sender's email |
| `message` | text | Inquiry message |
| `timestamp` | timestamptz | Submission time |

**RLS Policies**:
- Public can insert
- Only admin can view

---

### Custom Projects

**Table**: `custom_projects`

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `customer_name` | text | Customer name |
| `email` | text | Contact email |
| `phone` | text | Phone number |
| `project_description` | text | Project details |
| `budget_range` | text | Budget estimate |
| `status` | enum | pending, reviewing, quoted, accepted, in_progress, completed, rejected |
| `created_at` | timestamptz | Request timestamp |

---

### Partner System

**Table**: `tasks`

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `title` | text | Task name |
| `description` | text | Task details |
| `assigned_to` | uuid | Partner user ID |
| `status` | text | pending, in_progress, completed |
| `priority` | text | low, medium, high |
| `due_date` | date | Due date |
| `created_at` | timestamptz | Creation timestamp |

**Table**: `logs`

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `partner_id` | uuid | Partner user ID |
| `title` | text | Activity title |
| `description` | text | Activity details |
| `log_type` | text | meeting, progress, issue, milestone |
| `log_date` | date | Activity date |
| `created_at` | timestamptz | Log creation timestamp |

---

### Learning Resources

**Table**: `resources`

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `title` | text | Resource name |
| `type` | enum | pdf, video |
| `kit_tag` | text | Associated product tag |
| `file_url` | text | Link to resource |
| `created_at` | timestamptz | Creation timestamp |

---

### Component Requests

**Table**: `component_requests`

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `requester_name` | text | Customer name |
| `email` | text | Contact email |
| `component_name` | text | Requested component |
| `reason` | text | Use case description |
| `created_at` | timestamptz | Request timestamp |

---

## Setup & Installation

### Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Supabase Account**: Free tier available at [supabase.com](https://supabase.com)
- **Razorpay Account**: For payment processing (India)

---

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/xolvetech-website.git
cd xolvetech-website
```

---

### Step 2: Install Dependencies

```bash
npm install
```

This installs all packages listed in `package.json`, including:
- React, React DOM, React Router
- Supabase client
- Tailwind CSS
- TypeScript
- Vite

---

### Step 3: Environment Configuration

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Get these values**:
1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the Project URL and anon/public key

---

### Step 4: Database Setup

1. **Run Migrations**:
   - Navigate to your Supabase SQL Editor
   - Execute each migration file in `supabase/migrations/` in chronological order
   - Or use Supabase CLI:
   ```bash
   supabase db reset
   ```

2. **Verify Tables**:
   - Check that all tables are created: `products`, `components`, `orders`, `contacts`, `custom_projects`, `tasks`, `logs`, `resources`, `component_requests`, `profiles`
   - Verify RLS policies are enabled

---

### Step 5: Edge Functions Deployment

**Deploy Razorpay Functions**:

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Link project:
   ```bash
   supabase link --project-ref your_project_ref
   ```

3. Set secrets:
   ```bash
   supabase secrets set RAZORPAY_KEY_ID=your_razorpay_key_id
   supabase secrets set RAZORPAY_KEY_SECRET=your_razorpay_secret
   supabase secrets set RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
   ```

4. Deploy functions:
   ```bash
   supabase functions deploy create-razorpay-order
   supabase functions deploy razorpay-webhook
   ```

---

### Step 6: Run Development Server

```bash
npm run dev
```

**Output**:
```
VITE v5.4.2  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

Open browser to `http://localhost:5173/`

---

### Step 7: Build for Production

```bash
npm run build
```

**Output**: Optimized files in `dist/` directory.

**Preview production build**:
```bash
npm run preview
```

---

## Deployment

### Netlify Deployment (Recommended)

**Step 1: Connect Repository**
1. Login to [Netlify](https://netlify.com)
2. Click "New site from Git"
3. Select your GitHub repository
4. Netlify auto-detects Vite configuration

**Step 2: Build Settings**
- **Build command**: `npm run build`
- **Publish directory**: `dist`

**Step 3: Environment Variables**
Add in Netlify dashboard (Site settings → Environment variables):
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

**Step 4: Deploy**
- Click "Deploy site"
- Netlify builds and publishes automatically
- Future pushes to main branch trigger auto-deployment

**Configuration**: The `netlify.toml` file in the project root configures:
- SPA routing (redirects all routes to index.html)
- Security headers (CSP, X-Frame-Options)
- Cache control headers

---

### Alternative: Vercel Deployment

```bash
npm install -g vercel
vercel login
vercel
```

Follow prompts to deploy. Add environment variables in Vercel dashboard.

---

### Alternative: Manual Deployment

1. Build project: `npm run build`
2. Upload `dist/` folder to any static hosting service
3. Ensure server redirects all routes to `index.html` for SPA routing

---

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

### Edge Function Secrets (Set via Supabase CLI)

| Secret | Description |
|--------|-------------|
| `RAZORPAY_KEY_ID` | Razorpay public key |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook signature secret |

**Important**: Never commit `.env` to version control. The file is included in `.gitignore`.

---

## Contribution Guidelines

We welcome contributions from developers, designers, and educators!

### How to Contribute

1. **Fork the Repository**:
   ```bash
   git clone https://github.com/yourusername/xolvetech-website.git
   ```

2. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**:
   - Follow existing code style and conventions
   - Add comments for complex logic
   - Test changes locally

4. **Commit with Clear Messages**:
   ```bash
   git commit -m "Add: New product filtering feature"
   ```

5. **Push to Your Fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**:
   - Describe your changes
   - Reference any related issues
   - Add screenshots if UI changes

---

### Code Style Guidelines

**TypeScript**:
- Use functional components with TypeScript interfaces for props
- Enable strict type checking
- Avoid `any` types

**React**:
- Use hooks (useState, useEffect, useContext)
- Keep components small and focused (single responsibility)
- Extract reusable logic into custom hooks

**CSS/Tailwind**:
- Use Tailwind utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing (8px grid)

**File Organization**:
- Group related components in folders
- Use index files for cleaner imports (future enhancement)
- Keep files under 300 lines when possible

---

### Testing (Future Enhancement)

- Unit tests for utility functions
- Integration tests for forms and cart logic
- E2E tests for critical user flows

---

### Reporting Issues

**Bug Reports**:
- Use GitHub Issues
- Include steps to reproduce
- Provide screenshots if applicable
- Mention browser and OS

**Feature Requests**:
- Describe the problem your feature solves
- Provide use cases
- Suggest implementation approach (optional)

---

## Credits

### Team
- **Aryan** - Co-founder, Product Development
- **Ayush** - Co-founder, Technical Lead
- **Rishav** - Co-founder, Operations
- **Shubham** - Co-founder, Marketing & Design

### Open Source Libraries

| Library | License | Purpose |
|---------|---------|---------|
| [React](https://react.dev) | MIT | UI framework |
| [Vite](https://vitejs.dev) | MIT | Build tool |
| [Tailwind CSS](https://tailwindcss.com) | MIT | Styling framework |
| [Lucide React](https://lucide.dev) | ISC | Icon library |
| [React Router](https://reactrouter.com) | MIT | Routing |
| [Supabase JS](https://supabase.com/docs/reference/javascript) | MIT | Database client |
| [DOMPurify](https://github.com/cure53/DOMPurify) | Apache-2.0 | HTML sanitization |

### Services
- **Supabase**: PostgreSQL database and authentication
- **Razorpay**: Payment gateway for Indian transactions
- **Netlify**: Hosting and deployment
- **Pexels**: Stock photos (if used)

### Inspiration
- Modern e-commerce platforms
- Educational technology startups
- Indian STEM education initiatives

---

## License

**MIT License**

Copyright (c) 2025 XolveTech

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## Contact & Support

**Company**: XolveTech
**Email**: xolvetech@gmail.com
**Phone**: +91 9386387397
**Instagram**: [@xolvetech](https://instagram.com/xolvetech)
**Location**: Patna, Bihar, India
**Website**: [xolvetech.in](https://xolvetech.in)

---

## Acknowledgments

Special thanks to:
- The youth of Bihar for inspiring this initiative
- Educators and students who provided feedback
- Open-source community for amazing tools
- Our customers for supporting student entrepreneurship

---

**Built with passion in Bihar, India**
*Innovate Boldly. Build Together.*
