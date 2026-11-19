#!/usr/bin/env node
/**
 * RED PEPPER — Suite Automatizada de Calidad, Temas Claro/Oscuro,
 * Dispositivos (Celular / Tablet / PC), WCAG 2.2 AA y Flujos E2E.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const PROTO_DIR = path.join(ROOT, "prototipo");
const INTERFACES_DIR = path.join(ROOT, "interfaces");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
};

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const cleanPath = (req.url || "/").split("?")[0];
      const rel = cleanPath === "/" ? "index.html" : cleanPath.replace(/^\/+/, "");
      const filePath = path.join(PROTO_DIR, rel);
      if (!filePath.startsWith(PROTO_DIR) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
      fs.createReadStream(filePath).pipe(res);
    });
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ server, baseUrl: `http://127.0.0.1:${port}` });
    });
  });
}

class CdpClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 0;
    this.pending = new Map();
    this.events = [];
  }
  async connect() {
    await new Promise((res, rej) => {
      this.ws.addEventListener("open", res, { once: true });
      this.ws.addEventListener("error", rej, { once: true });
    });
    this.ws.addEventListener("message", (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      } else if (msg.method) {
        this.events.push(msg);
      }
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  async eval(expression) {
    const r = await this.send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) {
      throw new Error(r.exceptionDetails.text || JSON.stringify(r.exceptionDetails));
    }
    return r.result?.value;
  }
  close() {
    this.ws.close();
  }
}

async function launchChromium() {
  const userDataDir = `/tmp/rp_cdp_${Date.now()}`;
  const proc = spawn(
    "/usr/bin/chromium",
    [
      "--headless=new",
      "--no-sandbox",
      "--disable-gpu",
      "--remote-debugging-port=9229",
      `--user-data-dir=${userDataDir}`,
      "about:blank",
    ],
    { stdio: "ignore" }
  );
  let targets = [];
  for (let i = 0; i < 40; i++) {
    try {
      const resp = await fetch("http://127.0.0.1:9229/json/list");
      targets = await resp.json();
      if (targets.some((t) => t.type === "page")) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 150));
  }
  const page = targets.find((t) => t.type === "page");
  if (!page) throw new Error("Chromium CDP no inició a tiempo");
  const cdp = new CdpClient(page.webSocketDebuggerUrl);
  await cdp.connect();
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  return { proc, cdp, userDataDir };
}

async function captureTo(cdp, url, width, height, outPath, mobile = false) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile,
  });
  await cdp.send("Page.navigate", { url });
  await new Promise((r) => setTimeout(r, 320));
  const shot = await cdp.send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(outPath, Buffer.from(shot.data, "base64"));
  return fs.statSync(outPath).size;
}

async function run() {
  const { server, baseUrl } = await startServer();
  const { proc, cdp, userDataDir } = await launchChromium();
  const report = {
    viewportsChecked: [],
    accessibilityChecks: [],
    e2eFlows: [],
    screenshots: [],
    deviceScreenshots: [],
    consoleErrors: [],
  };

  try {
    const views = [
      { id: "cliente", query: "?view=cliente&capture=1", file: "01-cliente-carta-pedido.png", capHeight: 1120 },
      { id: "pos", query: "?view=pos&capture=1", file: "02-pos-mostrador.png", capHeight: 860 },
      { id: "cocina", query: "?view=cocina&capture=1", file: "03-cocina-comandas.png", capHeight: 860 },
      { id: "admin-margen", query: "?view=admin-margen&capture=1", file: "04-admin-dashboard-margen.png", capHeight: 860 },
      { id: "admin-operaciones", query: "?view=admin-operaciones&capture=1", file: "05-admin-abastecimiento-carta.png", capHeight: 960 },
      { id: "admin-contabilidad", query: "?view=admin-contabilidad&capture=1", file: "06-admin-cierre-niif18-sunat.png", capHeight: 920 },
      { id: "marca", query: "?app=marca&capture=1", file: null, capHeight: 920 },
    ];

    const viewports = [
      { name: "mobile-320", width: 320, height: 640 },
      { name: "mobile-390", width: 390, height: 844 },
      { name: "tablet-768", width: 768, height: 1024 },
      { name: "desktop-1280", width: 1280, height: 800 },
      { name: "wide-1920", width: 1920, height: 1080 },
    ];

    const themes = ["light", "dark"];

    for (const v of views) {
      for (const theme of themes) {
        const url = `${baseUrl}/${v.query}&theme=${theme}`;
        await cdp.send("Emulation.setDeviceMetricsOverride", { width: 1360, height: v.capHeight, deviceScaleFactor: 1, mobile: false });
        await cdp.send("Page.navigate", { url });
        await new Promise((r) => setTimeout(r, 280));

        if (v.file && theme === "light") {
          const outPath = path.join(INTERFACES_DIR, v.file);
          const shot = await cdp.send("Page.captureScreenshot", { format: "png" });
          fs.writeFileSync(outPath, Buffer.from(shot.data, "base64"));
          report.screenshots.push({ view: v.id, theme, file: v.file, bytes: fs.statSync(outPath).size });
        }

        // Chequear accesibilidad DOM + contraste WCAG 2.2 AA en light y dark
        const a11y = await cdp.eval(`(() => {
          const parseRgb = (s) => {
            const m = s && s.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)(?:,\\s*([\\d.]+))?\\)/);
            return m ? [Number(m[1]), Number(m[2]), Number(m[3]), m[4] !== undefined ? Number(m[4]) : 1] : null;
          };
          const relLum = ([r, g, b]) => {
            const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
            return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
          };
          const ratio = (c1, c2) => {
            const l1 = relLum(c1), l2 = relLum(c2);
            return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
          };
          const brokenImgs = Array.from(document.images).filter(i => !i.complete || i.naturalWidth === 0).map(i => i.src);
          const unlabeledInputs = Array.from(document.querySelectorAll('input, select, textarea')).filter(el => {
            if (el.type === 'hidden') return false;
            const id = el.id;
            const hasFor = id && document.querySelector('label[for="' + id + '"]');
            return !hasFor && !el.getAttribute('aria-label') && !el.closest('label');
          }).map(e => e.id || e.tagName);
          const touchFailures = Array.from(document.querySelectorAll('button, .btn, .chip-btn, .nav-tab')).filter(el => {
            const st = getComputedStyle(el);
            if (st.display === 'none' || st.visibility === 'hidden') return false;
            const r = el.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) return false;
            const minH = '${v.id}' === 'pos' && (el.classList.contains('btn-touch') || el.classList.contains('pos-chip') || el.classList.contains('touch-48')) ? 48 : 34;
            return r.height < minH;
          }).map(e => ({ text: e.textContent.trim().slice(0, 24), h: Math.round(e.getBoundingClientRect().height) }));
          const hasH1 = document.querySelectorAll('h1').length;

          const bodyBg = parseRgb(getComputedStyle(document.body).backgroundColor) || [255, 255, 255];
          const primaryBtn = document.querySelector('.btn-primary:not(:disabled)');
          let primaryContrast = 21;
          if (primaryBtn) {
            const ps = getComputedStyle(primaryBtn);
            const fg = parseRgb(ps.color);
            const bg = parseRgb(ps.backgroundColor);
            if (fg && bg) primaryContrast = ratio(fg, bg);
          }
          const h1El = document.querySelector('h1');
          let h1Contrast = 21;
          if (h1El) {
            const fg = parseRgb(getComputedStyle(h1El).color);
            if (fg) h1Contrast = ratio(fg, bodyBg);
          }
          return { brokenImgs, unlabeledInputs, touchFailures, hasH1, primaryContrast: Number(primaryContrast.toFixed(2)), h1Contrast: Number(h1Contrast.toFixed(2)) };
        })()`);
        report.accessibilityChecks.push({ view: v.id, theme, ...a11y });

        for (const vp of viewports) {
          await cdp.send("Emulation.setDeviceMetricsOverride", {
            width: vp.width,
            height: vp.height,
            deviceScaleFactor: 1,
            mobile: vp.width < 768,
          });
          await new Promise((r) => setTimeout(r, 70));
          const ov = await cdp.eval(`({ sw: document.documentElement.scrollWidth, iw: window.innerWidth })`);
          report.viewportsChecked.push({ view: v.id, theme, viewport: vp.name, scrollWidth: ov.sw, innerWidth: ov.iw, pass: ov.sw <= vp.width && ov.iw <= vp.width });
        }
      }
    }

    // Capturas organizadas por Dispositivo (Celular / Tablet / PC) x 3 Subgrupos x Claro/Oscuro
    const deviceMatrix = [
      // Celular (390x844)
      { folder: "celular", file: "sg1-cliente-blanca.png", query: "?view=cliente&theme=light&capture=1", w: 390, h: 844, mob: true },
      { folder: "celular", file: "sg1-cliente-oscura.png", query: "?view=cliente&theme=dark&capture=1", w: 390, h: 844, mob: true },
      { folder: "celular", file: "sg2-pos-blanca.png", query: "?view=pos&theme=light&capture=1", w: 390, h: 844, mob: true },
      { folder: "celular", file: "sg2-cocina-oscura.png", query: "?view=cocina&theme=dark&capture=1", w: 390, h: 844, mob: true },
      { folder: "celular", file: "sg3-admin-blanca.png", query: "?view=admin-margen&theme=light&capture=1", w: 390, h: 844, mob: true },
      // Tablet (768x1024)
      { folder: "tablet", file: "sg1-cliente-blanca.png", query: "?view=cliente&theme=light&capture=1", w: 768, h: 1024, mob: false },
      { folder: "tablet", file: "sg2-pos-blanca.png", query: "?view=pos&theme=light&capture=1", w: 768, h: 1024, mob: false },
      { folder: "tablet", file: "sg2-cocina-oscura.png", query: "?view=cocina&theme=dark&capture=1", w: 768, h: 1024, mob: false },
      { folder: "tablet", file: "sg3-admin-blanca.png", query: "?view=admin-margen&theme=light&capture=1", w: 768, h: 1024, mob: false },
      { folder: "tablet", file: "sg3-admin-oscura.png", query: "?view=admin-contabilidad&theme=dark&capture=1", w: 768, h: 1024, mob: false },
      // PC (1440x920)
      { folder: "pc", file: "sg1-cliente-blanca.png", query: "?view=cliente&theme=light&capture=1", w: 1440, h: 960, mob: false },
      { folder: "pc", file: "sg1-cliente-oscura.png", query: "?view=cliente&theme=dark&capture=1", w: 1440, h: 960, mob: false },
      { folder: "pc", file: "sg2-pos-blanca.png", query: "?view=pos&theme=light&capture=1", w: 1440, h: 900, mob: false },
      { folder: "pc", file: "sg2-cocina-oscura.png", query: "?view=cocina&theme=dark&capture=1", w: 1440, h: 900, mob: false },
      { folder: "pc", file: "sg3-admin-blanca.png", query: "?view=admin-margen&theme=light&capture=1", w: 1440, h: 900, mob: false },
      { folder: "pc", file: "sg3-admin-oscura.png", query: "?view=admin-contabilidad&theme=dark&capture=1", w: 1440, h: 900, mob: false },
      { folder: "pc", file: "sg3-marca-dual.png", query: "?app=marca&theme=dark&capture=1", w: 1440, h: 920, mob: false },
    ];

    for (const d of deviceMatrix) {
      const out = path.join(INTERFACES_DIR, d.folder, d.file);
      const bytes = await captureTo(cdp, `${baseUrl}/${d.query}`, d.w, d.h, out, d.mob);
      report.deviceScreenshots.push({ file: `${d.folder}/${d.file}`, w: d.w, h: d.h, bytes });
    }

    // E2E 1: Flujo Cliente (modal cremas + confirmar -> Cocina KDS Pendiente -> En preparación -> Listo)
    await cdp.send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
    await cdp.send("Page.navigate", { url: `${baseUrl}/?view=cliente&capture=1` });
    await new Promise((r) => setTimeout(r, 250));
    await cdp.eval(`localStorage.clear(); location.reload();`);
    await new Promise((r) => setTimeout(r, 300));

    const orderId = await cdp.eval(`(() => {
      document.querySelector('[data-dish-detail="P-02"]').click();
      const modalOpen = document.getElementById('rp-modal-backdrop').classList.contains('open');
      if (!modalOpen) throw new Error('Modal detalle no abrió');
      document.querySelector('#modal-cremas-picker .crema-tag').click();
      document.getElementById('dish-modal-add').click();
      document.getElementById('btn-client-confirm').click();
      return RP.store.getState().lastClientOrderId;
    })()`);
    await new Promise((r) => setTimeout(r, 150));

    const kdsResult = await cdp.eval(`(() => {
      RP.actions.navigate('cocina', 'kds');
      const btn1 = document.querySelector('[data-kds-adv="${orderId}"]');
      if (!btn1) throw new Error('Comanda ${orderId} no llegó a Pendiente en Cocina');
      btn1.click();
      const btn2 = document.querySelector('[data-kds-adv="${orderId}"]');
      if (!btn2) throw new Error('Comanda ${orderId} no avanzó a En preparación');
      btn2.click();
      return RP.store.getState().orders.find(o => o.id === '${orderId}').estado;
    })()`);
    report.e2eFlows.push({ flow: "Cliente -> Modal cremas -> Cocina KDS Pendiente -> En preparación -> Listo", orderId, finalState: kdsResult, pass: kdsResult === "Listo" });

    // E2E 2: Bloqueo instantáneo de stock (R-ENT2-05)
    const stockSync = await cdp.eval(`(() => {
      document.querySelector('[data-kds-stock="P-01"]').click();
      RP.actions.navigate('pos', 'mostrador');
      const posDisabled = document.querySelector('[data-pos-add="P-01"]').disabled;
      RP.actions.navigate('cliente', 'carta');
      const cliDisabled = document.querySelector('[data-client-add="P-01"]').disabled;
      return { posDisabled, cliDisabled };
    })()`);
    report.e2eFlows.push({ flow: "Bloqueo instantáneo de stock Cocina -> POS y Cliente (R-ENT2-05)", ...stockSync, pass: stockSync.posDisabled && stockSync.cliDisabled });

    // E2E 3: Prorrateo P-14 + Modal edición compra + Cierre de periodo NIIF 18 + Visor SUNAT
    const adminCheck = await cdp.eval(`(() => {
      RP.actions.navigate('admin', 'margen');
      const m1 = RP.actions.computeDailyMetrics().cuotaDiaria;
      document.querySelector('[data-toggle-day="vie"]').click();
      const m2 = RP.actions.computeDailyMetrics().cuotaDiaria;
      RP.actions.navigate('admin', 'compras');
      document.querySelector('[data-edit-purchase="CMP-101"]').click();
      const modalTitle = document.getElementById('rp-modal-title').textContent;
      document.getElementById('mf-monto').value = '600.00';
      document.getElementById('mf-motivo').value = 'Ajuste verificado QA';
      document.getElementById('rp-modal-form').requestSubmit();
      const updatedMonto = RP.store.getState().purchases.find(p => p.id === 'CMP-101').monto;
      RP.actions.navigate('admin', 'contabilidad');
      document.querySelector('[data-view-sunat="CMP-101"]').click();
      const sunatModalTitle = document.getElementById('rp-modal-title').textContent;
      document.getElementById('btn-close-sunat').click();
      document.getElementById('btn-period-lock').click();
      const adjEnabled = !document.getElementById('btn-adj-note').disabled;
      return { m1, m2, modalTitle, sunatModalTitle, updatedMonto, adjEnabled };
    })()`);
    report.e2eFlows.push({
      flow: "Prorrateo P-14 + Modal compra + Vista previa SUNAT + Cierre NIIF 18",
      ...adminCheck,
      pass: adminCheck.m2 > adminCheck.m1 && adminCheck.updatedMonto === 600 && adminCheck.adjEnabled && adminCheck.sunatModalTitle.includes("SUNAT"),
    });

    // E2E 4: Conmutador Versión Blanca / Versión Oscura + Calculadora de vuelto POS
    const themeAndPosCash = await cdp.eval(`(() => {
      document.getElementById('btn-theme-toggle').click();
      const darkAttr = document.documentElement.getAttribute('data-theme');
      RP.actions.navigate('pos', 'mostrador');
      document.querySelector('[data-pos-cash="50"]').click();
      const cashGiven = RP.store.getState().posCashGiven;
      document.getElementById('btn-theme-toggle').click();
      const lightAttr = document.documentElement.getAttribute('data-theme');
      return { darkAttr, cashGiven, lightAttr };
    })()`);
    report.e2eFlows.push({
      flow: "Conmutador Versión Blanca/Oscura + Calculadora vuelto POS S/ 50",
      ...themeAndPosCash,
      pass: themeAndPosCash.darkAttr === "dark" && themeAndPosCash.cashGiven === 50 && themeAndPosCash.lightAttr === "light",
    });

    const runtimeErrors = cdp.events
      .filter((e) => e.method === "Runtime.exceptionThrown")
      .map((e) => e.params?.exceptionDetails?.text || "RuntimeException");
    report.consoleErrors = runtimeErrors;

    console.log(JSON.stringify(report, null, 2));

    const failedVp = report.viewportsChecked.filter((v) => !v.pass);
    const failedA11y = report.accessibilityChecks.filter(
      (a) => a.brokenImgs.length || a.unlabeledInputs.length || a.touchFailures.length || a.primaryContrast < 4.5 || a.h1Contrast < 4.5
    );
    const failedE2E = report.e2eFlows.filter((f) => !f.pass);

    if (failedVp.length || failedA11y.length || failedE2E.length || runtimeErrors.length) {
      console.error("QA FAILURES:", { failedVp, failedA11y, failedE2E, runtimeErrors });
      process.exitCode = 1;
    } else {
      console.log(`ALL ${report.viewportsChecked.length} VIEWPORT+THEME CHECKS, CONTRAST AA, AND ${report.e2eFlows.length} E2E FLOWS PASSED CLEANLY!`);
    }
  } finally {
    cdp.close();
    proc.kill("SIGKILL");
    server.close();
    await new Promise((r) => setTimeout(r, 200));
    try {
      fs.rmSync(userDataDir, { recursive: true, force: true });
    } catch {}
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
