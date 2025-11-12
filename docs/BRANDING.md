# 🪐 NameSpace

> **Your Name. Your Space. Your Subdomain.**

---

## 🌐 Overview
**NameSpace** is a self-hosted, multi-tenant web platform built with **Next.js**, **TypeScript**, and **Drizzle ORM**.  
It allows every user to instantly claim a personalized subdomain such as:

```

[https://username.example.com](https://username.example.com)

```

Each user’s subdomain becomes their own profile space — a place to share who they are, display projects, bios, or portfolios — all under one unified application.

---

## 🚀 Vision
Make it effortless for anyone to own a unique space on the internet without technical setup.  
No DNS hassles. No manual hosting. Just choose a name, and NameSpace gives you your corner of the web instantly.

---

## ✨ Core Features
- 🌍 **Dynamic Subdomains** — every user gets a live subdomain instantly after signup.  
- ⚙️ **Self-Hosted Simplicity** — no vendor lock-in, deploy anywhere.  
- 💾 **SQLite + Drizzle ORM** — lightweight, fast, and easy to maintain.  
- 🧠 **TypeScript-first** — built with safety and scalability in mind.  
- 🧩 **Next.js Middleware Routing** — dynamic tenant resolution based on hostname.  
- 🎨 **Customizable User Profiles** — easy theming and layout configuration per user.  
- 🔒 **Secure & Efficient** — wildcard SSL with NGINX/Caddy proxy setup.  

---

## 🏗️ Tech Stack
| Layer | Technology |
|-------|-------------|
| Frontend | Next.js (App Router) + React + TailwindCSS |
| Backend | Next.js API Routes |
| ORM | Drizzle ORM |
| Database | SQLite (local dev) → PostgreSQL (optional prod) |
| Language | TypeScript |
| Deployment | Self-hosted (Docker, NGINX reverse proxy) |

---

## 🧩 Architecture Snapshot
```

[Browser]
↓
username.example.com
↓
[DNS: *.example.com → Server IP]
↓
[NGINX / Caddy Proxy]
↓
[Next.js App on :3000]
↓
[Middleware detects subdomain]
↓
[Rewrites → /u/[username]]
↓
[Fetches from Drizzle + SQLite]
↓
[Render User Profile]

```

---

## 🧠 Concept Keywords
> `multi-tenant`, `subdomain`, `identity`, `profile`, `namespace`, `personal webspace`, `Next.js`, `self-hosted`

---

## 🎯 Target Audience
- Indie developers creating personalized portfolio pages.  
- Small communities wanting user handles and profiles.  
- Open-source enthusiasts building multi-tenant SaaS prototypes.  
- Educators or students learning subdomain routing and multi-tenancy concepts.

---

## 🔮 Future Roadmap
- 🧱 Theming engine for user customization.  
- 🧑‍💼 Profile editing dashboard.  
- 📦 Multi-database support (PostgreSQL, MySQL).  
- 🔗 Integration with GitHub or external identity providers.  
- ☁️ Auto-deployment templates for DigitalOcean & Render.  

---

## ⚡ Tagline Ideas
- “Your name deserves its own space.”  
- “Claim your namespace on the web.”  
- “From signup to subdomain — instantly.”  

---

## 🪪 Author
**Ishimwe Ndungutse Charles**  
Fullstack JavaScript Developer • Open Source Contributor  
🔗 [GitHub](https://github.com/) | [LinkedIn](https://linkedin.com/)
