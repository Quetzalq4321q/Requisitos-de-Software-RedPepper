/* =====================================================================
   RED PEPPER — Subgrupo 2A: Mostrador POS Táctil (Modelo Square / Toast)
   Tablet/PC: Split táctil codificado por categoría + Calculadora de Vuelto
   Celular: Pestañas alternables Catálogo / Comanda (sin scroll largo)
   ===================================================================== */
(function (global) {
  const RP = (global.RP = global.RP || {});

  function render(container, st) {
    const esc = RP.format.escapeHtml;
    const categories = ["Todos", "Salchipapas", "Hamburguesas", "Especiales", "Bebidas"];
    const turnTotal = st.orders.reduce((s, o) => s + o.total, 0);
    const draftTotal = st.posCart.reduce((s, l) => s + l.precio * l.qty, 0);
    const draftQty = st.posCart.reduce((s, l) => s + l.qty, 0);

    const gridHtml = st.menu
      .filter((p) => st.posCategory === "Todos" || p.cat === st.posCategory)
      .map(
        (p) => `
        <div class="pos-item ${p.disponible ? "" : "agotado"}" data-cat="${esc(p.cat)}">
          <div>
            <span class="pos-cat-tag">${esc(p.cat)}</span>
            <div class="dish-head" style="margin-top:4px;">
              <span class="dish-name">${esc(p.nombre)}</span>
              <span class="dish-price">${RP.format.money(p.precio)}</span>
            </div>
          </div>
          <button type="button" class="btn btn-touch ${p.disponible ? "btn-primary" : ""}" data-pos-add="${esc(p.id)}" ${p.disponible ? "" : "disabled"}>
            ${p.disponible ? "+ Añadir" : "Agotado"}
          </button>
        </div>`
      )
      .join("");

    const cartHtml = st.posCart.length
      ? st.posCart
          .map(
            (line, idx) => `
          <div class="cart-line">
            <div class="cart-top">
              <div>
                <strong>${esc(line.nombre)}</strong>
                <div class="mono" style="color:var(--color-text-secondary);">${RP.format.money(line.precio * line.qty)}</div>
              </div>
              <div class="cart-controls">
                <button type="button" class="qty-btn touch-48" data-pos-qty="${idx}" data-delta="-1" aria-label="Menos ${esc(line.nombre)}">-</button>
                <strong class="mono" style="min-width:22px; text-align:center;">${line.qty}</strong>
                <button type="button" class="qty-btn touch-48" data-pos-qty="${idx}" data-delta="1" aria-label="Más ${esc(line.nombre)}">+</button>
              </div>
            </div>
            <div class="cremas-row">
              ${st.cremas
                .map(
                  (c) => `<button type="button" class="crema-tag ${line.extras.includes(c) ? "selected" : ""}" data-pos-extra="${idx}" data-crema="${esc(c)}">${esc(c)}</button>`
                )
                .join("")}
            </div>
          </div>`
          )
          .join("")
      : `<p class="view-sub" style="margin:8px 0;">Sin ítems en borrador.</p>`;

    const cashGiven = Number(st.posCashGiven || 0);
    const changeDue = cashGiven >= draftTotal && draftTotal > 0 ? cashGiven - draftTotal : 0;
    const cashBlock =
      st.posPayMethod === "Efectivo" && draftTotal > 0
        ? `<div class="pos-cash-box">
            <div class="pos-cash-head">
              <span style="font-size:12px; font-weight:700; color:var(--color-text-secondary);">Efectivo rápido</span>
              <span class="mono" style="font-weight:700; color:${cashGiven >= draftTotal ? "var(--brand-green-ink)" : "var(--color-text-secondary)"};">
                ${cashGiven > 0 ? `Vuelto: ${RP.format.money(changeDue)}` : "Selecciona billete"}
              </span>
            </div>
            <div class="pos-cash-pills">
              <button type="button" class="chip-btn ${cashGiven === draftTotal ? "active" : ""}" data-pos-cash="${draftTotal}">Exacto</button>
              <button type="button" class="chip-btn ${cashGiven === 20 ? "active" : ""}" data-pos-cash="20">S/ 20</button>
              <button type="button" class="chip-btn ${cashGiven === 50 ? "active" : ""}" data-pos-cash="50">S/ 50</button>
              <button type="button" class="chip-btn ${cashGiven === 100 ? "active" : ""}" data-pos-cash="100">S/ 100</button>
            </div>
          </div>`
        : "";

    const mobTab = st.posMobileTab === "comanda" ? "comanda" : "catalogo";

    container.innerHTML = `
      <div class="view-header">
        <div>
          <h1>Mostrador POS</h1>
          <p class="view-sub">Caja rápida táctil ≥ 48 px (RNF-05) · Subgrupo Operaciones</p>
        </div>
        <div class="header-actions">
          <span class="pill pill-neutral">Turno: <strong class="mono">${RP.format.money(turnTotal)}</strong></span>
          <button type="button" id="btn-pos-cierre" class="btn btn-touch ${st.jornadaAbierta ? "" : "btn-green"}">
            ${st.jornadaAbierta ? "Cerrar Jornada" : "Reabrir Jornada"}
          </button>
        </div>
      </div>

      <div class="pos-mobile-switch" role="tablist" aria-label="Vista móvil de mostrador">
        <button type="button" class="chip-btn pos-chip ${mobTab === "catalogo" ? "active" : ""}" data-pos-mobtab="catalogo">Carta (${st.menu.length})</button>
        <button type="button" class="chip-btn pos-chip ${mobTab === "comanda" ? "active" : ""}" data-pos-mobtab="comanda">Comanda (${draftQty}) · ${RP.format.money(draftTotal)}</button>
      </div>

      <div class="split-pos pos-layout" data-mob-tab="${mobTab}">
        <div class="card pos-panel-catalog">
          <div class="filter-bar" style="margin-bottom:12px;">
            <div class="channel-bar" role="group" aria-label="Canal de venta POS">
              ${["Presencial", "Para llevar", "Pedido externo"]
                .map(
                  (ch) => `<button type="button" class="chip-btn pos-chip ${st.posChannel === ch ? "active" : ""}" data-pos-ch="${esc(ch)}">${
                    ch === "Presencial" ? "Salón" : ch === "Pedido externo" ? "Externo" : ch
                  }</button>`
                )
                .join("")}
            </div>
            <div>
              <label for="pos-cat-select" class="sr-only">Categoría</label>
              <select id="pos-cat-select" class="input-control" style="min-height:48px;">
                ${categories
                  .map((c) => `<option value="${esc(c)}" ${c === st.posCategory ? "selected" : ""}>${c === "Todos" ? "Todo el menú" : esc(c)}</option>`)
                  .join("")}
              </select>
            </div>
          </div>
          <div class="pos-grid">${gridHtml}</div>
        </div>

        <div class="card pos-panel-ticket">
          <div class="card-head">
            <h2 class="card-title">Comanda en Curso</h2>
            <button type="button" class="btn btn-ghost" id="btn-pos-clear">Descartar</button>
          </div>
          ${cartHtml}
          <div style="margin:12px 0 8px;">
            <div class="channel-bar" role="group" aria-label="Método de cobro">
              ${["Efectivo", "Yape / Plin", "POS Tarjeta"]
                .map(
                  (pm) => `<button type="button" class="chip-btn pos-chip ${st.posPayMethod === pm ? "active" : ""}" data-pos-pay="${esc(pm)}">${
                    pm === "POS Tarjeta" ? "Tarjeta" : esc(pm)
                  }</button>`
                )
                .join("")}
            </div>
          </div>
          ${cashBlock}
          <div class="total-row">
            <span style="font-weight:700;">Total a cobrar</span>
            <span class="total-amount">${RP.format.money(draftTotal)}</span>
          </div>
          <button type="button" class="btn btn-primary btn-touch btn-full" id="btn-pos-confirm">Cobrar y Enviar a Cocina</button>
        </div>
      </div>
    `;

    container.querySelectorAll("[data-pos-mobtab]").forEach((b) =>
      b.addEventListener("click", () => {
        st.posMobileTab = b.dataset.posMobtab;
        RP.store.notify();
      })
    );
    container.querySelectorAll("[data-pos-ch]").forEach((b) =>
      b.addEventListener("click", () => {
        st.posChannel = b.dataset.posCh;
        RP.store.notify();
      })
    );
    container.querySelector("#pos-cat-select")?.addEventListener("change", (e) => {
      st.posCategory = e.target.value;
      RP.store.notify();
    });
    container.querySelectorAll("[data-pos-add]").forEach((b) =>
      b.addEventListener("click", () => RP.actions.addToCart("pos", b.dataset.posAdd))
    );
    container.querySelectorAll("[data-pos-qty]").forEach((b) =>
      b.addEventListener("click", () => RP.actions.changeCartQty("pos", Number(b.dataset.posQty), Number(b.dataset.delta)))
    );
    container.querySelectorAll("[data-pos-extra]").forEach((b) =>
      b.addEventListener("click", () => RP.actions.toggleCartExtra("pos", Number(b.dataset.posExtra), b.dataset.crema))
    );
    container.querySelectorAll("[data-pos-pay]").forEach((b) =>
      b.addEventListener("click", () => {
        st.posPayMethod = b.dataset.posPay;
        RP.store.notify();
      })
    );
    container.querySelectorAll("[data-pos-cash]").forEach((b) =>
      b.addEventListener("click", () => {
        st.posCashGiven = Number(b.dataset.posCash);
        RP.store.notify();
      })
    );
    container.querySelector("#btn-pos-clear")?.addEventListener("click", () => RP.actions.clearCart("pos"));
    container.querySelector("#btn-pos-confirm")?.addEventListener("click", () => {
      st.posCashGiven = 0;
      RP.actions.confirmOrder("pos");
    });
    container.querySelector("#btn-pos-cierre")?.addEventListener("click", () => {
      RP.modal.openConfirmModal({
        title: st.jornadaAbierta ? "Confirmar Cierre de Jornada" : "Reabrir Jornada",
        message: st.jornadaAbierta
          ? `Se consolidarán ${st.orders.length} ventas confirmadas por ${RP.format.money(turnTotal)} (RF-03).`
          : "Se habilitará nuevamente el turno operativo.",
        confirmLabel: st.jornadaAbierta ? "Cerrar Jornada" : "Abrir Jornada",
        tone: st.jornadaAbierta ? "primary" : "green",
        onConfirm: () => RP.actions.toggleJornada(),
      });
    });
  }

  RP.apps = RP.apps || {};
  RP.apps.pos = { render };
})(window);
