const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const REPO_ROOT = path.join(__dirname, '..');

// Middleware
// Sin CORS y sin body-parser urlencoded a propósito: la app es same-origin
// (servida por este mismo servidor) y solo envía JSON vía fetch. Habilitar
// CORS o form-urlencoded permitiría ataques cross-site contra los endpoints.
app.use(express.json({ limit: '5mb' }));

// Servir archivos estáticos: primero desde la raíz del proyecto (para orasic-tour.js, etc)
// luego desde content-studio/ (para articulos-datos.js, etc)
app.use(express.static(REPO_ROOT));
app.use(express.static(__dirname));

// Redirige /content-studio/ a /
app.get('/content-studio/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ==================
// ENDPOINT: Publicar artículo en Blog
// ==================
app.post('/api/publish-blog', (req, res) => {
  try {
    const article = req.body;

    if (!article || !article.id) {
      return res.status(400).json({ error: 'Artículo inválido o sin ID' });
    }

    // Ruta al archivo articulos.json (en la raíz del proyecto, no en content-studio/)
    const articlesPath = path.join(__dirname, '..', 'articulos.json');

    // Leer artículos existentes
    let articles = [];
    if (fs.existsSync(articlesPath)) {
      try {
        const raw = fs.readFileSync(articlesPath, 'utf-8');
        articles = JSON.parse(raw) || [];
      } catch (e) {
        console.warn('⚠ Error al leer articulos.json, empezando desde vacío');
        articles = [];
      }
    }

    // Buscar si el artículo ya existe (por ID)
    const existingIndex = articles.findIndex(a => a.id === article.id);

    // Preparar el artículo para guardar
    const articleToSave = {
      id: article.id,
      title: article.title,
      intro: article.intro,
      body: article.body,
      tag: article.tag || '',
      sugerencia_imagen: article.sugerencia_imagen || '',
      imageUrl: article.imageUrl || '',
      status: 'published',
      plataforma: 'Blog',
      createdAt: article.createdAt || new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      photoFile: article.photoFile || ''
    };

    // Agregar o actualizar
    if (existingIndex >= 0) {
      articles[existingIndex] = articleToSave;
    } else {
      articles.push(articleToSave);
    }

    // Guardar el archivo JSON
    fs.writeFileSync(articlesPath, JSON.stringify(articles, null, 2), 'utf-8');

    console.log(`✅ Artículo publicado: "${article.title}" (${article.id})`);

    // Nota: El commit y push se hacen manualmente después de publicar

    res.json({
      success: true,
      message: '✅ Artículo publicado en Blog',
      article: articleToSave
    });
  } catch (error) {
    console.error('❌ Error al publicar artículo:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================
// ENDPOINT: Obtener todos los artículos publicados (para debug/sync)
// ==================
app.get('/api/articles-published', (req, res) => {
  try {
    const articlesPath = path.join(__dirname, '..', 'articulos.json');

    if (!fs.existsSync(articlesPath)) {
      return res.json([]);
    }

    const raw = fs.readFileSync(articlesPath, 'utf-8');
    const articles = JSON.parse(raw) || [];
    res.json(articles);
  } catch (error) {
    console.error('Error al leer artículos:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================
// Servir videos generados
// ==================
app.use('/videos_output', express.static(path.join(__dirname, 'videos_output')));

// ==================
// Health check
// ==================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: `ORASIC Content Studio running on port ${PORT}` });
});

// ==================
// Iniciar servidor
// ==================
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║   🎬 ORASIC Content Studio                          ║
║   📍 http://localhost:${PORT}/                      ║
║   🚀 Servidor Node.js iniciado                      ║
╚════════════════════════════════════════════════════╝
  `);
});
