# Deployment Guide

This guide covers deploying the subdomain profile system to a self-hosted server with NGINX, SSL, and wildcard subdomain support.

## Prerequisites

- A server with root/sudo access (e.g., DigitalOcean droplet, AWS EC2, etc.)
- A domain name with DNS access
- Node.js 18+ and pnpm installed on the server
- NGINX installed
- PM2 or Docker (optional, for process management)

## Step 1: DNS Configuration

### Wildcard DNS Record

Add a wildcard A record to your domain:

```
Type: A
Name: *
Value: YOUR_SERVER_IP
TTL: 3600
```

This allows all subdomains (`*.example.com`) to resolve to your server.

## Step 2: Environment Variables

Create a `.env.production` file on your server:

```bash
DATABASE_URL=./data/sqlite.db
JWT_SECRET=your-strong-secret-key-here-change-this
ROOT_DOMAIN=example.com
NODE_ENV=production
```

**Important:** Generate a strong JWT_SECRET using:
```bash
openssl rand -base64 32
```

## Step 3: Build and Deploy Application

1. Clone your repository on the server
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Build the application:
   ```bash
   pnpm build
   ```

4. Initialize the database:
   ```bash
   pnpm db:push
   ```

## Step 4: NGINX Configuration

Create or edit `/etc/nginx/sites-available/tenant-account`:

```nginx
server {
    listen 80;
    server_name example.com *.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/tenant-account /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 5: SSL Certificate with Let's Encrypt

### Using Certbot with DNS Challenge (for wildcard)

1. Install Certbot:
   ```bash
   sudo apt-get update
   sudo apt-get install certbot python3-certbot-nginx
   ```

2. For wildcard certificates, use DNS challenge:
   ```bash
   sudo certbot certonly --manual --preferred-challenges dns -d example.com -d *.example.com
   ```

   Follow the prompts to add DNS TXT records for verification.

3. Update NGINX config to use SSL:

```nginx
server {
    listen 80;
    server_name example.com *.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com *.example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. Reload NGINX:
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

5. Set up auto-renewal:
   ```bash
   sudo certbot renew --dry-run
   ```

## Step 6: Running the Application

### Option A: Using PM2 (Recommended)

1. Install PM2:
   ```bash
   npm install -g pm2
   ```

2. Start the application:
   ```bash
   pm2 start npm --name "tenant-account" -- start
   ```

3. Save PM2 configuration:
   ```bash
   pm2 save
   pm2 startup
   ```

### Option B: Using systemd

Create `/etc/systemd/system/tenant-account.service`:

```ini
[Unit]
Description=Tenant Account Next.js App
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/tenant-account
Environment="NODE_ENV=production"
ExecStart=/usr/bin/pnpm start
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable tenant-account
sudo systemctl start tenant-account
```

### Option C: Using Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base
RUN npm install -g pnpm

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/data ./data

EXPOSE 3000
CMD ["pnpm", "start"]
```

Build and run:
```bash
docker build -t tenant-account .
docker run -d -p 3000:3000 --env-file .env.production tenant-account
```

## Step 7: Database Backup Strategy

SQLite databases should be backed up regularly:

1. Create a backup script `/path/to/backup.sh`:
   ```bash
   #!/bin/bash
   BACKUP_DIR="/path/to/backups"
   DATE=$(date +%Y%m%d_%H%M%S)
   cp /path/to/tenant-account/data/sqlite.db "$BACKUP_DIR/sqlite_$DATE.db"
   ```

2. Add to crontab (daily backups):
   ```bash
   0 2 * * * /path/to/backup.sh
   ```

## Step 8: Monitoring and Logs

### PM2 Logs
```bash
pm2 logs tenant-account
```

### NGINX Logs
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Troubleshooting

### Subdomains not working
- Verify DNS wildcard record is set correctly
- Check NGINX configuration includes `*.example.com`
- Ensure Host header is being passed correctly

### SSL certificate issues
- Verify DNS TXT records for wildcard certificate
- Check certificate expiration: `sudo certbot certificates`
- Ensure firewall allows ports 80 and 443

### Application not starting
- Check environment variables are set correctly
- Verify database file permissions
- Check application logs for errors

## Security Considerations

1. **Firewall**: Configure UFW or iptables to only allow necessary ports
2. **JWT Secret**: Use a strong, randomly generated secret
3. **Database**: Ensure database file has proper permissions (not world-readable)
4. **Updates**: Keep Node.js, NGINX, and system packages updated
5. **Rate Limiting**: Consider adding rate limiting to prevent abuse

## Maintenance

- Regularly update dependencies: `pnpm update`
- Monitor disk space for database growth
- Set up log rotation for application and NGINX logs
- Test SSL certificate renewal process

