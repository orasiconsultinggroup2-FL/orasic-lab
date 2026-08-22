# 📖 Blog Automático ORASIC Lab — Guía Rápida

## ¿Qué hicimos?

Creamos un sistema donde:
1. **Publicas un artículo en Content Studio**
2. **Haces clic en "Publicar en Blog"**
3. **Se publica automáticamente en el blog del sitio web** ✨
4. **El nuevo artículo aparece GRANDE, los anteriores como ventanillas pequeñas**

---

## 📋 Pasos para Activar

### **1. Crear tabla en Supabase**

Entra a: `supabase.com/dashboard/project/somatgspsqxtpfblsjib/sql`

Copia y ejecuta este SQL (clic en **Run**):

```sql
CREATE TABLE blog_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  intro TEXT,
  body TEXT NOT NULL,
  tag TEXT,
  photoFile TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_blog_status ON blog_articles(status);
CREATE INDEX idx_blog_created ON blog_articles(created_at DESC);
```

✅ Cuando veas "Query executed" ya está lista la tabla.

---

### **2. Obtener tus credenciales Supabase**

1. En tu proyecto → haz clic en **⚙️ Settings** (abajo a la izquierda)
2. Ve a **API**
3. **Copia estas dos líneas:**
   - `Project URL` (algo como `https://somatgspsqxtpfblsjib.supabase.co`)
   - `Anon public key` (llave larga que empieza con `eyJ`)

---

### **3. Completar `.env.local`**

Abre el archivo: `ORASIC LAB/.env.local`

Reemplaza esto:
```
NEXT_PUBLIC_SUPABASE_URL=https://somatgspsqxtpfblsjib.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=PASTE_YOUR_ANON_KEY_HERE
```

Por tus credenciales reales. Ejemplo:
```
NEXT_PUBLIC_SUPABASE_URL=https://somatgspsqxtpfblsjib.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Guarda el archivo.

---

### **4. Hacer git push**

```bash
cd "C:\Users\FERNANDO\OneDrive\Documentos\ORASIC LAB"
git add .
git commit -m "Feat: Blog automático con Supabase"
git push origin main
```

Vercel desplegará automáticamente en ~2-3 minutos.

---

### **5. Probar**

1. **Abre Content Studio** → `http://localhost:5050/content-studio/`
2. **Crea un artículo** en la sección "Blog"
3. **Haz clic en "Publicar en Blog"**
4. Verás el toast verde: ✅ "Publicado en el blog automáticamente"
5. **Ve al blog:** `https://orasic-lab.vercel.app/blog.html`
6. ¡Tu artículo aparecerá GRANDE al inicio! 🎉

---

## 🎯 Cómo se ve

- **Artículo nuevo (hoy)**: GRANDE, con foto grande, texto completo
- **Artículos anteriores**: Ventanillas pequeñas en una galería abajo

---

## ⚠️ Importante

- El archivo `.env.local` **NO se pushea a GitHub** (está en `.gitignore`)
- Las credenciales son **seguras** porque usan `NEXT_PUBLIC_SUPABASE_ANON_KEY` (clave pública para leer/escribir público, no privado)
- Cada vez que publiques desde Content Studio, se sincroniza automáticamente

---

## 🆘 Si algo falla

1. **"Error de sincronización"** → Verifica que `.env.local` esté correcto
2. **"No hay artículos"** → Asegúrate de crear la tabla SQL
3. **Blog sigue viejo** → Espera 2 minutos a que Vercel despliegue

¿Preguntas? Avísame en el chat. 👋
