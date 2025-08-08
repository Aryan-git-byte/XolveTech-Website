This project, "XolveTech-Website," is a full-stack e-commerce platform designed for selling STEM learning kits and electronic components. It leverages a modern web development stack to provide a responsive user experience and a robust backend for data management and payment processing.

I. Overall Architecture
The application follows a client-server architecture:

Frontend (Client-side): A Single Page Application (SPA) built with React, served by Vite, and styled with Tailwind CSS. It handles user interaction, product display, cart management, and initiates payment flows.
Backend (Server-side): Primarily powered by Supabase, which provides a PostgreSQL database, authentication services, and serverless Edge Functions for critical business logic like payment gateway integration.
Deployment: The frontend is configured for deployment on Netlify, while the backend services are managed by Supabase.
II. Frontend Architecture
The frontend is structured for modularity, maintainability, and performance:

Core Frameworks & Libraries:

React: The primary JavaScript library for building the user interface, enabling a component-based development approach.
Vite: A fast build tool and development server that provides hot module replacement (HMR) for rapid development and optimizes the build process for production.
React Router DOM: Manages client-side routing, allowing for navigation between different pages (src/App.tsx).
Tailwind CSS: A utility-first CSS framework used for styling, enabling rapid UI development and consistent design (tailwind.config.js, src/index.css).
Lucide React: Provides a collection of customizable SVG icons used throughout the application.
React Helmet Async: Manages document head tags for SEO purposes, allowing dynamic title and meta description updates per page (src/pages/Home.tsx, src/pages/Products.tsx, etc.).
State Management:

The application utilizes React's Context API for global state management:
AuthContext (src/contexts/AuthContext.tsx): Manages user authentication state (logged in user, loading status, sign-in/sign-up/sign-out functions) by interacting with Supabase Auth. It also determines if the logged-in user is an administrator.
CartContext (src/contexts/CartContext.tsx): Manages the shopping cart state (items, total, item count) and provides functions to add, remove, and update quantities of products. Cart data is persisted in localStorage.
Component Structure:

Pages (src/pages/*): Top-level components representing distinct views of the application (e.g., Home, Products, Contact, AdminDashboard).
UI Components (src/components/ui/*): Reusable, generic UI elements like Button, Input, Modal, and SearchBar.
Feature-Specific Components (src/components/products/*, src/components/cart/*, src/components/admin/*, src/components/components/*): Components tailored to specific functionalities, such as ProductCard, CartDrawer, OrdersManager, ComponentCard, etc.
API Interaction:

src/lib/supabase.ts: Initializes the Supabase client, providing an interface to interact with the Supabase database, authentication, and Edge Functions. Environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are used for configuration.
Payment Gateway Integration:

src/lib/payment.ts: Contains the core logic for integrating with Razorpay, an Indian payment gateway. This includes functions for:
Loading the Razorpay SDK dynamically.
Generating unique order IDs (generateOrderId).
Input validation for customer details (validateName, validatePhone, validateEmail, validatePincode).
Calculating delivery charges based on cart contents (calculateDeliveryCharge).
Initiating the payment process (initiatePayment), which involves calling a Supabase Edge Function to create a Razorpay order and then opening the Razorpay checkout modal.
Updating order status in the database after payment completion.
src/components/cart/CheckoutModal.tsx: The UI component that collects customer and shipping details, calculates the final amount, and triggers the initiatePayment function.
Progressive Web App (PWA):

public/manifest.json: Defines the PWA's metadata, including app name, icons, display mode, and shortcuts, enabling the application to be installed on a user's device.
public/sw.js: A basic Service Worker script for caching static assets, providing offline capabilities and faster loading times. It's registered in src/main.tsx only for production builds.
SEO & Performance:

index.html: Contains extensive meta tags for search engine optimization, including Open Graph and Twitter Card metadata.
sitemap.xml (public/sitemap.xml): Provides a sitemap for search engines to crawl the site effectively.
robots.txt (public/robots.txt): Directs web crawlers on which pages to index or disallow.
Vite's build optimizations and preconnect/dns-prefetch hints in index.html are used to improve loading performance.
Content Security Policy (CSP) headers are configured in netlify.toml and vite.config.ts to mitigate cross-site scripting (XSS) attacks.
III. Backend Architecture (Supabase)
The backend is built entirely on Supabase, providing a managed, scalable, and secure infrastructure:

Database (PostgreSQL):

The core data store for the application. Key tables include:
products: Stores details of STEM learning kits (title, description, price, category, kit_contents as text[], learning_outcomes as text[], tools_required as text[], assembly_steps, and image_urls as text[] for multiple images). It also supports on_offer with discount_type and discount_value.
components: Stores information about individual electronic components (name, price, description, category, stock_status, image_url).
orders: Records customer orders, including customer details, cart_items (stored as jsonb to capture product details at the time of order), shipping_details (jsonb), total_amount, currency, and various payment-related fields (payment_status, payment_id, payment_method, webhook_data). The id column is TEXT to support custom order IDs (e.g., XLV_timestamp_random).
contacts: Stores submissions from the contact form (name, email, message).
resources: Contains learning materials (title, type (pdf or video enum), kit_tag, file_url).
custom_projects: Stores requests for custom robotics projects (customer name, contact info, project description, budget range, status).
component_requests: Records requests from users for specific electronic components not currently in stock (requester name, email, component name, reason).
profiles: Stores additional user profile information (full name) linked to auth.users.
Data Types: Extensive use of TEXT arrays (text[]) for lists of items (e.g., kit_contents) and JSONB for flexible, unstructured data (e.g., cart_items, shipping_details, webhook_data).
Enums: Custom PostgreSQL ENUM types (order_status, resource_type) are defined for structured data.
Indexing: Various indexes are created on frequently queried columns (e.g., created_at, category, status, cf_order_id) to optimize database performance.
Authentication:

Supabase Auth provides user authentication services, including email/password sign-up and sign-in.
Row Level Security (RLS) policies are extensively applied to all tables to ensure that users can only access or modify data they are authorized to. For instance, public users can read products and resources, but only authenticated administrators (xolvetech@gmail.com) can manage products, orders, or view contact messages. A handle_new_user trigger automatically creates a profile entry for new users upon registration.
Edge Functions (Deno):

Supabase Edge Functions are serverless functions written in TypeScript/JavaScript and deployed on Deno. They are used for secure, backend-only operations:
create-razorpay-order (supabase/functions/create-razorpay-order/index.ts): This function receives an order amount and customer details from the frontend, securely interacts with the Razorpay API using server-side API keys (stored as Supabase secrets), and returns a Razorpay order_id to the frontend. This prevents exposing sensitive API keys to the client.
razorpay-webhook (supabase/functions/razorpay-webhook/index.ts): This function acts as an endpoint for Razorpay's webhook notifications. It receives payment status updates (e.g., payment.captured, payment.failed), verifies the webhook signature for security, and then updates the corresponding order's payment_status and status in the Supabase database using the Supabase service role key.
IV. Technical Flow Examples
User Registration/Login:

A user submits their email and password (and name for sign-up) via the AuthModal on the frontend.
The AuthContext calls supabase.auth.signInWithPassword or supabase.auth.signUp.
Supabase Auth handles user creation/authentication.
For new sign-ups, a PostgreSQL trigger (handle_new_user) automatically creates a corresponding entry in the profiles table.
The AuthContext updates its internal state, making the user object available throughout the application.
Product Purchase Flow:

A user adds products to their cart, managed by CartContext.
During checkout (CheckoutModal), the user provides shipping and contact information.
The frontend calculates the total amount, including delivery charges.
The CheckoutModal calls initiatePayment from src/lib/payment.ts.
initiatePayment makes an API call to the create-razorpay-order Supabase Edge Function, passing the total amount and customer details.
The Edge Function securely communicates with Razorpay, creates an order, and returns the Razorpay order_id and key_id to the frontend.
The frontend then opens the Razorpay checkout modal using the received order_id and key_id.
Upon successful payment, Razorpay sends a webhook notification to the razorpay-webhook Supabase Edge Function.
The razorpay-webhook function verifies the signature and updates the order's payment_status and status in the orders table.
Concurrently, the frontend's Razorpay handler receives a success callback, clears the cart, and redirects the user to the PaymentSuccess page, which fetches the updated order details from the database.
Admin Panel Operations:

An administrator logs in via AdminLogin (src/pages/admin/AdminLogin.tsx).
The ProtectedRoute (src/components/auth/ProtectedRoute.tsx) ensures only the designated admin email (xolvetech@gmail.com) can access the /admin route.
The AdminDashboard (src/pages/admin/AdminDashboard.tsx) displays statistics and provides navigation to various management sections (Products, Orders, Components, Resources, Contacts, Custom Projects).
Each manager component (e.g., ProductsManager, OrdersManager) directly interacts with the Supabase client to perform CRUD (Create, Read, Update, Delete) operations on the respective database tables, respecting RLS policies.
V. Development & Deployment
Development Environment:

Vite: Provides a fast development server with HMR, enabling real-time feedback during coding.
Supabase: Developers can either connect to a hosted Supabase project or run a local Supabase instance using the Supabase CLI for local database and function development.
Deployment Strategy:

Frontend: The application is configured for static site deployment on Netlify (netlify.toml). Netlify handles the build process (npm run build) and serves the dist directory. It also manages redirects and custom HTTP headers, including the Content Security Policy.
Backend: Supabase hosts the PostgreSQL database, handles user authentication, and deploys the Edge Functions.
Security Considerations:

Content Security Policy (CSP): Defined in netlify.toml and vite.config.ts to restrict the sources from which content can be loaded, mitigating XSS attacks.
Row Level Security (RLS): Enforced at the database level to control data access based on user roles and authentication status.
Webhook Signature Verification: The razorpay-webhook Edge Function verifies the signature of incoming webhooks to ensure they originate from Razorpay and have not been tampered with.
Environment Variables: Sensitive API keys and secrets are stored as environment variables (e.g., RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_WEBHOOK_SECRET) and accessed securely by Edge Functions, never exposed to the client-side.
Input Sanitization: Frontend utility functions (src/utils/sanitize.ts) are used to sanitize user inputs before display or submission to prevent XSS vulnerabilities.
