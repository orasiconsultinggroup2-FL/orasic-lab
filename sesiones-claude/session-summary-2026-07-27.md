# Resumen de Sesión - 2026-07-27

## Qué Hicimos
- Revisamos el landing de ORASIC Lab (orasic-lab.vercel.app) con capturas reales del sitio en desktop.
- Reordenamos el portafolio (array `RUBROS` en `index.html`) para que las categorías pyme (Belleza, Salud, Retail y Moda, Deporte, Comunidad, Ventas B2B, Marketing y Contenido, Educación, Productividad) aparezcan antes que las institucionales/consultoría (Liderazgo y Coaching, Institucional y Corporativo, Minería y Conflictos Sociales), alineando la primera impresión con el pitch de "reservas y WhatsApp para negocios reales".
- Configuramos control de versiones desde cero: creamos el repo GitHub `orasiconsultinggroup2-FL/orasic-lab`, hicimos el primer push, y lo conectamos a Vercel (Settings → Git) para auto-deploy en cada push a `main`. Se probó con un commit vacío y quedó confirmado end-to-end.
- Arreglamos el menú mobile: antes desaparecía por completo en pantallas chicas (incluido el botón de cotizar) sin forma de abrirlo. Se agregó botón hamburguesa + panel desplegable con JS.
- Unificamos el tema visual: eliminamos los bloques blancos que cortaban en seco contra el resto del sitio oscuro (secciones Problema, Servicios, Proceso), convirtiéndolos a la misma paleta dark del resto del sitio.
- Tras feedback del usuario ("todo es negro"), corregimos el exceso de planitud agregando glows sutiles (violeta/cyan, mismo estilo que el hero) y líneas separadoras con degradado entre secciones, para recuperar profundidad visual sin volver al blanco.
- Agregamos línea conectora entre los 4 pasos numerados de la sección "Proceso".
- Unificamos el color de las etiquetas kicker (violeta → cyan-400) en todas las secciones para consistencia de marca.

## Decisiones Tomadas
- No inventar testimonios de clientes — el usuario no los tiene aún reales, y pidió explícitamente no inventarlos. Queda como pendiente hasta que existan.
- Priorizar Belleza y Salud como primeras categorías visibles del portafolio porque sus descripciones citan casi textualmente el pitch del hero ("reservas", "WhatsApp").
- Usar tema 100% oscuro en todo el sitio en vez de alternar con secciones blancas, por cohesión visual y porque calza mejor con el posicionamiento de agencia de software/IA.

## Aprendizajes Clave
- El proyecto vive en una carpeta sincronizada por OneDrive. Git funciona bien desde la PowerShell real del usuario, pero el sandbox de Cowork no puede completar operaciones de escritura/borrado de git sobre esa carpeta montada (falla al borrar archivos de bloqueo internos de git) — cualquier `git init`/commit/push debe correrlo el usuario en su propia terminal.
- Conectar un repo existente a Vercel no dispara un deploy retroactivo del último push ya hecho; solo activa auto-deploy para pushes futuros.
- El sitio no tiene testimonios reales todavía — es la brecha de prueba social más importante pendiente, dado que el hero afirma "+100 apps construidas".
- El puente NotebookLM Brain (skill `wrapup`) requiere el CLI `notebooklm-py` con login OAuth interactivo y un directorio `~/.claude/` persistente. El sandbox de Cowork es efímero (se limpia entre sesiones) y no soporta logins interactivos, así que esta skill no se puede completar end-to-end desde Cowork tal como está — el puente real hay que armarlo desde Claude Code CLI en la máquina del usuario.

## Hilos Abiertos
- Confirmar visualmente que el botón hamburguesa del menú mobile se ve y funciona en un celular real o ventana angosta (no se pudo verificar automáticamente por limitación de la herramienta de captura).
- Conseguir 3-4 testimonios reales con nombre y rubro de clientes de ORASIC Lab para sumar prueba social a la landing.
- Si el usuario quiere memoria persistente real entre Chat/Cowork/Code: instalar y autenticar `notebooklm-py` desde su propia terminal (Claude Code CLI), no desde Cowork.

## Herramientas y Sistemas Utilizados
- Vercel — proyecto `orasic-lab`, org "Orasi CG's projects"
- GitHub — repo `orasiconsultinggroup2-FL/orasic-lab`
- Chrome (extensión Claude in Chrome) para verificación visual del sitio en producción
- PowerShell / Git en la PC del usuario (Windows, carpeta OneDrive)
