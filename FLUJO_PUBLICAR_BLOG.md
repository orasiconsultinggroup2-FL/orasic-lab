# 📋 FLUJO: Publicar un Artículo en el Blog

**Este es el flujo definitivo. Funciona, es simple y directo.**

---

## **PASO 1: Content Studio**

1. Abre: `http://localhost:5050/content-studio/`
2. Ve a la sección **BLOG**
3. **Crea un artículo:**
   - Título ✓
   - Intro (resumen) ✓
   - Body (contenido completo) ✓
   - Tag (opcional) ✓
   - Foto (opcional, con `fotos-articulos/`) ✓
4. Haz clic en **"✓ Marcar publicado"** (botón en la tabla)

---

## **PASO 2: Descargar el JSON**

En Content Studio:
1. Ve a **BANCO DE CONTENIDO** (pestaña con los artículos descargados)
2. Haz clic en **"DESCARGAR"** (abajo)
3. Se descarga: `articulos.json`

---

## **PASO 3: Meter el JSON en GitHub**

**Opción A: Desde Windows Explorer** (más fácil)
1. Abre: `C:\Users\FERNANDO\OneDrive\Documentos\ORASIC LAB`
2. Ve a Descargas y copia el `articulos.json` descargado
3. **Reemplaza** el que está en `ORASIC LAB/articulos.json` (sobrescribe)

**Opción B: Terminal**
```bash
copy C:\Users\FERNANDO\Downloads\articulos.json "C:\Users\FERNANDO\OneDrive\Documentos\ORASIC LAB\articulos.json"
```

---

## **PASO 4: Git Push**

```bash
cd "C:\Users\FERNANDO\OneDrive\Documentos\ORASIC LAB"
git add articulos.json
git commit -m "Publish: [Título de tu artículo]"
git push origin main
```

---

## **PASO 5: Verificar**

1. Espera **2-3 minutos** (Vercel despliega automáticamente)
2. Ve a: `https://orasic-lab.vercel.app/blog.html`
3. **Tu artículo debe aparecer GRANDE al inicio**

---

## **Estructura esperada en blog.html:**

```
┌─────────────────────────────────┐
│     ARTÍCULO NUEVO (GRANDE)     │  ← Tu último artículo publicado
│  - Foto grande                  │
│  - Texto completo               │
└─────────────────────────────────┘

┌─────────┐  ┌─────────┐  ┌─────────┐
│ Anterior│  │ Anterior│  │ Anterior│  ← Artículos anteriores
│ (pequeño)  │ (pequeño)  │ (pequeño)
└─────────┘  └─────────┘  └─────────┘
```

---

## **Checklist cada vez:**

- [ ] Articulo creado en Content Studio
- [ ] Marcado como "Publicado"
- [ ] JSON descargado
- [ ] JSON copiado a `ORASIC LAB/articulos.json`
- [ ] `git add articulos.json`
- [ ] `git commit -m "..."`
- [ ] `git push`
- [ ] Esperar 2-3 min
- [ ] Verificar en orasic-lab.vercel.app/blog.html

---

## **Si algo no funciona:**

**Problema: No aparece el artículo**
- Solución 1: Recarga la página (Ctrl+F5)
- Solución 2: Espera 5 min más (Vercel se demora a veces)
- Solución 3: Verifica que el JSON esté en la carpeta correcta

**Problema: No puedo descargar el JSON**
- Solución: Copia manualmente de Content Studio

**Problema: Git push falla**
- Solución: Abre la terminal en la carpeta ORASIC LAB

---

**¡Listo! Usa este flujo siempre. Funciona.** ✅
