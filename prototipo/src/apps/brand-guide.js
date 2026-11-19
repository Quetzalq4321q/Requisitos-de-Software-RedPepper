/* =====================================================================
   RED PEPPER — Subgrupo 3B: Estudio de Marca, Temas Claro/Oscuro y Dispositivos
   ===================================================================== */
(function (global) {
  const RP = (global.RP = global.RP || {});

  const SWATCHES_LIGHT = [
    { name: "Rojo Brillante (Oficial)", hex: "#FF3131", fg: "#1C1917", note: "Marca / emblema / énfasis (4.78:1 con carbón)" },
    { name: "Rojo CTA Claro", hex: "#D91B1B", fg: "#FFFFFF", note: "Botones primarios versión blanca (5.09:1 AA)" },
    { name: "Naranja Vivo (Oficial)", hex: "#F64301", fg: "#1C1917", note: "Promociones y calor gastronómico (4.77:1)" },
    { name: "Verde Oscuro (Oficial)", hex: "#1F6636", fg: "#FFFFFF", note: "Disponible / listo / frescura (6.97:1 AA)" },
    { name: "Lienzo Alabastro", hex: "#FAF8F5", fg: "#1C1917", note: "Fondo general versión blanca (16.50:1)" },
  ];

  const SWATCHES_DARK = [
    { name: "Carbón Profundo", hex: "#11100E", fg: "#F5F2EC", note: "Fondo base versión oscura sin negro puro" },
    { name: "Superficie Cálida", hex: "#1B1916", fg: "#F5F2EC", note: "Tarjetas y paneles KDS (15.6:1 con #F5F2EC)" },
    { name: "Rojo CTA Oscuro", hex: "#DC2626", fg: "#FFFFFF", note: "Botones primarios versión oscura (4.83:1 AA)" },
    { name: "Rojo Tinta Oscuro", hex: "#FF6B6B", fg: "#11100E", note: "Precios y alertas sobre #1B1916 (6.45:1 AA)" },
    { name: "Verde Tinta Oscuro", hex: "#4ADE80", fg: "#11100E", note: "Stock activo y confirmaciones KDS (8.90:1)" },
  ];

  function render(container, st) {
    const isDark = st.theme === "dark";
    container.innerHTML = `
      <div class="view-header">
        <div>
          <h1>Estudio de Marca y Versiones Visuales</h1>
          <p class="view-sub">Sistema RED PEPPER en 3 subgrupos · Versión Blanca y Oscura WCAG 2.2 AA</p>
        </div>
        <div class="header-actions">
          <button type="button" class="btn ${!isDark ? "btn-primary" : ""}" id="btn-set-light">${RP.ui.ICONS.sun}<span>Versión Blanca</span></button>
          <button type="button" class="btn ${isDark ? "btn-primary" : ""}" id="btn-set-dark">${RP.ui.ICONS.moon}<span>Versión Oscura</span></button>
          <button type="button" class="btn btn-ghost" id="btn-marca-back-admin">Volver a Admin</button>
        </div>
      </div>

      <div class="grid-2" style="margin-bottom:18px;">
        <div class="card">
          <div class="card-head"><h2 class="card-title">Logotipo Oficial Vectorizado (SVG)</h2></div>
          <div style="display:flex; flex-direction:column; gap:12px;">
            <div style="padding:14px; border:1px solid var(--color-border); border-radius:var(--radius-sm); background:#FFFFFF; display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;">
              <img src="assets/logo-red-pepper.svg" alt="Logotipo horizontal RED PEPPER sobre claro" style="height:52px; max-width:100%;" />
              <img src="assets/logo-red-pepper-badge.svg" alt="Sello original vectorizado RED PEPPER" style="width:68px; height:68px; border-radius:10px;" />
            </div>
            <div style="padding:14px; border-radius:var(--radius-sm); background:#141210; display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;">
              <img src="assets/logo-red-pepper-dark.svg" alt="Logotipo horizontal RED PEPPER sobre oscuro" style="height:52px; max-width:100%;" />
              <img src="assets/logo-red-pepper-mark.svg" alt="Isotipo circular compacto RED PEPPER" style="width:56px; height:56px;" />
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-head"><h2 class="card-title">Mapa en 3 Subgrupos por Dispositivo</h2></div>
          <ul class="kds-items" style="margin:0;">
            <li><strong>Subgrupo 1 · Cliente (Celular / Web):</strong> Modelo PedidosYa con lista horizontal compacta en móvil, barra fija inferior de carrito y portada asimétrica en PC.</li>
            <li><strong>Subgrupo 2 · Operaciones (Tablet / Monitor KDS):</strong> Mostrador Square POS táctil ≥ 48 px con calculadora de vuelto + Tablero Cocina KDS de 3 columnas y Stock 86'd.</li>
            <li><strong>Subgrupo 3 · Administración (PC Backoffice):</strong> Barra lateral dedicada en escritorio para Margen P-14, Compras, Contabilidad NIIF 18, SUNAT y Marca.</li>
          </ul>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-head"><h2 class="card-title">Paleta Versión Blanca (Claro)</h2></div>
          <div class="swatch-grid">
            ${SWATCHES_LIGHT.map(
              (s) => `
              <div class="swatch-card">
                <div class="swatch-color" style="background:${s.hex}; color:${s.fg};">${s.hex}</div>
                <div class="swatch-meta">
                  <strong style="display:block; margin-bottom:2px;">${s.name}</strong>
                  <span style="color:var(--color-text-secondary);">${s.note}</span>
                </div>
              </div>`
            ).join("")}
          </div>
        </div>

        <div class="card">
          <div class="card-head"><h2 class="card-title">Paleta Versión Oscura (Nocturno / KDS)</h2></div>
          <div class="swatch-grid">
            ${SWATCHES_DARK.map(
              (s) => `
              <div class="swatch-card">
                <div class="swatch-color" style="background:${s.hex}; color:${s.fg}; border-bottom:1px solid rgba(255,255,255,0.08);">${s.hex}</div>
                <div class="swatch-meta">
                  <strong style="display:block; margin-bottom:2px;">${s.name}</strong>
                  <span style="color:var(--color-text-secondary);">${s.note}</span>
                </div>
              </div>`
            ).join("")}
          </div>
        </div>
      </div>
    `;

    container.querySelector("#btn-set-light")?.addEventListener("click", () => RP.actions.toggleTheme("light"));
    container.querySelector("#btn-set-dark")?.addEventListener("click", () => RP.actions.toggleTheme("dark"));
    container.querySelector("#btn-marca-back-admin")?.addEventListener("click", () => RP.actions.navigate("admin", "margen"));
  }

  RP.apps = RP.apps || {};
  RP.apps["brand-guide"] = { render };
})(window);
