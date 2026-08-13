import fs from 'node:fs';
import path from 'node:path';

// Lector minimo de .env — sin dependencias. Las variables reales del sistema
// (process.env) siempre ganan sobre el archivo.
export function loadEnv(rootDir) {
  const file = path.join(rootDir, '.env');
  if (!fs.existsSync(file)) return;
  const raw = fs.readFileSync(file, 'utf8');
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

export function requireKey(name, comoObtenerla) {
  const value = process.env[name];
  if (!value) {
    const err = new Error(`Falta ${name}. ${comoObtenerla}`);
    err.statusCode = 400;
    err.code = 'MISSING_KEY';
    throw err;
  }
  return value;
}
