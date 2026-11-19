/* =====================================================================
   RED PEPPER — Subgrupo 2B: Cocina KDS (Modelo Toast / Fresh KDS)
   Monitor/Tablet: Bump-bar 3 columnas con prioridad y franjas de estado
   Celular: Cola priorizada vertical + barra compacta de Stock Rápido
   ===================================================================== */
(function (global) {
  const RP = (global.RP = global.RP || {});

  function render(container, st) {
    const esc = RP.format.escapeHtml;
    const cols = [
      { state: "Pendiente", tone: "danger", stripe: "pending", actionLabel: "Iniciar Preparación", next: "En preparación", btnCls: "btn-primary" },
      { state: "En preparación", tone: "warn", stripe: "prep", actionLabel: "Marcar Listo", next: "Listo", btnCls: "btn-green" },
      { state: "Listo", tone: "ok", stripe: "ready", actionLabel: null, next: null, btnCls: "" },
    ];

    const pendingCount = st.orders.filter((o) => o.estado === "Pendiente").length;
    const prepCount = st.orders.filter((o) => o.estado === "En preparación").length;

    const boardHtml = cols
      .map((col) => {
        const list = st.orders.filter((o) => o.estado === col.state);
        const ticketsHtml = list.length
          ? list
              .map(
                (o) => `
              <div class="kds-ticket kds-ticket-${col.stripe}">
                <div class="kds-ticket-head">
                  <strong class="mono" style="font-size:14px;">${esc(o.id)}</strong>
                  ${RP.ui.statusPill(`${o.canal} · ${o.hora}`, col.tone)}
                </div>
                <ul class="kds-items">
                  ${o.items
                    .map(
                      (i) => `<li><strong class="mono">${i.qty}×</strong> ${esc(i.nombre)}${
                        i.extras.length ? ` <span class="kds-extras">[${esc(i.extras.join(", "))}]</span>` : ""
                      }</li>`
                    )
                    .join("")}
                </ul>
                ${o.nota ? `<div class="kds-note">Nota: ${esc(o.nota)}</div>` : ""}
                ${
                  col.actionLabel
                    ? `<button type="button" class="btn ${col.btnCls} btn-touch btn-full" data-kds-adv="${esc(o.id)}" data-next="${esc(col.next)}">${col.actionLabel}</button>`
                    : `<div class="kds-dispatched">${RP.ui.ICONS.check}<span>Despachado en barra</span></div>`
                }
              </div>`
              )
              .join("")
          : `<p class="view-sub" style="margin:6px 0;">Sin comandas en esta columna.</p>`;

        return `
          <div class="kds-col">
            <div class="kds-col-head">
              <span>${col.state}</span>
              ${RP.ui.statusPill(String(list.length), col.tone)}
            </div>
            ${ticketsHtml}
          </div>`;
      })
      .join("");

    const stockHtml = st.menu
      .map(
        (p) => `
        <div class="kds-stock-row">
          <span style="font-weight:700;">${esc(p.nombre)}</span>
          <button type="button" class="btn ${p.disponible ? "pill-ok" : "pill-danger"}" data-kds-stock="${esc(p.id)}">
            ${p.disponible ? "Activo" : "Agotado"}
          </button>
        </div>`
      )
      .join("");

    container.innerHTML = `
      <div class="view-header">
        <div>
          <h1>Cocina (KDS)</h1>
          <p class="view-sub">Cola al instante · ${pendingCount} por iniciar · ${prepCount} en plancha/freidora</p>
        </div>
        <div class="header-actions">
          <button type="button" class="btn" id="btn-kds-theme-hint">
            ${st.theme === "dark" ? RP.ui.ICONS.sun : RP.ui.ICONS.moon}
            <span>${st.theme === "dark" ? "Modo Día" : "Modo Cocina Nocturno"}</span>
          </button>
        </div>
      </div>

      <div class="split-admin kds-layout">
        <div class="kds-board">${boardHtml}</div>
        <aside class="card kds-stock-panel">
          <div class="card-head">
            <h2 class="card-title">Stock Rápido (86'd)</h2>
            <span class="pill pill-neutral">1 toque</span>
          </div>
          <p class="view-sub" style="margin:0 0 10px;">Bloquea al instante en Carta Cliente y Mostrador POS.</p>
          ${stockHtml}
        </aside>
      </div>
    `;

    container.querySelector("#btn-kds-theme-hint")?.addEventListener("click", () => RP.actions.toggleTheme());
    container.querySelectorAll("[data-kds-adv]").forEach((btn) =>
      btn.addEventListener("click", () => RP.actions.advanceOrderState(btn.dataset.kdsAdv, btn.dataset.next))
    );
    container.querySelectorAll("[data-kds-stock]").forEach((btn) =>
      btn.addEventListener("click", () => RP.actions.toggleProductStock(btn.dataset.kdsStock))
    );
  }

  RP.apps = RP.apps || {};
  RP.apps.cocina = { render };
})(window);
