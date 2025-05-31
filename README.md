
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

## 📱 Complete Application Overview

### Core Philosophy
Cannabis Army Tracker (CAT) is designed as a complete business management solution for cannabis businesses of all sizes. It combines inventory management, sales tracking, customer relationships, financial analytics, and operational tools into a single, cohesive platform. The application is built with modern web technologies and provides both desktop and mobile-friendly interfaces.

### Architecture Overview
- **Frontend**: React 18 with TypeScript for type safety
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **State Management**: React Query (@tanstack/react-query) for server state
- **Routing**: React Router v6 with protected routes
- **Charts & Analytics**: Recharts library
- **Animations**: Framer Motion for smooth transitions
- **PWA**: Progressive Web App capabilities for mobile installation

## 🗄️ Complete Database Schema

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
Tracks all inventory purchases with detailed cost breakdowns.
- `id` (UUID): Unique inventory record identifier
- `user_id` (UUID): Reference to the owning user
- `strain_id` (UUID): Foreign key to strains table
- `purchase_date` (DATE): When the inventory was purchased
- `quantity` (NUMERIC): Amount purchased in grams
- `quantity_unit` (TEXT): Unit description ("112g", "224g", "448g")
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
- `date` (TIMESTAMP): When the credit was extended
- `amount` (NUMERIC): Total amount owed
- `paid` (NUMERIC): Amount paid so far (default: 0)
- `remaining` (NUMERIC): Outstanding balance
- `status` (ENUM): 'outstanding', 'partial', 'paid', 'overdue'
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
- `type` (ENUM): 'info', 'warning', 'error', 'success'
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
- `transaction_type` (ENUM): 'purchase', 'sale', 'adjustment', 'waste'
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
- `role` (ENUM): 'admin', 'moderator', 'user'
- `created_at`: Timestamp

## 🏠 Page-by-Page Feature Breakdown

### 1. Dashboard (`/`) - Business Command Center
The main dashboard provides a comprehensive overview of your cannabis business.

**Key Components:**
- **Revenue Overview Cards**: Display total sales, profit, customers, and inventory value
- **Recent Sales Table**: Shows latest transactions with customer, strain, and profit information
- **Quick Actions Panel**: Fast access to add sales, inventory, or customers
- **Profit Trend Chart**: Visual representation of business performance over time
- **Low Stock Alerts**: Warnings when inventory levels are running low
- **Notes Section**: Sticky notes for reminders and todo items
- **Calendar Widget**: Upcoming events and reminders

**Business Intelligence:**
- Real-time profit calculations
- Sales velocity metrics
- Customer acquisition tracking
- Inventory turnover rates

### 2. Sales (`/sales`) - Transaction Management
Comprehensive sales tracking and management system.

**Sales Entry Features:**
- **Quick Sale Dialog**: Fast transaction entry with auto-calculations
- **Strain Selection**: Choose from available inventory with cost lookup
- **Customer Management**: Link sales to existing customers or create new ones
- **Quantity Presets**: Common amounts (3.5g, 7g, 14g, 28g, etc.)
- **Pricing Calculator**: Suggests prices based on configurable profit margins
- **Payment Methods**: Track how customers paid (cash, digital, etc.)
- **Image Attachments**: Add photos to sale records

**Sales Analysis:**
- **Sales Table**: Sortable, filterable list of all transactions
- **Profit Calculations**: Automatic profit/loss calculations per sale
- **Customer Insights**: Purchase history and loyalty indicators
- **Date Range Filtering**: Analyze specific time periods
- **Export Capabilities**: Download sales data for accounting

**Customer Integration:**
- **Loyalty Tags**: Visual indicators (🆕 New, 🌀 Regular, 🔥 VIP, 👻 Ghosted)
- **Purchase History**: Complete transaction history per customer
- **Spending Analytics**: Total spent, average order value, frequency

### 3. Inventory (`/inventory`) - Purchase Management
Track all inventory purchases with detailed cost analysis.

**Purchase Recording:**
- **Strain Management**: Add new strains or select existing ones
- **Quantity Units**: Support for different purchase sizes (quarters, halves, ounces, pounds)
- **Cost Breakdown**: Automatic per-gram and per-ounce calculations
- **Supplier Tracking**: Record where inventory was purchased
- **Batch Notes**: Detailed information about each purchase
- **Image Documentation**: Visual records of inventory

**Inventory Analytics:**
- **Purchase History**: Complete record of all inventory acquisitions
- **Cost Analysis**: Track cost fluctuations over time
- **Profitability Metrics**: Compare purchase costs to sale prices
- **Strain Performance**: Which strains are most/least profitable

**Integration Features:**
- **Stock Level Tracking**: Real-time inventory levels based on purchases and sales
- **Automatic Strain Creation**: New strains added automatically with first purchase
- **Cost Per Gram Updates**: Strain costs update with new purchase prices

### 4. Current Stock (`/stock`) - Live Inventory Levels
Real-time view of current inventory levels and stock movements.

**Stock Monitoring:**
- **Current Levels**: Live calculation of remaining inventory per strain
- **Stock Transactions**: Detailed log of all inventory movements
- **Low Stock Alerts**: Configurable thresholds for reorder alerts
- **Waste Tracking**: Record inventory loss due to quality issues
- **Adjustment Logging**: Manual inventory corrections with reasons

**Transaction Types:**
- **Purchases**: Inventory additions from suppliers
- **Sales**: Inventory reductions from customer transactions
- **Adjustments**: Manual corrections for discrepancies
- **Waste**: Inventory loss due to quality, legal, or other issues

### 5. Customers (`/customers`) - Relationship Management
Comprehensive customer relationship management system.

**Customer Profiles:**
- **Basic Information**: Name, alias, platform, contact details
- **Relationship Status**: Trusted buyer flag and loyalty classification
- **Purchase Analytics**: Total orders, amount spent, profit generated
- **Communication History**: Notes and interaction tracking
- **Payment Reliability**: Track payment timeliness and issues

**Customer Insights:**
- **Loyalty Classification System**:
  - 🆕 **New**: First-time or very recent customers
  - 🌀 **Regular**: Customers with 5+ orders
  - 🔥 **VIP**: Trusted buyers with 10+ orders
  - 👻 **Ghosted**: Customers who haven't purchased recently
- **Spending Patterns**: Average order value, purchase frequency
- **Preferred Strains**: Most commonly purchased products
- **Communication Preferences**: Platform preferences and contact methods

**Customer Management:**
- **Advanced Filtering**: Sort by spending, loyalty, last purchase date
- **Bulk Operations**: Update multiple customer records
- **Export Functions**: Customer list export for marketing
- **Integration**: Direct customer creation from sale entry

### 6. Tick Ledger (`/tick-ledger`) - Credit Management
Comprehensive system for managing credit sales and outstanding payments.

**Credit Sales Management:**
- **Credit Extension**: Record sales made on credit terms
- **Payment Tracking**: Log partial and full payments
- **Due Date Management**: Set and track payment deadlines
- **Status Tracking**: Outstanding, partial, paid, overdue classifications
- **Interest Calculations**: Optional interest on overdue amounts
- **Payment Reminders**: Automated or manual payment notifications

**Financial Controls:**
- **Credit Limits**: Set maximum credit amounts per customer
- **Risk Assessment**: Track payment reliability and adjust credit terms
- **Collection Tools**: Templates for payment follow-up communication
- **Dispute Resolution**: Notes and tracking for payment disputes

### 7. Analytics (`/analytics`) - Business Intelligence
Comprehensive business analytics and reporting dashboard.

**Financial Metrics:**
- **Revenue Analysis**: Total sales, profit margins, growth trends
- **Cost Analysis**: Cost of goods sold, overhead allocation
- **Profitability**: Per-strain, per-customer, per-time-period profit analysis
- **Cash Flow**: Revenue vs. expenses over time

**Sales Analytics:**
- **Top Performing Strains**: Best sellers by volume and profit
- **Customer Analytics**: Most valuable customers, new vs. repeat sales
- **Seasonal Trends**: Sales patterns over different time periods
- **Average Order Value**: Trends in customer spending patterns

**Inventory Intelligence:**
- **Turnover Rates**: How quickly inventory moves
- **Carrying Costs**: Cost of holding inventory over time
- **Demand Forecasting**: Predict future inventory needs
- **Waste Analysis**: Track and minimize inventory loss

**Visual Reporting:**
- **Interactive Charts**: Powered by Recharts library
- **Customizable Dashboards**: Arrange metrics according to priorities
- **Export Capabilities**: PDF reports, CSV data exports
- **Date Range Selection**: Analyze any time period

### 8. Business Supplies (`/business-supplies`) - Operational Inventory
Manage non-product business supplies and equipment.

**Supply Categories:**
- **Packaging Materials**: Bags, containers, labels, seals
- **Equipment**: Scales, vacuum sealers, storage containers
- **Marketing Materials**: Business cards, promotional items
- **Office Supplies**: General business operation materials
- **Safety Equipment**: Security, storage, handling equipment

**Supply Management:**
- **Inventory Tracking**: Current quantities and usage rates
- **Supplier Management**: Track vendors and pricing
- **Reorder Alerts**: Low stock notifications with configurable thresholds
- **Cost Tracking**: Monitor supply costs and budget allocation
- **Usage Analytics**: Track consumption patterns

### 9. Calendar (`/calendar`) - Scheduling System
Comprehensive calendar system for business scheduling and reminders.

**Event Management:**
- **Appointment Scheduling**: Customer meetings, supplier visits
- **Reminder System**: Payment due dates, restock alerts, compliance deadlines
- **Recurring Events**: Regular activities like inventory counts, payments
- **Category Color Coding**: Visual organization by event type
- **Integration**: Links to customer records, sales, and inventory

**Notification System:**
- **Advanced Reminders**: Configurable lead times for different event types
- **Mobile Notifications**: PWA push notifications for important events
- **Email Alerts**: Optional email reminders for critical dates
- **Escalation**: Multiple reminder levels for critical events

### 10. Natural Language Logger (`/natural-language-logger`) - AI-Powered Entry
Advanced sale entry system using natural language processing.

**Natural Language Processing:**
- **Conversational Entry**: "Sold 3.5g of OG Kush to Mike for $35"
- **Context Understanding**: Recognizes customers, strains, quantities, prices
- **Smart Suggestions**: Auto-complete and correction suggestions
- **Multiple Formats**: Supports various ways of describing transactions

**AI Features:**
- **Customer Recognition**: Matches names to existing customer records
- **Strain Matching**: Fuzzy matching for strain names with typos
- **Price Validation**: Alerts for unusual pricing
- **Quantity Standardization**: Converts various quantity formats

**Efficiency Tools:**
- **Bulk Entry**: Process multiple sales in one session
- **Templates**: Common transaction templates for faster entry
- **Voice Input**: Speech-to-text capabilities for hands-free operation
- **Mobile Optimization**: Designed for on-the-go use

### 11. Mates Rates Calculator (`/mates-rates`) - Special Pricing
Specialized calculator for friend and family pricing.

**Pricing Scenarios:**
- **Friend Discounts**: Configurable discount percentages
- **Bulk Pricing**: Volume-based pricing tiers
- **Cost-Plus Pricing**: Minimal markup for close friends
- **Market Comparison**: Compare prices to standard rates

**Calculation Features:**
- **Multiple Discount Types**: Percentage, fixed amount, cost-plus
- **Quantity Breaks**: Different rates for different amounts
- **Strain-Specific Rates**: Special pricing per product
- **Profit Tracking**: Monitor profit impact of special pricing

### 12. Notes (`/notes`) - Personal Organization
Advanced note-taking system with visual organization.

**Note Features:**
- **Sticky Note Interface**: Draggable, resizable notes on a digital canvas
- **Color Coding**: Multiple colors for categorization
- **Rich Text**: Formatting options for better organization
- **Pinning System**: Keep important notes always visible
- **Search Functionality**: Find notes by content or title

**Organization Tools:**
- **Categories**: Group related notes together
- **Tagging System**: Multiple tags per note for cross-referencing
- **Templates**: Pre-formatted notes for common use cases
- **Archiving**: Hide completed or outdated notes

### 13. Settings (`/settings`) - System Configuration
Comprehensive application configuration and customization.

**User Settings:**
- **Profile Management**: Update personal information and preferences
- **Theme Selection**: Multiple color schemes and dark/light modes
- **Stoner Mode**: Toggle between professional and casual language
- **Notification Preferences**: Control alert types and timing

**Business Configuration:**
- **Default Margins**: Set standard profit margin targets
- **Currency Settings**: Local currency display preferences
- **Tax Configuration**: Sales tax rates and calculation methods
- **Measurement Units**: Metric vs. imperial unit preferences

**Data Management:**
- **Export Tools**: Backup all data in various formats
- **Import Functions**: Restore data or migrate from other systems
- **Data Retention**: Configure how long to keep different data types
- **Privacy Controls**: Data sharing and visibility preferences

**Integration Settings:**
- **API Configuration**: External service integrations
- **Automation Rules**: Set up automatic processes
- **Webhook Configuration**: Connect to external systems
- **Backup Scheduling**: Automated data backup frequency

## 🔧 Component Architecture

### Core UI Components (`/src/components/ui/`)
Built on shadcn/ui library providing consistent, accessible components:

- **Forms**: Input, Select, Checkbox, Radio, Textarea with validation
- **Navigation**: Button, Link, Breadcrumb, Pagination
- **Layout**: Card, Sheet, Dialog, Popover, Tooltip
- **Data Display**: Table, Badge, Avatar, Progress
- **Feedback**: Alert, Toast, Loading Spinner

### Feature-Specific Components

#### Sales Components (`/src/components/sales/`)
- **AddSaleDialog**: Comprehensive sale entry form with auto-calculations
- **SalesTable**: Sortable, filterable transaction list
- **SalesSummary**: Aggregate statistics and profit analysis
- **SalesHeader**: Search, filters, and quick action controls
- **PriceCalculator**: Profit margin calculator with suggestions

#### Inventory Components (`/src/components/inventory/`)
- **AddInventoryDialog**: Purchase entry form with cost calculations
- **InventoryTable**: Purchase history with detailed breakdowns
- **InventorySummary**: Cost analysis and profitability metrics
- **InventoryHeader**: Search and filtering controls

#### Customer Components (`/src/components/customers/`)
- **CustomerList**: Comprehensive customer directory
- **CustomerDetails**: Individual customer profile and history
- **CustomerFormDialog**: Customer creation and editing
- **CustomerFilters**: Advanced filtering and sorting options

#### Analytics Components (`/src/components/analytics/`)
- **AnalyticsMetrics**: Key performance indicator cards
- **AnalyticsCharts**: Interactive charts for trend analysis

### Custom Hooks (`/src/hooks/`)

#### Supabase Integration Hooks
- **useSupabaseSales**: Sales CRUD operations and real-time updates
- **useSupabaseInventory**: Inventory management with strain integration
- **useSupabaseCustomers**: Customer relationship management
- **useSupabaseAnalytics**: Business intelligence calculations
- **useSupabaseStock**: Real-time inventory level tracking
- **useSupabaseBusinessSupplies**: Operational supply management

#### Utility Hooks
- **useAuth**: Authentication state and user management
- **useI18n**: Internationalization and language switching
- **useSaleParser**: Natural language sale entry processing
- **useNotifications**: System alert management

## 🔐 Authentication & Security

### Supabase Authentication
- **Email/Password**: Primary authentication method
- **Session Management**: Automatic token refresh and persistence
- **Password Reset**: Secure password recovery flow
- **Email Verification**: Optional email confirmation

### Row Level Security (RLS)
- **User Isolation**: All data strictly scoped to authenticated users
- **Automatic Policies**: Database-level security enforcement
- **API Security**: All endpoints protected by user context
- **Data Privacy**: No cross-user data access possible

### Security Features
- **HTTPS Enforcement**: All communications encrypted
- **JWT Tokens**: Secure API authentication
- **Database Encryption**: Sensitive data encrypted at rest
- **Input Validation**: Comprehensive data sanitization

## 🎨 Theming & Customization

### Theme System
Advanced theming with multiple options:
- **Light/Dark Modes**: System or manual theme selection
- **Color Schemes**: Multiple preset color combinations
- **Custom Themes**: User-defined color palettes
- **Component Theming**: Consistent styling across all components

### Stoner Mode
Unique feature allowing language style switching:
- **Professional Mode**: Business-appropriate language
- **Stoner Mode**: Casual, cannabis-culture-friendly language
- **Dynamic Switching**: Real-time language updates
- **Comprehensive Coverage**: All interface text affected

### Responsive Design
- **Mobile-First**: Optimized for mobile cannabis businesses
- **Tablet Support**: Enhanced interface for tablet users
- **Desktop Features**: Full functionality on larger screens
- **PWA Capabilities**: Install as mobile app

## 📊 Business Intelligence Features

### Real-Time Calculations
- **Live Profit Tracking**: Instant profit/loss calculations
- **Inventory Valuation**: Real-time inventory worth
- **Customer Lifetime Value**: Ongoing customer value calculation
- **Trend Analysis**: Automatic trend detection and alerts

### Predictive Analytics
- **Demand Forecasting**: Predict future inventory needs
- **Customer Behavior**: Anticipate customer purchasing patterns
- **Seasonal Trends**: Identify and prepare for seasonal changes
- **Profitability Projections**: Forecast future business performance

### Export & Reporting
- **Financial Reports**: Comprehensive profit/loss statements
- **Tax Preparation**: Export data in tax-friendly formats
- **Inventory Reports**: Stock levels and movement analysis
- **Customer Reports**: Relationship and sales analysis

## 🔔 Notification System

### Alert Types
- **Low Stock Warnings**: Configurable inventory thresholds
- **Payment Reminders**: Credit payment due notifications
- **Calendar Alerts**: Upcoming event notifications
- **System Updates**: Feature announcements and updates

### Delivery Methods
- **In-App Notifications**: Real-time application alerts
- **PWA Push Notifications**: Mobile device notifications
- **Email Alerts**: Optional email notification system
- **Badge Counters**: Visual notification indicators

## 📱 Progressive Web App (PWA)

### Mobile Features
- **App Installation**: Install directly to device home screen
- **Offline Capability**: Limited functionality without internet
- **Push Notifications**: Native mobile notifications
- **Camera Integration**: Use device camera for photos

### Performance
- **Fast Loading**: Optimized bundle sizes and lazy loading
- **Caching Strategy**: Intelligent caching for offline use
- **Background Sync**: Sync data when connection restored
- **Service Worker**: Advanced PWA functionality

## 🚀 Deployment & Infrastructure

### Hosting Options
- **Lovable Deployment**: One-click deployment to Lovable hosting
- **Custom Domain**: Connect your own domain name
- **SSL Certificates**: Automatic HTTPS certificate management
- **Global CDN**: Fast loading worldwide

### Backend Services
- **Supabase Integration**: Complete backend-as-a-service
- **PostgreSQL Database**: Robust, scalable database
- **Real-time Updates**: Live data synchronization
- **File Storage**: Image and document storage

## 🤝 Contributing & Development

### Development Setup
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Supabase credentials

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Code Standards
- **TypeScript**: Strict type checking throughout
- **ESLint**: Consistent code formatting and best practices
- **Component Architecture**: Small, focused, reusable components
- **Custom Hooks**: Extract logic into reusable hooks
- **Error Handling**: Comprehensive error boundaries and user feedback

### Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base shadcn/ui components
│   ├── sales/           # Sales-specific components
│   ├── inventory/       # Inventory management components
│   ├── customers/       # Customer management components
│   ├── analytics/       # Business analytics components
│   ├── auth/            # Authentication components
│   └── layout/          # Application layout components
├── pages/               # Route components (one per page)
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── utils/               # Utility functions and helpers
├── integrations/        # Third-party service integrations
└── contexts/            # React context providers
```

## 🐛 Troubleshooting

### Common Issues

#### Authentication Problems
- **Login Failures**: Check Supabase URL configuration
- **Session Persistence**: Verify browser localStorage permissions
- **Email Verification**: Confirm email settings in Supabase

#### Data Synchronization
- **Missing Data**: Verify Row Level Security policies
- **Slow Loading**: Check internet connection and Supabase status
- **Calculation Errors**: Ensure data consistency between tables

#### Performance Issues
- **Slow Loading**: Clear browser cache and check network
- **Memory Usage**: Close unused browser tabs
- **Mobile Performance**: Update to latest app version

### Support Resources
- **Documentation**: Comprehensive guides in `/docs` folder
- **Video Tutorials**: Step-by-step feature walkthroughs
- **Community Forum**: User community for questions and tips
- **Direct Support**: Contact form for technical issues

## 📈 Business Benefits

### Operational Efficiency
- **Time Savings**: Automated calculations and data entry
- **Error Reduction**: Systematic data validation and consistency
- **Mobile Access**: Manage business from anywhere
- **Real-time Insights**: Immediate access to business metrics

### Financial Management
- **Profit Optimization**: Detailed profit analysis per transaction
- **Cost Control**: Track all business expenses and supplies
- **Tax Preparation**: Export-ready financial data
- **Cash Flow**: Monitor payment timing and credit management

### Customer Relationships
- **Loyalty Tracking**: Systematic customer classification and history
- **Personalized Service**: Complete customer preference tracking
- **Communication History**: Maintain detailed interaction records
- **Credit Management**: Professional credit and payment tracking

### Compliance & Record Keeping
- **Complete Audit Trail**: Every transaction documented
- **Data Backup**: Secure, automated data protection
- **Historical Records**: Unlimited data retention
- **Export Capabilities**: Data available in multiple formats

## 🔮 Future Development

### Planned Features
- **Multi-user Support**: Team collaboration and role management
- **Advanced Analytics**: Machine learning insights and predictions
- **Mobile App**: Native iOS and Android applications
- **Integration APIs**: Connect with accounting and compliance systems
- **Inventory Automation**: Automatic reorder suggestions and supplier integration

### Roadmap Priorities
1. **Enhanced Mobile Experience**: Native app development
2. **Advanced Reporting**: Custom report builder
3. **Team Collaboration**: Multi-user workspace features
4. **API Integrations**: Connect with popular business tools
5. **Compliance Tools**: Jurisdiction-specific compliance features

## 📄 Legal & Compliance

### Data Privacy
- **GDPR Compliance**: European data protection standards
- **Data Ownership**: Users retain full ownership of their data
- **Data Portability**: Export data in standard formats
- **Right to Deletion**: Complete data removal on request

### Security Standards
- **Industry Best Practices**: Following established security protocols
- **Regular Updates**: Continuous security improvements
- **Vulnerability Monitoring**: Proactive security issue detection
- **Incident Response**: Established procedures for security issues

### Cannabis Compliance
- **Record Keeping**: Comprehensive transaction documentation
- **Audit Support**: Export capabilities for compliance audits
- **Jurisdictional Flexibility**: Configurable for different legal frameworks
- **Privacy Protection**: Secure handling of sensitive business data

---

**Cannabis Army Tracker (CAT)** - Empowering cannabis businesses with comprehensive, professional management tools while maintaining the culture and community that makes this industry special. 🌿

*Built with ❤️ for the cannabis community*
