// Espera a que todo el contenido del DOM esté cargado y listo.
document.addEventListener('DOMContentLoaded', () => {

  /**
   * ---------------------------------------------------------------------
   * NAVEGACIÓN POR PESTAÑAS (TABS)
   * ---------------------------------------------------------------------
   * Controla la visibilidad de las secciones principales de la página.
   */
  const tabs = document.querySelectorAll('.nav__link, .tab'); // Selecciona tabs de sidebar y móvil
  const panes = document.querySelectorAll('.tab-pane');

  function activateTab(targetId) {
    // Si no hay target, no hace nada.
    if (!targetId) return;

    // Actualiza el estado visual de los botones de pestañas
    tabs.forEach(tab => {
      // Comprueba si el 'href' termina con el ID o si 'data-tab' coincide.
      const href = tab.getAttribute('href') || '';
      const tabData = tab.dataset.tab || '';
      const isActive = href.endsWith(`#${targetId}`) || tabData === targetId;
      tab.classList.toggle('active', isActive);
    });

    // Muestra u oculta el panel de contenido correspondiente
    panes.forEach(pane => {
      pane.style.display = pane.id === `content-${targetId}` ? 'block' : 'none';
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      // Obtiene el ID del 'href' (ej: '#intro' -> 'intro') o de 'data-tab'
      const targetId = (e.currentTarget.getAttribute('href') || '').substring(1) || e.currentTarget.dataset.tab;
      activateTab(targetId);
    });
  });

  // Activa la primera pestaña basándose en la URL o por defecto 'intro'
  const initialTab = window.location.hash.substring(1) || 'intro';
  activateTab(initialTab);


  /**
   * ---------------------------------------------------------------------
   * SELECTOR INTERACTIVO DE MÉTODOS
   * ---------------------------------------------------------------------
   * Muestra recomendaciones de métodos de estudio según el objetivo.
   */
  const DATA = {
    methods: {
      cornell: { icon: '🗒️', title: 'Método Cornell', tag: 'Estructura + revisión activa', desc: 'Divide la página en notas, pistas y resumen. Ideal para procesar y revisar.' },
      sketchnoting: { icon: '🎨', title: 'Sketchnoting', tag: 'Pensamiento visual', desc: 'Combina texto y dibujos para un mapa visual. Excelente para conceptos complejos.' },
      mindmap: { icon: '🧠', title: 'Mapas Mentales', tag: 'Exploración de ideas', desc: 'Perfecto para brainstorming y ver el panorama general de un tema.' },
      zettelkasten: { icon: '🗄️', title: 'Zettelkasten', tag: 'Construye un "segundo cerebro"', desc: 'Crea notas atómicas enlazadas para descubrir conexiones a largo plazo.' },
      linear: { icon: '🧾', title: 'Esquema Lineal', tag: 'Jerarquía y orden', desc: 'Ideal para documentar procesos paso a paso o tomar notas de forma estructurada.' },
    },
    goals: {
      study: ['cornell', 'sketchnoting'],
      design: ['mindmap', 'sketchnoting'],
      document: ['linear', 'cornell'],
      research: ['zettelkasten', 'mindmap'],
    }
  };

  const goalSelector = document.getElementById('goal-selector');
  const recommendationsContainer = document.getElementById('recommendations');

  // Verifica que los contenedores existan antes de continuar
  if (goalSelector && recommendationsContainer) {
    
    // Función que crea el HTML de una tarjeta de recomendación
    function createRecommendationCard(key, index) {
      const method = DATA.methods[key];
      if (!method) return ''; // Retorna string vacío si el método no existe

      return `
        <div class="mini-card animate-fade" style="animation-delay: ${index * 75}ms">
          <div class="mini-card__head">
            <span class="emoji">${method.icon}</span>
            <h3 class="h6">${method.title}</h3>
          </div>
          <p class="mini-card__tag">${method.tag}</p>
          <p class="text-muted">${method.desc}</p>
        </div>`;
    }

    // Función que muestra las recomendaciones para un objetivo
    function showRecommendations(goal) {
      const recommendedKeys = DATA.goals[goal] || [];
      recommendationsContainer.innerHTML = recommendedKeys.map(createRecommendationCard).join('');
    }

    // Maneja los clics en los botones de objetivo
    goalSelector.addEventListener('click', (e) => {
      const button = e.target.closest('button[data-goal]');
      if (!button) return;

      // Actualiza el estado visual de los botones
      goalSelector.querySelector('.active')?.classList.remove('active');
      button.classList.add('active');
      
      // Muestra las nuevas recomendaciones
      showRecommendations(button.dataset.goal);
    });

    // Muestra las recomendaciones iniciales al cargar la página
    showRecommendations('study');
  }


  /**
   * ---------------------------------------------------------------------
   * GRÁFICO DE FASES DEL APRENDIZAJE (CON CHART.JS)
   * ---------------------------------------------------------------------
   * Renderiza un gráfico de líneas si Chart.js está disponible.
   */
  const chartCanvas = document.getElementById('learningPhasesChart');
  // Verifica si la librería Chart y el elemento canvas existen
  if (typeof Chart !== 'undefined' && chartCanvas) {
    const ctx = chartCanvas.getContext('2d');

    const gridColor = 'rgba(229, 231, 235, 0.7)'; // --border-color
    const primaryColor = '#10b981'; // --primary-green

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Captura', 'Procesar', 'Recuerdo Activo', 'Repaso', 'Examen'],
        datasets: [{
          label: 'Impacto en Retención',
          data: [40, 55, 80, 90, 95],
          tension: 0.4,
          borderColor: primaryColor,
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          borderWidth: 2.5,
          fill: true,
          pointRadius: 5,
          pointBackgroundColor: primaryColor,
          pointBorderColor: '#fff',
          pointHoverRadius: 7,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#111827',
            titleFont: { size: 14, weight: 'bold' },
            bodyFont: { size: 12 },
            padding: 12,
            cornerRadius: 8,
            boxPadding: 4,
            callbacks: {
              label: (context) => `${context.dataset.label}: ${context.parsed.y}%`
            }
          }
        },
        scales: {
          x: { grid: { color: gridColor, drawBorder: false } },
          y: {
            grid: { color: gridColor, drawBorder: false },
            suggestedMin: 0,
            suggestedMax: 100,
            ticks: { callback: (value) => value + '%' }
          }
        }
      }
    });
  }
});