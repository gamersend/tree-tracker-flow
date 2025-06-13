
# Cannabis Army Tracker (CAT) 🌿

A comprehensive cannabis business management application built with React, TypeScript, and Supabase. CAT provides cloud-connected inventory tracking, sales logging, customer management, analytics, and calendar scheduling for cannabis businesses.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Supabase account (for backend functionality)

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd cannabis-army-tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 📱 Application Overview

### Core Philosophy
Cannabis Army Tracker (CAT) is designed as a complete business management solution for cannabis businesses of all sizes. It combines inventory management, sales tracking, customer relationships, financial analytics, and operational tools into a single, cohesive platform.

### Architecture Overview
- **Frontend**: React 18 with TypeScript for type safety
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **State Management**: React Query (@tanstack/react-query) for server state
- **Routing**: React Router v6 with protected routes
- **Charts & Analytics**: Recharts library
- **Animations**: Framer Motion for smooth transitions
- **PWA**: Progressive Web App capabilities for mobile installation

## 🗄️ Database Schema

### Core Tables

#### 1. **strains** - Product Catalog
Stores information about different cannabis strains available for inventory and sales.
- `id` (UUID): Unique strain identifier
- `user_id` (UUID): Reference to the owning user
- `name` (TEXT): Strain name (e.g., "OG Kush", "Blue Dream")
- `cost_per_gram` (NUMERIC): Base cost per gram for profit calculations
- `image_url` (TEXT): Optional strain image
- `description` (TEXT): Detailed strain information
- `created_at`, `updated_at`: Timestamps

#### 2. **inventory** - Purchase Records
Tracks all inventory purchases with detailed cost breakdowns and flexible quantity units.
- `id` (UUID): Unique inventory record identifier
- `user_id` (UUID): Reference to the owning user
- `strain_id` (UUID): Foreign key to strains table
- `purchase_date` (DATE): When the inventory was purchased
- `quantity` (NUMERIC): Amount purchased in grams (supports any amount)
- `quantity_unit` (TEXT): Unit description for backend compatibility
- `display_unit` (TEXT): User-friendly unit display (e.g., "112g", "1oz", "custom")
- `total_cost` (NUMERIC): Total amount paid for the purchase
- `price_per_gram` (NUMERIC): Calculated cost per gram
- `cost_per_ounce` (NUMERIC): Calculated cost per ounce (28g)
- `notes` (TEXT): Additional purchase information
- `image_url` (TEXT): Optional purchase image
- `created_at`, `updated_at`: Timestamps

#### 3. **sales** - Transaction Records
Records all sales transactions with profit calculations.
- `id` (UUID): Unique sale identifier
- `user_id` (UUID): Reference to the owning user
- `customer_id` (UUID): Optional reference to customers table
- `strain_id` (UUID): Foreign key to strains table
- `date` (TIMESTAMP): When the sale occurred
- `quantity` (NUMERIC): Amount sold in grams
- `sale_price` (NUMERIC): Total sale price
- `cost_per_gram` (NUMERIC): Cost basis for profit calculation
- `profit` (NUMERIC): Calculated profit (sale_price - (quantity * cost_per_gram))
- `payment_method` (TEXT): How the customer paid
- `notes` (TEXT): Additional sale information
- `image_url` (TEXT): Optional sale image
- `created_at`, `updated_at`: Timestamps

#### 4. **customers** - Customer Relationship Management
Manages customer information and tracks relationship history.
- `id` (UUID): Unique customer identifier
- `user_id` (UUID): Reference to the owning user
- `name` (TEXT): Customer's name or alias
- `platform` (TEXT): Where you know them from (e.g., "Instagram", "Friend")
- `alias` (TEXT): Alternative name or nickname
- `notes` (TEXT): Personal notes about the customer
- `trusted_buyer` (BOOLEAN): Whether this is a trusted repeat customer
- `total_orders` (INTEGER): Automatically calculated total number of purchases
- `total_spent` (NUMERIC): Automatically calculated total amount spent
- `total_profit` (NUMERIC): Automatically calculated total profit from this customer
- `last_purchase` (TIMESTAMP): Date of most recent purchase
- `emoji` (TEXT): Visual identifier emoji (default: 🌿)
- `created_at`, `updated_at`: Timestamps

#### 5. **business_supplies** - Business Inventory
Tracks non-product business supplies and equipment.
- `id` (UUID): Unique supply identifier
- `user_id` (UUID): Reference to the owning user
- `name` (TEXT): Supply name (e.g., "Vacuum Sealer Bags", "Scales")
- `category` (TEXT): Supply category for organization
- `quantity` (INTEGER): Current quantity in stock
- `cost_per_unit` (NUMERIC): Price per individual unit
- `supplier` (TEXT): Where you purchase this supply
- `notes` (TEXT): Additional supply information
- `low_stock_threshold` (INTEGER): Alert level for reordering (default: 5)
- `image_url` (TEXT): Optional supply image
- `created_at`, `updated_at`: Timestamps

#### 6. **tick_ledger** - Credit Sales Tracking
Manages sales made on credit ("tick") and payment tracking.
- `id` (UUID): Unique ledger entry identifier
- `user_id` (UUID): Reference to the owning user
- `customer_id` (UUID): Foreign key to customers table
- `sale_id` (UUID): Optional reference to original sale
- `strain_id` (UUID): Optional reference to strain sold
- `date` (TIMESTAMP): When the credit was extended
- `amount` (NUMERIC): Total amount owed
- `paid` (NUMERIC): Amount paid so far (default: 0)
- `remaining` (NUMERIC): Outstanding balance
- `status` (ENUM): 'outstanding', 'partial', 'paid'
- `due_date` (TIMESTAMP): When payment is expected
- `description` (TEXT): Details about the credit transaction
- `notes` (TEXT): Additional payment notes
- `created_at`, `updated_at`: Timestamps

#### 7. **notes** - Personal Note-Taking
Stores user notes with positioning for sticky note interface.
- `id` (UUID): Unique note identifier
- `user_id` (UUID): Reference to the owning user
- `title` (TEXT): Note headline
- `content` (TEXT): Note body text
- `color` (TEXT): Note background color (default: '#fbbf24')
- `position_x`, `position_y` (INTEGER): Screen position coordinates
- `width`, `height` (INTEGER): Note dimensions
- `is_pinned` (BOOLEAN): Whether note stays visible (default: false)
- `created_at`, `updated_at`: Timestamps

#### 8. **calendar_events** - Scheduling System
Manages reminders, appointments, and important dates.
- `id` (UUID): Unique event identifier
- `user_id` (UUID): Reference to the owning user
- `title` (TEXT): Event name
- `description` (TEXT): Detailed event information
- `start_date` (TIMESTAMP): Event start time
- `end_date` (TIMESTAMP): Optional event end time
- `all_day` (BOOLEAN): Whether this is an all-day event (default: false)
- `category` (TEXT): Event type for color coding
- `reminder_minutes` (INTEGER): Minutes before event to show reminder
- `created_at`, `updated_at`: Timestamps

#### 9. **notifications** - Alert System
Manages system-generated alerts and reminders.
- `id` (UUID): Unique notification identifier
- `user_id` (UUID): Reference to the owning user
- `type` (ENUM): 'low_stock', 'payment_due', 'reminder', 'general'
- `title` (TEXT): Notification headline
- `message` (TEXT): Notification body
- `action_url` (TEXT): Optional link for user action
- `is_read` (BOOLEAN): Whether user has seen this (default: false)
- `metadata` (JSONB): Additional structured data
- `created_at`: Timestamp

#### 10. **analytics_data** - Business Metrics
Stores calculated business metrics for reporting.
- `id` (UUID): Unique metric identifier
- `user_id` (UUID): Reference to the owning user
- `metric_type` (TEXT): Type of metric (e.g., 'daily_sales', 'profit_margin')
- `metric_value` (NUMERIC): Calculated value
- `date` (DATE): Date this metric applies to
- `metadata` (JSONB): Additional metric details
- `created_at`, `updated_at`: Timestamps

#### 11. **stock_transactions** - Inventory Movement
Tracks all inventory movements beyond just purchases and sales.
- `id` (UUID): Unique transaction identifier
- `user_id` (UUID): Reference to the owning user
- `strain_id` (UUID): Foreign key to strains table
- `transaction_type` (TEXT): 'purchase', 'sale', 'adjustment', 'waste'
- `quantity` (NUMERIC): Amount of movement
- `quantity_unit` (TEXT): Unit description
- `price_per_gram` (NUMERIC): Optional price information
- `total_value` (NUMERIC): Optional total transaction value
- `notes` (TEXT): Reason for transaction
- `date` (TIMESTAMP): When transaction occurred
- `created_at`, `updated_at`: Timestamps

#### 12. **profiles** - Extended User Information
Stores additional user profile data beyond Supabase auth.
- `id` (UUID): Foreign key to auth.users
- `username` (TEXT): Chosen username
- `first_name` (TEXT): User's first name
- `last_name` (TEXT): User's last name
- `avatar_url` (TEXT): Profile picture URL
- `created_at`, `updated_at`: Timestamps

#### 13. **user_roles** - Permission System
Manages user permissions and access levels.
- `id` (UUID): Unique role assignment identifier
- `user_id` (UUID): Foreign key to auth.users
- `role` (ENUM): 'admin', 'user'
- `created_at`: Timestamp

## 🏠 Page-by-Page Feature Breakdown

### 1. Dashboard (`/`) - Business Command Center
The main dashboard provides a comprehensive overview of your cannabis business with revenue cards, recent sales, quick actions, and sticky notes.

### 2. Sales (`/sales`) - Transaction Management
Comprehensive sales tracking with quick sale entry, customer management, and detailed analytics.

### 3. Inventory (`/inventory`) - Purchase Management
Track all inventory purchases with flexible quantity support (any gram amount), strain management, and cost analysis.

**Key Features:**
- **Flexible Quantities**: Support for any gram amount (112g, 224g, 448g, or custom amounts)
- **Automatic Calculations**: Price per gram and per ounce calculations
- **Strain Integration**: Automatic strain creation with first purchase
- **Visual Documentation**: Image support for inventory records

### 4. Current Stock (`/stock`) - Live Inventory Levels
Real-time view of current inventory levels based on purchases and sales transactions.

### 5. Customers (`/customers`) - Relationship Management
Comprehensive customer relationship management with loyalty tracking and purchase history.

### 6. Tick Ledger (`/tick-ledger`) - Credit Management
System for managing credit sales and tracking outstanding payments.

### 7. Analytics (`/analytics`) - Business Intelligence
Business analytics dashboard with financial metrics, sales analysis, and visual reporting.

### 8. Business Supplies (`/business-supplies`) - Operational Inventory
Manage non-product business supplies with inventory tracking and reorder alerts.

### 9. Calendar (`/calendar`) - Scheduling System
Calendar system for business scheduling, reminders, and event management.

### 10. Natural Language Logger (`/natural-language-logger`) - AI-Powered Entry
Advanced sale entry system using natural language processing for quick transaction logging.

**Features:**
- **Conversational Entry**: "Sold 3.5g of OG Kush to Mike for $35"
- **Smart Recognition**: Customer and strain matching
- **Automatic Calculations**: Profit and cost calculations
- **Tick Support**: Credit sale tracking

### 11. Mates Rates Calculator (`/mates-rates`) - Special Pricing
Calculator for friend and family pricing with configurable discounts.

### 12. Notes (`/notes`) - Personal Organization
Sticky note interface with draggable, resizable notes for personal organization.

### 13. Settings (`/settings`) - System Configuration
Application configuration including theme selection, user preferences, and data management.

## 🔧 Component Architecture

### Core UI Components (`/src/components/ui/`)
Built on shadcn/ui library providing consistent, accessible components.

### Feature-Specific Components
- **Sales Components** (`/src/components/sales/`): Transaction management
- **Inventory Components** (`/src/components/inventory/`): Purchase tracking
- **Customer Components** (`/src/components/customers/`): CRM functionality
- **Analytics Components** (`/src/components/analytics/`): Business intelligence

### Custom Hooks (`/src/hooks/`)
- **Supabase Integration Hooks**: Database operations with real-time updates
- **Utility Hooks**: Authentication, parsing, and business logic

## 🔐 Authentication & Security

### Supabase Authentication
- Email/password authentication with session management
- Row Level Security (RLS) for user data isolation
- Automatic user profile creation

### Security Features
- User-scoped data access
- Input validation and sanitization
- Secure API endpoints

## 🎨 Theming & Customization

### Theme System
- Light/Dark mode support
- Multiple color schemes
- Stoner Mode: Toggle between professional and casual language

### Responsive Design
- Mobile-first design
- PWA capabilities
- Cross-device compatibility

## 📊 Business Intelligence Features

### Real-Time Calculations
- Live profit tracking
- Inventory valuation
- Customer analytics

### Analytics & Reporting
- Sales trends and patterns
- Customer behavior analysis
- Inventory turnover rates

## 🔔 Notification System

### Alert Types
- Low stock warnings
- Payment reminders
- Calendar notifications
- System updates

## 📱 Progressive Web App (PWA)

### Mobile Features
- App installation
- Offline capability
- Push notifications
- Camera integration

## 🚀 Deployment & Infrastructure

### Hosting
- Lovable deployment platform
- Custom domain support
- SSL certificates
- Global CDN

### Backend Services
- Supabase integration
- PostgreSQL database
- Real-time updates
- File storage

## 🤝 Development

### Tech Stack
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase backend
- React Query for state management

### Code Standards
- TypeScript strict mode
- ESLint + Prettier
- Component-driven architecture
- Custom hooks for logic separation

---

**Cannabis Army Tracker (CAT)** - Empowering cannabis businesses with comprehensive, professional management tools. 🌿

*Built with ❤️ for the cannabis community*
