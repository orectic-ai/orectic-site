# Orectic.ai — Marketing Site

Intelligence Extraction Platform. Built with Vite + React. Deployed on Vercel.

## Local Development

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`

## Deploy to Vercel

### First time setup:

1. Push this repo to your GitHub (the orectic org or your personal account)
2. Go to vercel.com/new
3. Click "Import Git Repository" and select this repo
4. Vercel auto-detects Vite — just click "Deploy"
5. It builds and gives you a .vercel.app URL in ~60 seconds

### Connect orectic.ai domain:

1. In Vercel dashboard → your project → Settings → Domains
2. Add orectic.ai and www.orectic.ai
3. Vercel will show you DNS records to add
4. Go to GoDaddy → DNS Management for orectic.ai
5. Either:
   - **Option A (recommended):** Change nameservers to Vercel's (they tell you which ones)
   - **Option B:** Add the CNAME/A records Vercel shows you
6. Wait 5-30 minutes for DNS propagation
7. Vercel auto-provisions SSL

### After setup:

Every push to main auto-deploys. No manual steps.

## Updating Content

All content is in src/App.jsx. Search for the text you want to change and edit directly. Push to main and it auto-deploys.

## Important: Update Your Calendly Link

Search for calendly.com in App.jsx and replace with your actual Calendly booking URL.

---

Built Feb 2026 · Orectic · orectic.ai
