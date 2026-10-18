import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Serve static assets directory directly
  app.use('/assets', express.static(path.join(process.cwd(), 'public/assets')));
  app.use('/assets', express.static(path.join(process.cwd(), 'assets')));
  app.use(express.static(path.join(process.cwd(), 'public')));

  app.get('/sitemap.xml', (_req, res) => {
    const sitemapPath = fs.existsSync(path.join(process.cwd(), 'public/sitemap.xml'))
      ? path.join(process.cwd(), 'public/sitemap.xml')
      : path.join(process.cwd(), 'sitemap.xml');
    res.setHeader('Content-Type', 'application/xml');
    res.sendFile(sitemapPath);
  });

  app.get('/robots.txt', (_req, res) => {
    const robotsPath = fs.existsSync(path.join(process.cwd(), 'public/robots.txt'))
      ? path.join(process.cwd(), 'public/robots.txt')
      : path.join(process.cwd(), 'robots.txt');
    res.setHeader('Content-Type', 'text/plain');
    res.sendFile(robotsPath);
  });

  // API contact endpoint demonstration
  app.post('/api/contact', (req, res) => {
    const { name, email, service, message } = req.body || {};
    console.log('Contact submission received:', { name, email, service, message });
    res.json({
      success: true,
      message: `Thank you, ${name || 'client'}! Your message regarding "${service || 'Web Development'}" has been received. Samra will get back to you shortly.`
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'mpa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      const requestedFile = path.join(distPath, req.path);
      if (fs.existsSync(requestedFile) && fs.statSync(requestedFile).isFile()) {
        res.sendFile(requestedFile);
      } else {
        res.sendFile(path.join(distPath, 'index.html'));
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
