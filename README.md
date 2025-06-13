# SIRME - Sistema de Registro de Horas de Empleados ⚡️

A modern, efficient employee time tracking system built with **Qwik**, **GraphQL**, and **Hasura**. SIRME enables organizations to manage employee work hours, project assignments, and generate comprehensive time reports with an intuitive, fast-loading interface.

## 🚀 Key Features

### Time Management
- **Daily Time Entry**: Register work hours across multiple projects per day
- **Project Tracking**: Associate hours with specific clients and projects
- **MPS Classification**: Mark entries as MPS (Managed Professional Services) when applicable
- **Flexible Notes**: Add detailed notes for each project entry

### Dashboard & Analytics
- **Real-time Dashboard**: View today's, weekly, and monthly hour summaries
- **Progress Tracking**: Visual indicators for weekly hour targets
- **Recent Activity**: Quick access to recent time entries
- **Interactive Calendar**: Month/week view of all time entries

### Reporting System
- **Consolidated Reports**: Automated time report generation
- **Export Functionality**: Export data for external analysis
- **Multiple Views**: Support for different reporting periods
- **User-specific Data**: Role-based data access and filtering

### Modern Architecture
- **⚡ Qwik Framework**: Ultra-fast loading with resumable hydration
- **🔗 GraphQL API**: Efficient data fetching with Hasura backend
- **🎨 Atomic Design**: Well-organized component structure
- **📱 Responsive UI**: DaisyUI + Tailwind for modern, mobile-first design

## 🏗️ Project Structure

```
src/
├── components/           # Atomic Design component structure
│   ├── atoms/           # Basic UI elements (buttons, inputs)
│   ├── molecules/       # Component combinations
│   ├── organisms/       # Complex UI sections (Dashboard, Forms)
│   ├── templates/       # Page layouts
│   ├── pages/           # Complete page components
│   └── providers/       # Context providers (GraphQL, etc.)
├── routes/              # Qwik City file-based routing
│   ├── index.tsx        # Dashboard home page
│   ├── entry/           # Time entry pages
│   ├── calendar/        # Calendar view
│   └── reports/         # Reporting section
├── graphql/             # GraphQL queries and hooks
│   └── hooks/           # Custom GraphQL hooks
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── store/               # State management
```

## 🗄️ Database Schema

The system uses PostgreSQL with the following main entities:
- **Users**: Employee information and role assignments
- **Clients**: Client/company information
- **Projects**: Project details and client associations
- **Time Entries**: Daily time registration records
- **Time Entry Projects**: Detailed hour breakdown per project
- **Time Reports**: Consolidated reporting data

## 🛠️ Tech Stack

### Frontend
- **Qwik** - Ultra-fast web framework with resumable hydration
- **Qwik City** - Full-stack routing and SSR capabilities
- **TypeScript** - Type safety and enhanced developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Beautiful component library for Tailwind

### Backend & Data
- **Hasura** - GraphQL API with real-time subscriptions
- **PostgreSQL** - Robust relational database
- **GraphQL Request** - Lightweight GraphQL client

### Development Tools
- **Vite** - Fast build tool and development server
- **ESLint** - Code linting and quality assurance
- **Prettier** - Code formatting
- **GraphQL Markdown** - API documentation generation

## 🚀 Getting Started

### Prerequisites
- Node.js (^18.17.0 || ^20.3.0 || >=21.0.0)
- bun (latest version recommended)
- Access to Hasura GraphQL endpoint

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd sirme-phidimensions
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Update the following variables in `.env.local`:
   ```env
   VITE_HASURA_ADMIN_SECRET=your_hasura_admin_secret
   VITE_GRAPHQL_ENDPOINT=your_hasura_graphql_endpoint
   ```

4. **Start development server**
   ```bash
   bun start
   ```
   The application will open at `http://localhost:5173`

### Database Setup

1. **Create PostgreSQL database**
2. **Run the database schema**
   ```bash
   psql -d your_database -f bd-sirme.sql
   ```
3. **Configure Hasura** to connect to your database
4. **Set up GraphQL permissions** for different user roles

## 📊 Usage

### Recording Time
1. Navigate to the **Dashboard** or click **"New Entry"**
2. Select the **date** for time entry
3. Add **projects** and **hours** for each client
4. Mark entries as **MPS** if applicable
5. Add **notes** for detailed tracking
6. **Save** the entry

### Viewing Reports
1. Go to **Reports** section
2. Select **date range** and **filters**
3. **Export** data as needed
4. View **consolidated summaries**

### Calendar View
1. Access **Calendar** from the main navigation
2. View **monthly/weekly** time entries
3. Click on **specific dates** to see details
4. **Quick edit** entries directly from calendar

## 🧪 Development Commands

```bash
# Start development server
bun start

# Build for production
bun run build

# Run linting
bun run lint

# Format code
bun run fmt

# Generate GraphQL documentation
bun run docs:graphql

# Preview production build
bun run preview
```

## 📁 Key Files

- `bd-sirme.sql` - Complete database schema
- `src/components/pages/HomePage.tsx` - Main dashboard
- `src/graphql/hooks/` - GraphQL data fetching hooks
- `tailwind.config.js` - UI styling configuration
- `vite.config.ts` - Build and development configuration

## 🤝 Contributing

1. Follow the **atomic design** principles for components
2. Write **clean, documented code** with helpful comments
3. Use **TypeScript** for type safety
4. Test features thoroughly before submission
5. Keep files **small and focused** (<200 lines)
6. Follow the **GraphQL + Qwik** best practices outlined in cursor rules

## 📝 License

This project is private and proprietary.

---

**SIRME** - Making employee time tracking simple, fast, and efficient. ⚡️

## Vercel Edge

This starter site is configured to deploy to [Vercel Edge Functions](https://vercel.com/docs/concepts/functions/edge-functions), which means it will be rendered at an edge location near to your users.

## Installation

The adaptor will add a new `vite.config.ts` within the `adapters/` directory, and a new entry file will be created, such as:

```
└── adapters/
    └── vercel-edge/
        └── vite.config.ts
└── src/
    └── entry.vercel-edge.tsx
```

Additionally, within the `package.json`, the `build.server` script will be updated with the Vercel Edge build.

## Production build

To build the application for production, use the `build` command, this command will automatically run `bun build.server` and `bun build.client`:

```shell
bun build
```

[Read the full guide here](https://github.com/QwikDev/qwik/blob/main/starters/adapters/vercel-edge/README.md)

## Dev deploy

To deploy the application for development:

```shell
bun deploy
```

Notice that you might need a [Vercel account](https://docs.Vercel.com/get-started/) in order to complete this step!

## Production deploy

The project is ready to be deployed to Vercel. However, you will need to create a git repository and push the code to it.

You can [deploy your site to Vercel](https://vercel.com/docs/concepts/deployments/overview) either via a Git provider integration or through the Vercel CLI.
