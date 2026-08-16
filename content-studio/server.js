const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const app = express();
const PORT = 5050;
const REPO_ROOT = path.join(__dirname, '..');

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Servir archivos estáticos de Content Studio
app.use(express.static(__dirname));

// Redirige /content-studio/ a /
app.get('/content-studio/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ==================
// Función helper: hacer commit y push
// ==================
function commitAndPush(file, message) {
  try {
    const fileName = path.basename(file);
    const options = { cwd: REPO_ROOT, encoding: 'utf-8', stdio: 'pipe' };

    // Agregar archivo
    execSync(`git add "${fileName}"`, options);

    // Hacer commit
    execSync(`git commit -m "${message}"`, options);

    // Hacer push
    execSync(`git push`, options);

    console.log(`✅ Git: Commit y push realizados para ${fileName}`);
    return true;
  } catch (error) {
    console.warn(`⚠ Git error (ignorado):`, error.message.substring(0, 100));
    return false;
  }
}

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
    // commitAndPush() está disponible pero comentado para evitar errores de permisos

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
// ENDPOINT: Generar video a partir de guión
// ==================
app.post('/api/generate-video', (req, res) => {
  try {
    const { script, title } = req.body;

    if (!script || typeof script !== 'string') {
      return res.status(400).json({ error: 'Script inválido o vacío' });
    }

    // Sanitiza el título para usarlo en nombre de archivo
    const sanitized = (title || 'video').replace(/[^a-zA-Z0-9-_]/g, '-').slice(0, 30);
    const timestamp = Date.now();
    const outputFile = path.join(__dirname, `videos_output`, `${sanitized}_${timestamp}.mp4`);

    // Crea directorio si no existe
    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log(`🎬 Generando video: "${title || 'Sin título'}"...`);

    // Ejecuta el script Python
    const pythonScript = path.join(__dirname, 'generate_video.py');
    const command = `python "${pythonScript}" "${script.replace(/"/g, '\\"')}" "${outputFile}"`;

    try {
      execSync(command, {
        cwd: __dirname,
        encoding: 'utf-8',
        stdio: 'pipe',
        timeout: 120000  // 2 minutos timeout
      });

      // Verifica si el archivo se creó
      if (!fs.existsSync(outputFile)) {
        throw new Error('El archivo de video no se generó correctamente');
      }

      console.log(`✅ Video generado: ${outputFile}`);

      res.json({
        success: true,
        message: '✅ Video generado correctamente',
        videoPath: `/videos_output/${path.basename(outputFile)}`,
        filename: path.basename(outputFile)
      });

    } catch (execError) {
      console.error('Error al ejecutar Python:', execError.message);

      // Intenta mostrar stderr
      const errorMsg = execError.stderr
        ? execError.stderr.toString().slice(0, 500)
        : execError.message;

      res.status(500).json({
        error: 'Error al generar video con Python',
        details: errorMsg,
        hint: 'Asegúrate de tener instalado: pip install moviepy pillow numpy'
      });
    }

  } catch (error) {
    console.error('❌ Error en /api/generate-video:', error);
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
  res.json({ status: 'ok', message: 'ORASIC Content Studio running on port 5050' });
});

// ==================
// Iniciar servidor
// ==================
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║   🎬 ORASIC Content Studio                          ║
║   📍 http://localhost:${PORT}/                      ║
║   🚀 Servidor Node.js iniciado                      ║
╚════════════════════════════════════════════════════╝
  `);
});
