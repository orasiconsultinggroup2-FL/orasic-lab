/* Inyecta el motor del tour + los pasos de una app dentro de su index.html.
   Idempotente: si ya estaba inyectado, lo reemplaza en vez de duplicarlo.

   Uso:  node shared/inyectar-tour.js <ruta-index.html> <ruta-pasos.js>
*/
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const INICIO = '<!-- ORASIC TOUR: INICIO (generado por shared/inyectar-tour.js) -->';
const FIN = '<!-- ORASIC TOUR: FIN -->';

const [rutaHtml, rutaPasos] = process.argv.slice(2);
if (!rutaHtml || !rutaPasos) {
  console.error('Uso: node shared/inyectar-tour.js <index.html> <pasos.js>');
  process.exit(1);
}

const motor = fs.readFileSync(path.join(AQUI, 'orasic-tour.js'), 'utf8');
const pasos = fs.readFileSync(rutaPasos, 'utf8');
let html = fs.readFileSync(rutaHtml, 'utf8');

// Nada de lo que inyectamos puede contener </script> literal, o cortaria el bloque.
for (const [nombre, src] of [['motor', motor], ['pasos', pasos]]) {
  if (src.includes('</script>')) {
    console.error(`El archivo de ${nombre} contiene </script> literal; no se puede inyectar.`);
    process.exit(1);
  }
}

const bloque = `${INICIO}
<script>
${motor}
</script>
<script>
${pasos}
</script>
${FIN}`;

const yaEstaba = html.includes(INICIO);
if (yaEstaba) {
  const desde = html.indexOf(INICIO);
  const hasta = html.indexOf(FIN) + FIN.length;
  html = html.slice(0, desde) + bloque + html.slice(hasta);
} else {
  const cierre = html.lastIndexOf('</body>');
  if (cierre === -1) {
    console.error('No se encontro </body> en el HTML.');
    process.exit(1);
  }
  html = html.slice(0, cierre) + bloque + '\n' + html.slice(cierre);
}

fs.writeFileSync(rutaHtml, html, 'utf8');
console.log(`${yaEstaba ? 'Actualizado' : 'Inyectado'} el tour en ${rutaHtml}`);
