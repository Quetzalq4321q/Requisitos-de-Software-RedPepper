/* =====================================================================
   RED PEPPER — Orquestador de 3 Subgrupos, Tema Claro/Oscuro y Dispositivos
   Subgrupo 1: Cliente (Celular / Web)
   Subgrupo 2: Operaciones POS & Cocina KDS (Tablet / Monitor PC)
   Subgrupo 3: Administración NIIF 18 & Marca (PC / Ejecutivo)
   ===================================================================== */
(function (global) {
  const RP = (global.RP = global.RP || {});

  function openStaffPortalSwitcher() {
    const st = RP.store.getState();
    const isDark = st.theme === "dark";
    RP.modal.openModal({
      title: "Arquitectura en 3 Subgrupos — RED PEPPER",
      bodyHtml: `
        <p class="view-sub" style="margin-bottom:14px;">
          Selecciona el subgrupo operativo y su dispositivo modelo o alterna la versión visual:
        </p>

        <div class="subgroup-modal-list">
          <div class="subgroup-box">
            <div class="subgroup-box-head">
              <strong>Subgrupo 1 · Experiencia Cliente</strong>
              <span class="pill pill-promo">Modelo Celular / Web</span>
            </div>
            <p class="view-sub" style="margin:0 0 10px;">Carta ágil estilo PedidosYa, selector de cremas y seguimiento en vivo.</p>
            <div class="grid-2" style="gap:8px;">
              <button type="button" class="btn btn-touch ${st.activeApp === "cliente" && st.activeTab !== "seguimiento" ? "btn-primary" : ""}" data-switch-app="cliente" data-switch-tab="carta">Carta Digital</button>
              <button type="button" class="btn btn-touch ${st.activeApp === "cliente" && st.activeTab === "seguimiento" ? "btn-primary" : ""}" data-switch-app="cliente" data-switch-tab="seguimiento">Seguimiento Pedido</button>
            </div>
          </div>

          <div class="subgroup-box">
            <div class="subgroup-box-head">
              <strong>Subgrupo 2 · Operaciones en Tienda</strong>
              <span class="pill pill-ok">Modelo Tablet / Monitor KDS</span>
            </div>
            <p class="view-sub" style="margin:0 0 10px;">Caja táctil ≥ 48 px con cálculo de vuelto y tablero de cocina en tiempo real.</p>
            <div class="grid-2" style="gap:8px;">
              <button type="button" class="btn btn-touch ${st.activeApp === "pos" ? "btn-primary" : ""}" data-switch-app="pos" data-switch-tab="mostrador">Mostrador POS</button>
              <button type="button" class="btn btn-touch ${st.activeApp === "cocina" ? "btn-primary" : ""}" data-switch-app="cocina" data-switch-tab="kds">Cocina KDS</button>
            </div>
          </div>

          <div class="subgroup-box">
            <div class="subgroup-box-head">
              <strong>Subgrupo 3 · Administración &amp; NIIF 18</strong>
              <span class="pill pill-neutral">Modelo PC Backoffice</span>
            </div>
            <p class="view-sub" style="margin:0 0 10px;">Prorrateo P-14, compras, estados NIIF 18, bóveda SUNAT y estudio de marca.</p>
            <div class="grid-2" style="gap:8px;">
              <button type="button" class="btn btn-touch ${st.activeApp === "admin" ? "btn-primary" : ""}" data-switch-app="admin" data-switch-tab="margen">Panel Gerencial &amp; NIIF 18</button>
              <button type="button" class="btn btn-touch ${st.activeApp === "marca" ? "btn-primary" : ""}" data-switch-app="marca" data-switch-tab="guia">Estudio de Marca</button>
            </div>
          </div>
        </div>

        <div class="modal-actions" style="justify-content:space-between;">
          <button type="button" class="btn" id="modal-theme-switch">
            ${isDark ? RP.ui.ICONS.sun : RP.ui.ICONS.moon}
            <span>Cambiar a Versión ${isDark ? "Blanca" : "Oscura"}</span>
          </button>
          <button type="button" class="btn btn-ghost" id="modal-close-sub">Cerrar</button>
        </div>
      `,
      onMount(dialog, close) {
        dialog.querySelectorAll("[data-switch-app]").forEach((b) =>
          b.addEventListener("click", () => {
            RP.actions.navigate(b.dataset.switchApp, b.dataset.switchTab);
            close();
          })
        );
        dialog.querySelector("#modal-theme-switch")?.addEventListener("click", () => {
          RP.actions.toggleTheme();
          close();
        });
        dialog.querySelector("#modal-close-sub")?.addEventListener("click", close);
      },
    });
  }

  function renderHeader(st) {
    const topbar = document.getElementById("app-topbar");
    const isPublic = st.activeApp === "cliente";
    const isDark = st.theme === "dark";
    topbar.className = isPublic ? "topbar" : "topbar topbar-staff";

    const cartCount = st.clientCart.reduce((s, l) => s + l.qty, 0);
    const logoSrc = isDark ? "assets/logo-red-pepper-dark.svg" : "assets/logo-red-pepper.svg";

    let navItems = [];
    if (isPublic) {
      navItems = [
        { app: "cliente", tab: "carta", label: "Carta" },
        { app: "cliente", tab: "pedido", label: "Tu Pedido", badge: cartCount },
        { app: "cliente", tab: "seguimiento", label: "Seguimiento" },
        { app: "cliente", tab: "local", label: "El Local" },
      ];
    } else if (st.activeApp === "admin" || st.activeApp === "marca") {
      navItems = [
        { app: "admin", tab: "margen", label: "Margen P-14" },
        { app: "admin", tab: "compras", label: "Compras y Carta" },
        { app: "admin", tab: "contabilidad", label: "Contabilidad" },
        { app: "admin", tab: "config", label: "Configuración" },
        { app: "marca", tab: "guia", label: "Marca" },
      ];
    } else {
      navItems = [
        { app: "pos", tab: "mostrador", label: "Mostrador POS" },
        { app: "cocina", tab: "kds", label: "Cocina KDS" },
        { app: "admin", tab: "margen", label: "Administración" },
        { app: "cliente", tab: "carta", label: "Vista Cliente" },
      ];
    }

    const navHtml = navItems
      .map((item) => {
        const isActive = st.activeApp === item.app && (st.activeTab === item.tab || item.app === "marca");
        const badge = item.badge > 0 ? `<span class="nav-badge">${item.badge}</span>` : "";
        return `<button type="button" class="nav-tab ${isActive ? "active" : ""}" data-nav-app="${item.app}" data-nav-tab="${item.tab}">${item.label}${badge}</button>`;
      })
      .join("");

    topbar.innerHTML = `
      <div class="topbar-inner">
        <button type="button" class="brand-lockup" id="btn-brand-home" aria-label="Ir al inicio de RED PEPPER">
          <img src="${logoSrc}" alt="RED PEPPER — Sánguches, Salchipapas &amp; Más" class="brand-logo-full" width="210" height="44" />
          <img src="assets/logo-red-pepper-mark.svg" alt="RED PEPPER" class="brand-logo-mark" width="36" height="36" />
        </button>

        <nav class="primary-nav ${isPublic ? "primary-nav-client" : ""} ${st.activeApp === "admin" || st.activeApp === "marca" ? "primary-nav-admin" : ""}" aria-label="${isPublic ? "Navegación cliente" : "Navegación operativa"}">
          ${navHtml}
        </nav>

        <div class="header-tools">
          <span class="header-status-hide-xs">${RP.ui.statusPill(st.jornadaAbierta ? "Abierto" : "Cerrado", st.jornadaAbierta ? "ok" : "danger", st.jornadaAbierta)}</span>
          <button type="button" class="btn btn-ghost btn-theme" id="btn-theme-toggle" aria-label="${isDark ? "Cambiar a versión blanca" : "Cambiar a versión oscura"}" title="${isDark ? "Versión Blanca" : "Versión Oscura"}">
            ${isDark ? RP.ui.ICONS.sun : RP.ui.ICONS.moon}
            <span class="theme-label">${isDark ? "Blanca" : "Oscura"}</span>
          </button>
          <button type="button" class="btn btn-ghost" id="btn-staff-switcher">
            ${RP.ui.ICONS.layers}
            <span>${isPublic ? "Subgrupos" : "Subgrupo"}</span>
          </button>
        </div>
      </div>
    `;

    // Barra inferior fija móvil solo en experiencia cliente
    const mobileBar = document.getElementById("mobile-bottom-nav");
    if (isPublic) {
      mobileBar.style.display = "";
      mobileBar.innerHTML = navItems
        .map((item) => {
          const isActive = st.activeTab === item.tab;
          const badge = item.badge > 0 ? ` (${item.badge})` : "";
          return `<button type="button" class="nav-tab ${isActive ? "active" : ""}" data-nav-app="cliente" data-nav-tab="${item.tab}">${item.label}${badge}</button>`;
        })
        .join("");
    } else {
      mobileBar.style.display = "none";
      mobileBar.innerHTML = "";
    }

    document.querySelectorAll("[data-nav-app]").forEach((btn) =>
      btn.addEventListener("click", () => RP.actions.navigate(btn.dataset.navApp, btn.dataset.navTab))
    );
    document.getElementById("btn-brand-home")?.addEventListener("click", () =>
      RP.actions.navigate(isPublic ? "cliente" : st.activeApp)
    );
    document.getElementById("btn-theme-toggle")?.addEventListener("click", () => RP.actions.toggleTheme());
    document.getElementById("btn-staff-switcher")?.addEventListener("click", openStaffPortalSwitcher);
  }

  function renderBreadcrumb(st) {
    const el = document.getElementById("portal-breadcrumb");
    if (st.activeApp === "cliente") {
      el.style.display = "none";
      return;
    }
    const meta = RP.ui.SUBGROUPS[st.activeApp] || { name: "Operaciones", device: "Multi-dispositivo" };
    el.style.display = "flex";
    el.innerHTML = `
      <span><strong>${RP.format.escapeHtml(meta.name)}</strong> · ${RP.format.escapeHtml(meta.device)} · <span class="mono">${RP.format.escapeHtml(st.activeRole)}</span></span>
      <button type="button" class="btn btn-ghost" style="min-height:40px; padding:6px 12px; font-size:12px;" id="btn-back-public">Vista Cliente</button>
    `;
    document.getElementById("btn-back-public")?.addEventListener("click", () => RP.actions.navigate("cliente", "carta"));
  }

  function renderAll() {
    const st = RP.store.getState();
    const theme = st.theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-app", st.activeApp || "cliente");

    renderHeader(st);
    renderBreadcrumb(st);

    const mount = document.getElementById("app-content");
    if (st.activeApp === "pos") {
      RP.apps.pos.render(mount, st);
    } else if (st.activeApp === "cocina") {
      RP.apps.cocina.render(mount, st);
    } else if (st.activeApp === "admin") {
      RP.apps.admin.render(mount, st);
    } else if (st.activeApp === "marca") {
      RP.apps["brand-guide"].render(mount, st);
    } else {
      RP.apps.cliente.render(mount, st);
    }
  }

  global.addEventListener("DOMContentLoaded", () => {
    RP.store.subscribe(renderAll);
    RP.actions.applyLegacyOrUrlParams();
    renderAll();
  });

  RP.main = { renderAll, openStaffPortalSwitcher };
})(window);
