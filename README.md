
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

### Core Features
- **Dashboard**: Real-time business metrics and quick actions
- **Inventory Management**: Track strains, quantities, costs, and stock levels
- **Sales Tracking**: Log sales with profit calculations and customer data
- **Customer Management**: Maintain customer records and purchase history
- **Tick Ledger**: Track credit sales and outstanding payments
- **Analytics**: Visual reports and business insights
- **Calendar**: Schedule reminders and track important dates
- **Quick Sale Logger**: Natural language sale entry with AI assistance
- **Business Supplies**: Manage packaging and business supply inventory
- **Notifications**: Real-time alerts for low stock, payments, etc.
- **Mates Rates Calculator**: Special pricing calculations
- **Notes System**: Sticky notes and general note-taking
- **PWA Support**: Install as mobile/desktop app

### Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **State Management**: React Query (@tanstack/react-query)
- **Routing**: React Router v6
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui base components
│   ├── theme/           # Theme and internationalization
│   ├── layout/          # Layout components (Header, Sidebar)
│   ├── dashboard/       # Dashboard-specific components
│   ├── inventory/       # Inventory management components
│   ├── sales/           # Sales tracking components
│   ├── customers/       # Customer management components
│   └── ...              # Other feature-specific components
├── pages/               # Route components
├── hooks/               # Custom React hooks
├── contexts/            # React contexts for state management
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── integrations/        # Third-party integrations (Supabase)
└── main.tsx            # Application entry point
```

## 🗄️ Database Schema

The application uses Supabase PostgreSQL database. Since no database tables are currently set up, you'll need to implement the backend by:

1. Click the green "Supabase" button in the top-right of the Lovable interface
2. Connect to your Supabase project
3. The application will guide you through setting up the necessary tables

### Expected Database Tables
When implemented, the database will include:
- `inventory` - Product inventory tracking
- `sales` - Sales transaction records
- `customers` - Customer information
- `tick_ledger` - Credit sales tracking
- `business_supplies` - Supply inventory
- `notes` - User notes storage
- `notifications` - System notifications
- `user_profiles` - Extended user information

## 🎨 Theming & Customization

### Theme System
The application supports multiple themes and a "Stoner Mode" for casual interface language:

- **Theme Provider**: `src/components/theme/ThemeProvider.tsx`
- **String Dictionary**: `src/components/theme/stringDictionary.ts`
- **Theme Components**: `src/components/theme/`

### Stoner Mode
Toggle between professional and casual language throughout the app:
```typescript
// Access via useI18n hook
const { t, isStonerMode, toggleStonerMode } = useI18n();
```

### Adding New Strings
Edit `src/components/theme/stringDictionary.ts`:
```typescript
"your.key": {
  default: "Professional text",
  stoner: "Casual stoner text 🌿"
}
```

## 🔧 Component Development

### Creating New Components
1. Create focused, single-purpose components
2. Use TypeScript for type safety
3. Follow the existing naming conventions
4. Place in appropriate feature directory

Example component structure:
```typescript
import React from 'react';
import { useI18n } from '@/hooks/useI18n';

interface YourComponentProps {
  // Define props with TypeScript
}

const YourComponent: React.FC<YourComponentProps> = ({ props }) => {
  const { t } = useI18n();
  
  return (
    <div className="your-tailwind-classes">
      {t('your.string.key')}
    </div>
  );
};

export default YourComponent;
```

### Using shadcn/ui Components
The app uses shadcn/ui for consistent UI components:
```typescript
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
```

## 📱 PWA Features

### Progressive Web App
The app includes PWA capabilities:
- **Manifest**: `/public/manifest.json`
- **Service Worker**: `/public/service-worker.js`
- **Install Banner**: Prompts users to install the app
- **Offline Support**: Basic offline functionality

### Notifications
System supports push notifications for:
- Low inventory alerts
- Payment reminders
- Calendar events
- Custom business alerts

## 🛠️ Development Guidelines

### Code Standards
- Use TypeScript for all new code
- Follow React best practices
- Use functional components with hooks
- Implement proper error handling
- Write descriptive component and function names

### State Management
- Use React Query for server state
- Use React Context for global client state
- Keep component state local when possible

### Styling Guidelines
- Use Tailwind CSS classes
- Follow mobile-first responsive design
- Use semantic color names from the theme
- Maintain consistent spacing and typography

### Performance
- Lazy load route components
- Optimize images and assets
- Use React.memo() for expensive components
- Implement proper loading states

## 📊 Key Features Explained

### Dashboard
- Real-time profit tracking
- Quick access to all major functions
- Customizable notes and todo lists
- Recent activity summary

### Inventory Management
- Add/edit product inventory
- Track purchase costs and quantities
- Monitor stock levels
- Low stock alerts

### Sales Tracking
- Quick sale entry via natural language
- Profit margin calculations
- Customer association
- Payment method tracking

### Customer Management
- Customer profiles and contact info
- Purchase history
- Credit tracking
- Communication logs

### Analytics
- Profit trend charts
- Sales performance metrics
- Inventory turnover rates
- Customer analytics

## 🔐 Authentication & Security

### Supabase Authentication
When connected to Supabase:
- Email/password authentication
- Row Level Security (RLS) policies
- Secure API endpoints
- User session management

### Security Features
- All data access controlled by RLS policies
- User-specific data isolation
- Secure API key management
- HTTPS enforcement

## 🚀 Deployment

### Lovable Deployment
1. Click "Publish" in the Lovable interface
2. Configure custom domain (paid plans)
3. Application deploys automatically

### Manual Deployment
```bash
# Build for production
npm run build

# Deploy to your preferred hosting platform
# (Vercel, Netlify, etc.)
```

## 📝 Environment Variables

When using Supabase integration:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🤝 Contributing

### Making Changes
1. Create feature branches for new functionality
2. Test changes thoroughly
3. Update documentation as needed
4. Follow existing code patterns

### File Organization
- Keep components small and focused
- Extract complex logic into custom hooks
- Use appropriate TypeScript types
- Maintain consistent naming conventions

## 📚 Additional Resources

- [Lovable Documentation](https://docs.lovable.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Query Documentation](https://tanstack.com/query)

## 🐛 Troubleshooting

### Common Issues
1. **Build Errors**: Check TypeScript errors and missing imports
2. **Styling Issues**: Verify Tailwind classes and responsive design
3. **Database Issues**: Ensure Supabase connection and RLS policies
4. **Authentication**: Check Supabase auth configuration

### Getting Help
- Check browser console for errors
- Review Supabase logs for backend issues
- Use React Developer Tools for component debugging
- Check network tab for API request issues

## 📄 License

This project is proprietary software. All rights reserved.

---

**Cannabis Army Tracker (CAT)** - Empowering cannabis businesses with comprehensive management tools 🌿
