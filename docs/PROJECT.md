## 🎯 Project Goal

Allow each user to sign up and have a unique subdomain (`username.example.com`) which displays their profile page, all self-hosted, built on Next.js + TypeScript, backed by SQLite + Drizzle ORM.

---

## 🗂 Project Plan

### Phase 0: Preparation

**Tasks:**

* Create a new Next.js (TS) project: `npx create-next-app@latest --typescript` ( Completed).
* Install dependencies: Drizzle ORM + SQLite driver (e.g., `better-sqlite3` or similar) per docs. ([Drizzle ORM][1])
* Configure folder structure: `/src/db`, `/src/db/schema`, `/src/lib` etc.
* Setup environment variables (e.g., `DATABASE_URL`, `ROOT_DOMAIN=example.com`, etc).
* Setup a wildcard DNS + local host testing trick (you may use `*.localhost`, or map hosts file for local test `username.localhost` etc) and configure local reverse-proxy or using `vercel dev` / `next dev` with custom host header.

**Deliverable:** Working Next.js app with database connection ready, Drizzle configured.

---

### Phase 1: Database Schema & ORM Setup

**Tasks:**

* Define user table schema in Drizzle. Example fields: `id`, `username` (unique, string), `displayName`, `bio`, `createdAt`, `updatedAt`.
  Use Drizzle’s SQLite core/driver approach for SQLite. ([Drizzle ORM][1])
* Create `drizzle.config.ts` pointing to schema files and migrations/out directory (if you plan schema migrations).
* Setup `lib/db.ts` (or equivalent) to initialize Drizzle with SQLite driver.
* Write simple CRUD for users: insert new user, query by username.

**Deliverable:** Database ready, schema defined, ability to create and fetch user by username works.

---

### Phase 2: Subdomain Handling & Routing

**Tasks:**

* In Next.js middleware (`middleware.ts` if using App Router) or custom server logic, inspect the `Host` header to detect subdomain part. Example: if host is `charles.example.com`, extract `charles`.
* Define logic: if subdomain ≠ root domain (e.g., not `www` or `example.com` itself), then route/rew­rite the request to an internal Next.js route (e.g., `/profile/[username]`).
* Create the Next.js route `/pages/profile/[username].tsx` or in App Router `/app/profile/[username]/page.tsx` that accepts `username` param and loads the user via Drizzle.
* Handle not-found user: show 404 or “profile not found”.
* Ensure root domain (`example.com`) still serves main landing/redirect.

**Deliverable:** Visiting `username.localhost` (or `username.example.com`) renders the correct user profile or error.

---

### Phase 3: Profile Creation & UI

**Tasks:**

* Build signup page: user enters `username`, `displayName`, `bio`. Validate `username` uniqueness in DB.
* Once created, store user record and redirect to their subdomain URL (e.g., `https://username.example.com`).
* Build profile UI: display `displayName`, `bio`, maybe avatar placeholder.
* Consider basic styling (could use Tailwind CSS).
* Add link from profile to main domain, navigation etc.

**Deliverable:** Users can sign up and immediately access their profile at their subdomain.

---

### Phase 4: Hosting & Reverse Proxy Setup

**Tasks:**

* On your self-hosted server (e.g., your DigitalOcean droplet), set up NGINX (or Caddy) to accept wildcard subdomains (`*.example.com`) and forward traffic to your Next.js app. Example NGINX config with `server_name .example.com;`.
* Configure SSL with wildcard certificate (`*.example.com`) using Let’s Encrypt DNS-challenge or another method.
* Ensure environment variable `ROOT_DOMAIN` is set correctly for subdomain detection.
* Deploy the Next.js build (`next build`, `next start`) or use PM2/docker as you prefer.

**Deliverable:** Production environment supporting dynamic subdomains, secure SSL, user profiles accessible publicly.

---

### Phase 5: Testing & Edge Cases

**Tasks:**

* Test multiple usernames: short, long, special chars (restrict special chars in username).
* Test root domain vs subdomain conflicts (e.g., if user picks `www` or `admin`, reserve those).
* Test deep link: what happens with `www.example.com`, `api.example.com` etc.
* Test caching, header forwarding (`X-Forwarded-Host`, `Host`) to ensure correct subdomain passed.
* Test fallback: if user doesn’t exist, show friendly message.
* Optional: add error logging.

**Deliverable:** Verified application working for many cases; documented list of reserved usernames, subdomain rules.

---

### Phase 6: Optional Enhancements 

**Ideas:**

* Add avatar/image upload for profile (store locally or with S3/min.io).
* Add theme or layout customization per user (store in DB).
* Add custom sub-routes per user: e.g., `username.example.com/blog`, `username.example.com/about`.
* Add caching layer or SSR optimization for user profiles.
* Add analytics: track visits to user profiles.
* Add user login & edit functionality (so that user can edit profile).
* Add tenant isolation (if you plan full tenant sites rather than just profiles).
