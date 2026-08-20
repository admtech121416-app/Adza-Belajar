import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

const DB_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// --- Database Schema & Init ---
interface AppData {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  icon: string;
  active: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface CategoryData {
  id: string;
  name: string;
  order: number;
}

interface SettingsData {
  appName: string;
  heroTitle: string;
  heroSubtitle: string;
  logoUrl: string;
  faviconUrl: string;
}

interface Database {
  apps: AppData[];
  categories: CategoryData[];
  settings: SettingsData;
}

const defaultDb: Database = {
  apps: [
    {
      id: '1',
      name: 'IPA DIGI',
      description: 'Media pembelajaran IPA interaktif',
      url: 'https://example.com',
      category: 'IPA',
      icon: 'https://cdn.iconscout.com/icon/free/png-256/free-science-2038753-1721526.png',
      active: true,
      order: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Adza Asesmen',
      description: 'Platform ujian dan asesmen siswa',
      url: 'https://example.com',
      category: 'Asesmen',
      icon: 'https://cdn.iconscout.com/icon/free/png-256/free-exam-1915783-1620317.png',
      active: true,
      order: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  categories: [
    { id: '1', name: 'Semua', order: 1 },
    { id: '2', name: 'Pembelajaran', order: 2 },
    { id: '3', name: 'Asesmen', order: 3 },
    { id: '4', name: 'IPA', order: 4 },
    { id: '5', name: 'Literasi', order: 5 },
    { id: '6', name: 'Numerasi', order: 6 }
  ],
  settings: {
    appName: 'Adza Belajar',
    heroTitle: 'Belajar Lebih Mudah',
    heroSubtitle: 'Belajar lebih mudah, seru, dan terhubung dalam satu tempat.',
    logoUrl: 'https://cdn.pixabay.com/photo/2014/04/03/10/01/book-309530_1280.png',
    faviconUrl: ''
  }
};

async function initDb() {
  try {
    await fs.mkdir(DB_DIR, { recursive: true });
    try {
      await fs.access(DB_FILE);
    } catch {
      await fs.writeFile(DB_FILE, JSON.stringify(defaultDb, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Failed to initialize database:', err);
  }
}

async function readDb(): Promise<Database> {
  const data = await fs.readFile(DB_FILE, 'utf-8');
  return JSON.parse(data);
}

async function writeDb(db: Database) {
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
}

// --- Auth Middleware ---
const ADMIN_TOKEN = 'admin-secret-token-123';
const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token === ADMIN_TOKEN) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// --- API Routes ---
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === '234567' && password === 'admin') {
    res.json({ token: ADMIN_TOKEN });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Settings
app.get('/api/settings', async (req, res) => {
  const db = await readDb();
  res.json(db.settings);
});

app.post('/api/settings', authMiddleware, async (req, res) => {
  const db = await readDb();
  db.settings = { ...db.settings, ...req.body };
  await writeDb(db);
  res.json(db.settings);
});

// Categories
app.get('/api/categories', async (req, res) => {
  const db = await readDb();
  res.json(db.categories);
});

app.post('/api/categories', authMiddleware, async (req, res) => {
  const db = await readDb();
  const newCat = {
    id: crypto.randomUUID(),
    name: req.body.name,
    order: req.body.order || db.categories.length + 1
  };
  db.categories.push(newCat);
  await writeDb(db);
  res.json(newCat);
});

app.put('/api/categories/:id', authMiddleware, async (req, res) => {
  const db = await readDb();
  const idx = db.categories.findIndex(c => c.id === req.params.id);
  if (idx !== -1) {
    db.categories[idx] = { ...db.categories[idx], ...req.body };
    await writeDb(db);
    res.json(db.categories[idx]);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

app.delete('/api/categories/:id', authMiddleware, async (req, res) => {
  const db = await readDb();
  db.categories = db.categories.filter(c => c.id !== req.params.id);
  await writeDb(db);
  res.json({ success: true });
});

// Apps
app.get('/api/apps', async (req, res) => {
  const db = await readDb();
  // Filter active apps if not admin
  const token = req.headers.authorization?.split(' ')[1];
  if (token === ADMIN_TOKEN) {
    res.json(db.apps);
  } else {
    res.json(db.apps.filter(a => a.active));
  }
});

app.post('/api/apps', authMiddleware, async (req, res) => {
  const db = await readDb();
  const newApp: AppData = {
    ...req.body,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.apps.push(newApp);
  await writeDb(db);
  res.json(newApp);
});

app.put('/api/apps/:id', authMiddleware, async (req, res) => {
  const db = await readDb();
  const idx = db.apps.findIndex(a => a.id === req.params.id);
  if (idx !== -1) {
    db.apps[idx] = { 
      ...db.apps[idx], 
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    await writeDb(db);
    res.json(db.apps[idx]);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

app.delete('/api/apps/:id', authMiddleware, async (req, res) => {
  const db = await readDb();
  db.apps = db.apps.filter(a => a.id !== req.params.id);
  await writeDb(db);
  res.json({ success: true });
});

app.get('/api/stats', authMiddleware, async (req, res) => {
  const db = await readDb();
  res.json({
    totalApps: db.apps.length,
    activeApps: db.apps.filter(a => a.active).length,
    inactiveApps: db.apps.filter(a => !a.active).length,
    totalCategories: db.categories.length
  });
});

async function startServer() {
  await initDb();

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
