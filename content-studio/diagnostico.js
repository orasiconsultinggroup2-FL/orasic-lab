// ═══════════════════════════════════════════════════════════
// DIAGNÓSTICO Y OPTIMIZACIÓN DE CONTENIDO
// ═══════════════════════════════════════════════════════════
// Módulo que se integra en renderRendimiento() para mostrar
// análisis de rendimiento actual + recomendaciones de mejora
// (Puntos 2+3) + seguimiento de implementación

function renderDiagnostico() {
  // ESTADO ACTUAL
  const publicadas = state.items.filter(i => i.status === 'published');
  if (publicadas.length < 3) {
    return `
      <div class="card" style="border-color:rgba(251,146,60,.3);background:rgba(251,146,60,.05);">
        <div class="card-title">🔍 Diagnóstico</div>
        <div style="font-size:13px;">
          Necesitas <b>${3 - publicadas.length} video${3-publicadas.length===1?'':'s'}</b> más publicado${3-publicadas.length===1?'':'s'} para un diagnóstico confiable.
          <br/>Una vez publicados 3+, volverá aquí el análisis automático con recomendaciones de mejora.
        </div>
      </div>`;
  }

  // ANÁLISIS CON LOS PRIMEROS 3 VIDEOS PUBLICADOS
  const primeros3 = publicadas.slice(0, 3);

  // Métricas globales
  const metricas = {
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    totalShares: 0,
    avgEngagement: 0
  };

  primeros3.forEach(item => {
    ['TikTok', 'Instagram'].forEach(net => {
      const m = getMetrics(item, net);
      if (m) {
        metricas.totalViews += Number(m.views) || 0;
        metricas.totalLikes += Number(m.likes) || 0;
        metricas.totalComments += Number(m.comments) || 0;
        metricas.totalShares += Number(m.shares) || 0;
      }
    });
  });

  if (metricas.totalViews === 0) {
    return `
      <div class="card" style="border-color:rgba(251,146,60,.3);background:rgba(251,146,60,.05);">
        <div class="card-title">🔍 Diagnóstico</div>
        <div style="font-size:13px;">
          Tienes ${publicadas.length} videos publicados pero sin datos de métri cas cargados.
          <br/>Carga los números en <b>Rendimiento → Cargar semana</b> para ver el diagnóstico automático.
        </div>
      </div>`;
  }

  metricas.avgEngagement = (metricas.totalLikes + metricas.totalComments + metricas.totalShares) / (metricas.totalViews || 1) * 100;

  // PROBLEMAS DETECTADOS
  const problemas = [];
  if (metricas.avgEngagement < 1.6) {
    problemas.push({
      severity: 'alta',
      problema: 'Engagement muy bajo',
      actual: `${metricas.avgEngagement.toFixed(2)}% (meta: 3-5%)`,
      causa: 'Tus videos captan atención inicial pero no generan reacción. El hook o el mensaje no conecta con la audiencia.',
      recomendacion: 'Revisar: ¿Los primeros 3 segundos son lo suficientemente atractivos? ¿El problema es real para tu audiencia?'
    });
  }

  if (metricas.totalShares === 0) {
    problemas.push({
      severity: 'media',
      problema: 'Cero compartidos',
      actual: '0 compartidos (meta: 1-2% de vistas)',
      causa: 'El contenido no es lo suficientemente valioso como para que alguien quiera recomendarlo.',
      recomendacion: '→ PUNTO 2: Añade un CTA explícito en los últimos 3 seg: "Guarda este video", "Comparte si te identificas"'
    });
  }

  if (metricas.totalComments < metricas.totalViews * 0.005) {
    problemas.push({
      severity: 'media',
      problema: 'Pocos comentarios',
      actual: `${metricas.totalComments} comentarios (${((metricas.totalComments/metricas.totalViews)*100).toFixed(2)}%)`,
      causa: 'No hay conversación. El video no genera curiosidad o pregunta.',
      recomendacion: 'Incluir una pregunta directa en el video o en la descripción para incitar comentarios'
    });
  }

  // RECOMENDACIONES PRIORITARIAS
  const recomendaciones = [
    {
      num: 1,
      titulo: 'Mejorar hooks (primeros 3 seg)',
      urgencia: 'ALTA',
      impacto: '+15-20% engagement',
      detalles: 'El gancho debe ser más provocador, visceral, directo. Si en los primeros 3 segundos no captas atención, el 80% se va.',
      estado: state.diagState?.rec1 || false
    },
    {
      num: 2,
      titulo: '✨ PUNTO 2: Añadir CTA claro (últimos 3 seg)',
      urgencia: 'ALTA',
      impacto: '+15-25% clicks a WhatsApp',
      detalles: 'Incluir un CTA visible y directo en los últimos 3 segundos. TikTok: "Escríbenos al +51 999 039 947" / Instagram: "Link en bio".',
      estado: state.diagState?.rec2 || false
    },
    {
      num: 3,
      titulo: '⏱️ PUNTO 3: Optimizar duración',
      urgencia: 'ALTA',
      impacto: '+10-15% retention',
      detalles: 'TikTok óptimo: 28-33 seg. Instagram: 50-60 seg. Videos largos tienen caída de atención después de los 35 seg.',
      estado: state.diagState?.rec3 || false
    },
    {
      num: 4,
      titulo: 'Hashtags estratégicos',
      urgencia: 'MEDIA',
      impacto: '+20-30% alcance',
      detalles: 'Mix: 30% hashtags grandes (>500K) + 50% medianos (50K-500K) + 20% micro (<50K)',
      estado: state.diagState?.rec4 || false
    },
    {
      num: 5,
      titulo: 'Consistencia 4x/semana',
      urgencia: 'MEDIA',
      impacto: '+50% amplificación',
      detalles: 'Algoritmos favorecen cuentas activas. Publica martes, miércoles, jueves, viernes a horarios fijos.',
      estado: state.diagState?.rec5 || false
    },
    {
      num: 6,
      titulo: 'Audio/música trendy',
      urgencia: 'MEDIA',
      impacto: '+25% algoritmo boost',
      detalles: 'Usa sonidos que estén en el Trending de TikTok. Sincroniza transiciones con el beat de la música.',
      estado: state.diagState?.rec6 || false
    },
    {
      num: 7,
      titulo: 'Conexión emocional',
      urgencia: 'MEDIA',
      impacto: '+30-40% engagement',
      detalles: 'Cambiar de tono informativo a narrativo. Contar historias de "dolor real" en lugar de listar soluciones.',
      estado: state.diagState?.rec7 || false
    },
    {
      num: 8,
      titulo: 'Activar Instagram',
      urgencia: 'BAJA',
      impacto: 'Ampliar alcance',
      detalles: 'Instagram aún tiene 0 seguidores. Repite contenido 12-24h después de TikTok.',
      estado: state.diagState?.rec8 || false
    },
    {
      num: 9,
      titulo: 'Analizar video "ganador"',
      urgencia: 'BAJA',
      impacto: 'Replicar éxito',
      detalles: 'Una vez identificado el video con mejor engagement, analizar su hook, duración, tema y replicar estructura.',
      estado: state.diagState?.rec9 || false
    },
    {
      num: 10,
      titulo: 'Plan de monetización',
      urgencia: 'BAJA',
      impacto: 'Ingresos a largo plazo',
      detalles: 'Meta: 1K seguidores TikTok = monetización habilitada. Con mejoras, esto puede lograrse en 4-6 semanas.',
      estado: state.diagState?.rec10 || false
    }
  ];

  const diagnosticoHtml = `
    <div class="card" style="margin-bottom:16px;">
      <div class="card-title" style="margin-bottom:14px;">🔍 DIAGNÓSTICO AUTOMÁTICO</div>

      <div style="margin-bottom:18px;">
        <div style="font-size:12px;color:var(--text-2);margin-bottom:8px;"><b>Basado en análisis de tus primeros 3 videos publicados</b></div>
        <div class="stat-grid" style="grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px;">
          <div class="stat-card cyan">
            <div class="stat-num">${metricas.totalViews.toLocaleString('es')}</div>
            <div class="stat-label">Vistas totales</div>
          </div>
          <div class="stat-card violet">
            <div class="stat-num">${metricas.totalLikes}</div>
            <div class="stat-label">Me gusta</div>
          </div>
          <div class="stat-card orange">
            <div class="stat-num">${metricas.totalShares}</div>
            <div class="stat-label">Compartidos</div>
          </div>
          <div class="stat-card" style="border-top:2px solid ${metricas.avgEngagement >= 1.6 ? 'var(--green)' : 'var(--red)'};">
            <div class="stat-num">${metricas.avgEngagement.toFixed(2)}%</div>
            <div class="stat-label">Engagement</div>
          </div>
        </div>
      </div>

      ${problemas.length ? `
        <div style="margin-bottom:18px;">
          <div style="font-size:11px;font-weight:700;color:var(--violet);letter-spacing:.08em;text-transform:uppercase;margin-bottom:10px;">🚨 Problemas detectados</div>
          ${problemas.map((p, i) => `
            <div class="perf-row ${p.severity === 'alta' ? 'sev-alta' : 'sev-media'}" style="margin-bottom:8px;">
              <div class="perf-main">
                <div class="perf-title">${escHtml(p.problema)}</div>
                <div class="perf-meta" style="color:var(--text-2);margin-bottom:4px;">${escHtml(p.actual)}</div>
                <div style="font-size:12px;color:var(--text-2);margin-bottom:3px;"><b>Causa:</b> ${escHtml(p.causa)}</div>
                <div style="font-size:12px;color:var(--text-2);"><b>Acción:</b> ${escHtml(p.recomendacion)}</div>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <div style="margin-bottom:18px;">
        <div style="font-size:11px;font-weight:700;color:var(--cyan);letter-spacing:.08em;text-transform:uppercase;margin-bottom:12px;">💡 10 recomendaciones prioritarias</div>
        ${recomendaciones.map((r, i) => `
          <div style="display:flex;gap:12px;padding:10px;background:var(--bg-card2);border-radius:8px;margin-bottom:8px;align-items:flex-start;">
            <input type="checkbox" ${r.estado ? 'checked' : ''} onchange="updateRecState(${r.num}, this.checked)" style="margin-top:3px;accent-color:var(--violet);cursor:pointer;">
            <div style="flex:1;">
              <div style="font-size:12.5px;font-weight:600;margin-bottom:2px;">
                ${r.num}. ${escHtml(r.titulo)}
                <span style="font-size:9px;font-weight:700;text-transform:uppercase;color:${r.urgencia==='ALTA'?'var(--red)':r.urgencia==='MEDIA'?'var(--orange)':'var(--text-3)'};margin-left:8px;">${r.urgencia}</span>
                <span style="font-size:9px;color:var(--cyan);margin-left:8px;font-weight:700;">+${r.impacto}</span>
              </div>
              <div style="font-size:11.5px;color:var(--text-2);">${escHtml(r.detalles)}</div>
            </div>
          </div>
        `).join('')}
      </div>

      <div style="background:rgba(34,211,238,.08);border:1px solid rgba(34,211,238,.2);border-radius:8px;padding:12px;">
        <div style="font-size:11px;font-weight:700;color:var(--cyan);margin-bottom:6px;">📈 Proyección de mejora</div>
        <div style="font-size:12px;color:var(--text-2);line-height:1.6;">
          <b style="color:var(--text-1);">Sin cambios:</b> Engagement sigue en ${metricas.avgEngagement.toFixed(2)}%, tendencia a la baja<br/>
          <b style="color:var(--text-1);">Con recomendaciones 2+3:</b> Engagement sube a 3-4%, viabilidad media-alta<br/>
          <b style="color:var(--text-1);">Con todas las 10:</b> Engagement esperado 4-5%, canal escalando a 1K seguidores en 4-6 semanas
        </div>
      </div>
    </div>`;

  return diagnosticoHtml;
}

function updateRecState(num, checked) {
  if (!state.diagState) state.diagState = {};
  state.diagState['rec' + num] = checked;
  saveState();
  render();
}

function escHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
