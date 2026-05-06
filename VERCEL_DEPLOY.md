# Deploy Word Finder Tracking to Vercel

## 🚀 Quick Deploy

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy from the web folder:**
```bash
cd web
vercel
```

4. **Follow the prompts:**
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? **wordfinder-tracking** (or your choice)
   - In which directory is your code located? **./**
   - Want to override settings? **N**

5. **Your app is now live!** Copy the URL (e.g., `https://wordfinder-tracking.vercel.app`)

### Option 2: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your Git repository (or upload the `web` folder)
4. Configure:
   - **Framework Preset:** Other
   - **Root Directory:** `web` (if deploying from repo root)
   - **Build Command:** Leave empty
   - **Output Directory:** Leave empty
5. Click "Deploy"

## 📝 After Deployment

### 1. Update config.ini

Copy your Vercel URL and update `config.ini`:

```ini
[Settings]
SerialKey=WF-XXXX-XXXX-XXXX-XXXX
ApiUrl=https://your-app-name.vercel.app
TrackingInterval=5
```

### 2. Update script.js

Edit `web/script.js` and change the API_URL:

```javascript
const API_URL = 'https://your-app-name.vercel.app/api';
```

### 3. Test the API

Visit these URLs to test:
- Dashboard: `https://your-app-name.vercel.app`
- API Stats: `https://your-app-name.vercel.app/api/stats`

## 🗄️ Database Setup

Vercel's serverless functions are stateless, so the JSON file won't persist. You need a real database:

### Option A: Vercel KV (Redis)

1. Go to your Vercel project dashboard
2. Click "Storage" → "Create Database" → "KV"
3. Update `server.js` to use Vercel KV instead of JSON file

### Option B: MongoDB Atlas (Free)

1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Add to Vercel environment variables:
   - Key: `MONGODB_URI`
   - Value: Your connection string
5. Update `server.js` to use MongoDB

### Option C: Supabase (Free PostgreSQL)

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Get connection details
4. Add to Vercel environment variables
5. Update `server.js` to use PostgreSQL

## 🔧 Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```
NODE_ENV=production
DATABASE_URL=your_database_url_here
```

## 📊 Example: MongoDB Integration

Update `web/api/server.js`:

```javascript
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI);
let db;

async function connectDB() {
    if (!db) {
        await client.connect();
        db = client.db('wordfinder');
    }
    return db;
}

// Update your routes to use MongoDB
app.post('/api/track', async (req, res) => {
    const db = await connectDB();
    const users = db.collection('users');
    
    // Your tracking logic here
    await users.insertOne({
        serial: req.body.serial,
        ip: req.headers['x-forwarded-for'],
        timestamp: new Date()
    });
    
    res.json({ success: true });
});
```

## 🔒 CORS Configuration

If you get CORS errors, update `server.js`:

```javascript
app.use(cors({
    origin: '*', // Or specify your domain
    methods: ['GET', 'POST'],
    credentials: true
}));
```

## 🐛 Troubleshooting

### API not working?
- Check Vercel function logs in dashboard
- Verify `vercel.json` is configured correctly
- Make sure API routes start with `/api/`

### Database not persisting?
- JSON files don't work on Vercel serverless
- Use a real database (MongoDB, PostgreSQL, etc.)

### CORS errors?
- Update CORS settings in `server.js`
- Check if API URL is correct in `config.ini`

## 📱 Custom Domain (Optional)

1. Go to Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `config.ini` with your custom domain

## 🎯 Production Checklist

- [ ] Deploy to Vercel
- [ ] Set up real database (MongoDB/PostgreSQL)
- [ ] Add environment variables
- [ ] Update `config.ini` with production URL
- [ ] Test serial validation
- [ ] Test tracking functionality
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Set up custom domain (optional)

## 💡 Tips

- Vercel has a free tier with generous limits
- Use environment variables for sensitive data
- Monitor usage in Vercel dashboard
- Set up alerts for errors
- Use Vercel Analytics for insights

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Supabase](https://supabase.com)

---

Made by Noah (@0x6e6f6168)
