# NameSpace - Subdomain Profile System

A self-hosted multi-tenant application that allows users to sign up and get their own unique subdomain profile page (e.g., `username.localhost` or `username.example.com`). Built with Next.js, TypeScript, SQLite, and Drizzle ORM.

## Features

- **Unique Subdomains**: Each user gets their own subdomain for their profile
- **User Authentication**: JWT-based authentication with secure session management
- **Profile Management**: Users can customize their display name, bio, and avatar
- **Dynamic Routing**: Automatic subdomain detection and routing via Next.js middleware
- **Self-Hosted**: Designed for self-hosting with SQLite database

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: SQLite with Drizzle ORM
- **Authentication**: JWT tokens with `jose` package
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn UI
- **Validation**: Zod

## Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm/yarn
- For production: A server with NGINX and SSL certificate support

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

**Note**: `better-sqlite3` is a native module. If you encounter build errors, rebuild it:

```bash
pnpm rebuild better-sqlite3
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
DATABASE_URL=./data/sqlite.db
JWT_SECRET=your-secret-key-change-this-in-production
ROOT_DOMAIN=localhost
NODE_ENV=development
```

**Important**: Generate a strong JWT secret:

```bash
openssl rand -base64 32
```

### 3. Initialize Database

```bash
pnpm db:push
```

This will create the SQLite database and tables in the `data/` directory.

### 4. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Creating an Account

1. Visit `http://localhost:3000/signup`
2. Fill in your username, display name, email, and password
3. After signup, you'll be redirected to your subdomain profile (e.g., `http://yourusername.localhost:3000`)

### Accessing Your Profile

- **Public Profile**: Visit `http://yourusername.localhost:3000` (or your subdomain in production)
- **Dashboard**: Visit `http://localhost:3000/dashboard` to edit your profile

### Local Subdomain Testing

The application supports `*.localhost` subdomains for local development. Modern browsers automatically resolve these subdomains to `localhost`.

Example:
- Sign up with username `john`
- Access profile at `http://john.localhost:3000`

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   └── profile/       # Profile management endpoints
│   ├── dashboard/         # Protected dashboard page
│   ├── login/            # Login page
│   ├── profile/[username]/ # Dynamic profile pages
│   ├── signup/           # Signup page
│   └── page.tsx          # Landing page
├── components/
│   └── ui/               # Shadcn UI components
├── db/
│   ├── schema.ts         # Drizzle schema definitions
│   └── index.ts          # Database connection
├── lib/
│   ├── auth.ts           # JWT and password utilities
│   ├── session.ts        # Session management
│   ├── validations.ts    # Zod schemas
│   └── utils.ts          # Utility functions
└── middleware.ts         # Subdomain detection and routing
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm db:push` - Push schema changes to database
- `pnpm db:generate` - Generate migration files
- `pnpm db:migrate` - Run migrations
- `pnpm db:studio` - Open Drizzle Studio (database GUI)

## Database

The application uses SQLite with Drizzle ORM. The database file is stored at `./data/sqlite.db` (configurable via `DATABASE_URL`).

### Schema

- **users**: Stores user accounts with username, email, password (hashed), display name, bio, and avatar URL

## Authentication

- JWT tokens stored in httpOnly cookies
- Password hashing with bcryptjs
- Session management via `cookies-next`
- Protected routes check authentication status

## Deployment

For production deployment instructions, including NGINX configuration, SSL setup, and wildcard subdomain configuration, see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

For project planning and roadmap, see [docs/PROJECT.md](docs/PROJECT.md).

## Reserved Subdomains

The following subdomains are reserved and cannot be used as usernames:
- `www`
- `api`
- `admin`
- `app`
- `mail`
- `ftp`

## Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens are stored in httpOnly cookies
- Environment variables should be kept secure
- Use strong JWT secrets in production
- Database file permissions should be restricted

## License

This project is private and for personal use.
