# Pruebas de Interfaces, Dual Theme, Dispositivos y E2E — RED PEPPER

Resultados reales obtenidos ejecutando [`scripts/qa_verify.mjs`](../scripts/qa_verify.mjs) sobre servidor HTTP local conectado por Chrome DevTools Protocol (CDP) contra `/usr/bin/chromium` headless.

---

## 1. Matriz Multi-Viewport y Tema Dual (`70` combinaciones)

Se evaluaron **7 vistas** (`cliente`, `pos`, `cocina`, `admin-margen`, `admin-operaciones`, `admin-contabilidad`, `marca`) × **2 versiones visuales** (**Blanca** `light` y **Oscura** `dark`) × **5 anchos representativos** (`320px`, `390px`, `768px`, `1280px`, `1920px`) = **70 combinaciones**:

- **Hallazgos detectados y corregidos durante QA:**
  1. En el corte inicial a `320px`, `.pos-mobile-switch .chip-btn` forzaba `scrollWidth = 347px` por `white-space: nowrap` y el botón `#btn-back-public` medía `32px` de alto; se corrigió habilitando ajuste de texto compacto en celular y elevando la altura mínima a `40px`.
  2. En la inspección visual de [`interfaces/celular/sg1-cliente-blanca.png`](../interfaces/celular/sg1-cliente-blanca.png), `.dish-thumb` en diseño horizontal tenía `aspect-ratio: 1/1; height: 100%`, invadiendo el bloque de texto en móvil; se corrigió fijando `width: 100%; aspect-ratio: auto` en `@media (max-width: 639px)`.
- **Resultado final verificado:** **70 / 70** combinaciones con `scrollWidth <= viewportWidth` exacto (cero desborde horizontal desde `320px` hasta `1920px` en ambas versiones).

---

## 2. Contraste WCAG 2.2 AA, DOM, Imágenes y Consola

- **Contraste calculado en vivo en Chromium (Versión Blanca):** botón CTA `#FFFFFF / #D91B1B` = **`5.09 : 1` AA**; titular `<h1>` sobre `#FAF8F5` = **`16.50 : 1` AAA**.
- **Contraste calculado en vivo en Chromium (Versión Oscura):** botón CTA `#FFFFFF / #DC2626` = **`4.83 : 1` AA**; titular `<h1>` sobre `#11100E` = **`17.02 : 1` AAA**.
- **Imágenes cargadas (`naturalWidth > 0`):** **100 %** válidas (`brokenImgs: []`).
- **Errores de ejecución (`Runtime.exceptionThrown`):** **0** errores en consola (`consoleErrors: []`).
- **Controles sin etiqueta y fallos táctiles:** **`unlabeledInputs: []`**, **`touchFailures: []`**.

---

## 3. Pruebas Funcionales End-to-End (E2E) Ejecutadas

| # | Flujo verificado en Chromium | Evidencia observada en DOM / Estado | Estado |
|---|---|---|---|
| **E2E 1** | Cliente abre modal de producto, selecciona crema, agrega al pedido y confirma -> Cocina KDS recibe comanda en `Pendiente` y avanza `En preparación -> Listo` | `CMD-0847` creada y transición validada hasta `finalState: "Listo"` | **Aprobado** |
| **E2E 2** | Cocina marca `P-01 Salchipapa Clásica` como agotado (`R-ENT2-05`) | Botones de agregado en POS (`posDisabled: true`) y Cliente (`cliDisabled: true`) bloqueados al instante | **Aprobado** |
| **E2E 3** | Admin alterna feriado P-14 -> corrige compra `CMP-101` (`S/ 600.00`) -> abre vista previa SUNAT -> cierra periodo mensual NIIF 18 (`RNF-07`) | Cuota recalculada (`200 -> 266.67`), modal SUNAT abierto, cierre NIIF 18 bloqueado (`adjEnabled: true`) | **Aprobado** |
| **E2E 4** | Conmutador **Versión Blanca / Oscura** + Calculadora rápida de efectivo POS (`S/ 50 -> Vuelto`) | Atributo `data-theme` conmutado (`dark`/`light`) y billete `S/ 50` aplicado (`cashGiven: 50`) | **Aprobado** |

---

## 4. Capturas Oficiales y Separación por Dispositivo

- **LaTeX base (`interfaces/`):** `01-cliente-carta-pedido.png` .. `06-admin-cierre-niif18-sunat.png`.
- **Celular (`390×844`, `interfaces/celular/`):** `sg1-cliente-blanca.png`, `sg1-cliente-oscura.png`, `sg2-pos-blanca.png`, `sg2-cocina-oscura.png`, `sg3-admin-blanca.png`.
- **Tablet (`768×1024`, `interfaces/tablet/`):** `sg1-cliente-blanca.png`, `sg2-pos-blanca.png`, `sg2-cocina-oscura.png`, `sg3-admin-blanca.png`, `sg3-admin-oscura.png`.
- **PC (`1440×900/960`, `interfaces/pc/`):** `sg1-cliente-blanca.png`, `sg1-cliente-oscura.png`, `sg2-pos-blanca.png`, `sg2-cocina-oscura.png`, `sg3-admin-blanca.png`, `sg3-admin-oscura.png`, `sg3-marca-dual.png`.
