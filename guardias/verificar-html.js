#!/usr/bin/env node
/*
 * guardias/verificar-html.js — Verificador de sintaxis para apps ORASIC.
 *
 * Extrae los bloques <script> EMBEBIDOS (sin src) de uno o más archivos .html
 * y comprueba que su JavaScript parsea. Un solo error de sintaxis en un archivo
 * de un solo index.html deja la app entera muerta en el navegador; esto lo
 * detecta ANTES de commitear/desplegar.
 *
 * Uso:
 *   node guardias/verificar-html.js archivo1.html archivo2.html   → revisa esos
 *   node guardias/verificar-html.js                               → revisa TODOS
 *                                                                    los .html trackeados
 * Sale con código 1 si encuentra algún error (lo usa el hook pre-commit).
 *
 * Sin dependencias: usa solo módulos nativos de Node.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execSync } = require('child_process');

// --- 1) Reunir la lista de archivos a revisar ---------------------------------
let files = process.argv.slice(2);
if (files.length === 0) {
  // Sin argumentos: todos los .html versionados en el repo.
  try {
    const out = execSync('git ls-files "*.html"', { encoding: 'utf-8' });
    files = out.split(/\r?\n/).filter(Boolean);
  } catch (_) {
    console.error('No pude listar los .html con git. Pasa los archivos como argumento.');
    process.exit(2);
  }
}
// Ignorar node_modules y dependencias de terceros.
files = files.filter(f => !/(^|[\/\\])node_modules[\/\\]/.test(f));

// --- 2) Revisar cada archivo ---------------------------------------------------
let errores = 0;
let revisados = 0;

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let html;
  try { html = fs.readFileSync(file, 'utf-8'); }
  catch (e) { console.error(`⚠ No pude leer ${file}: ${e.message}`); continue; }
  revisados++;

  // Recorre cada <script ...> ... </script>
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const attrs = m[1] || '';
    const code  = m[2] || '';

    // Saltar los que cargan archivo externo (src=...) — no tienen JS embebido.
    if (/\bsrc\s*=/.test(attrs)) continue;
    // Saltar los que no son JavaScript (JSON, plantillas, etc.).
    const typeMatch = attrs.match(/\btype\s*=\s*["']?([^"'\s>]+)/i);
    if (typeMatch) {
      const t = typeMatch[1].toLowerCase();
      if (!['text/javascript', 'application/javascript', 'module', 'javascript'].includes(t)) continue;
    }
    if (!code.trim()) continue;

    // Línea donde empieza el CONTENIDO del script dentro del archivo.
    const startLine = html.slice(0, m.index + m[0].indexOf(code)).split('\n').length - 1;

    try {
      // lineOffset hace que el número de línea del error calce con el archivo real.
      new vm.Script(code, { filename: file, lineOffset: startLine });
    } catch (err) {
      errores++;
      console.error(`\n❌ ${file}`);
      console.error(`   ${err.name}: ${err.message}`);
      // La primera línea del stack trae "archivo:línea".
      const loc = (err.stack || '').split('\n').find(l => l.includes(file));
      if (loc) console.error(`   → ${loc.trim()}`);
    }
  }
}

// --- 3) Resultado --------------------------------------------------------------
if (errores > 0) {
  console.error(`\n🚫 ${errores} error(es) de sintaxis en ${revisados} archivo(s). Commit/deploy BLOQUEADO.`);
  console.error('   Corrige el/los error(es) de arriba y vuelve a intentar.\n');
  process.exit(1);
}
console.log(`✅ Sintaxis OK en ${revisados} archivo(s) HTML revisado(s).`);
process.exit(0);
