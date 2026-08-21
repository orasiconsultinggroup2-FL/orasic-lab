# ORASIC Content Studio — Ramas de trabajo

## 📌 `main` — Trabajo diario (localhost)

**Ubicación:** `http://localhost:5050/content-studio/`

**Características:**
- ✅ Tour deshabilitado (trabajo tranquilo, sin molestias)
- ✅ Acceso a `articulos.json` real (tus datos privados)
- ✅ Datos completos: 18 pares de artículos
- ✅ Base para tu publicación real

**Cómo usar:**
```bash
# En content-studio/
node server.js

# En navegador:
http://localhost:5050/content-studio/
```

**Nota:** El tour NO se abre en localhost. Tu trabajo es privado y sin distracciones.

---

## 🎪 `demo/content-studio` — Demo para clientes (Vercel)

**Ubicación:** `https://content-studio-demo.vercel.app` (cuando esté deployado)

**Características:**
- ✅ Tour automático (18 pasos completos)
- ✅ Datos ficticios (5 artículos de ejemplo)
- ✅ Muestra capacidades sin exponer datos reales
- ✅ Profesional y listo para mostrar a clientes

**Contenido de demo:**
```
articulos-demo.json
├── 5 artículos de ejemplo
├── Cubre Blog y LinkedIn
└── Demuestra todas las funcionalidades
```

**Cómo ver la demo localmente:**
```bash
git checkout demo/content-studio
node server.js
http://localhost:5050/content-studio/
# Tour se abre automáticamente (es "Vercel localhost")
```

---

## 🔄 Flujo de trabajo

### Día a día (main → localhost)
1. Entra a `localhost:5050/content-studio/`
2. Tu tour está deshabilitado
3. Trabaja con artículos reales
4. Publica cuando esté listo

### Mostrar a clientes (demo/content-studio → Vercel)
1. Rama `demo/content-studio` deployada en Vercel
2. Cliente abre el link público
3. Tour automático se abre (18 pasos)
4. Datos ficticios, no expone lo tuyo
5. Profesional, sin secrets

---

## 📋 Diferencias entre ramas

| Aspecto | `main` (localhost) | `demo/content-studio` (Vercel) |
|--------|-------------------|-------------------------------|
| **Datos** | `articulos.json` (reales) | `articulos-demo.json` (ficticios) |
| **Tour** | ❌ Deshabilitado | ✅ Automático |
| **Público** | Privado (local) | Público (Vercel URL) |
| **Usar para** | Trabajo real, publicación | Demostración, prospectos |

---

## 🚀 Próximos pasos

1. **Deploy demo a Vercel** (en Vercel settings):
   - Conectar rama `demo/content-studio`
   - Auto-deploy en cada push
   - URL: `https://content-studio-demo.vercel.app`

2. **Mantener sincronizado**:
   - Cambios en main → merge selectivo a demo
   - Demo siempre lista con datos ficticios

3. **Usar en pitch**:
   - Abre demo URL
   - Tour automático vende la visión
   - Cliente ve capacidades reales

---

## 💡 Notas

- **tour-content-studio.js** detecta automáticamente:
  - `localhost` → tour deshabilitado
  - `vercel.app` → tour automático
  
- **localStorage** está aislado por dominio:
  - Cada cliente que abre demo ve tour como "primera vez"
  - Tu localhost jamás ve el tour

- **Datos permanecen seguros**:
  - `main` = tu trabajo real, privado
  - `demo` = datos ficticios, público

