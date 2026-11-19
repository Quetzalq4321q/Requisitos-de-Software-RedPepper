---
name: RED PEPPER — Sánguches, Salchipapas & Más (v4 Dual Theme & 3 Subgrupos)
themes:
  light:
    background: '#FAF8F5'
    surface: '#FFFFFF'
    surface-subtle: '#F4F1EC'
    surface-inset: '#EAE5DC'
    on-surface: '#1C1917'
    on-surface-variant: '#57534E'
    outline-variant: '#E4DFD6'
    brand-red: '#FF3131'
    brand-red-cta: '#D91B1B'
    brand-red-ink: '#B91C1C'
    brand-orange: '#F64301'
    brand-orange-ink: '#C23500'
    brand-green: '#1F6636'
    brand-green-ink: '#1F6636'
  dark:
    background: '#11100E'
    surface: '#1B1916'
    surface-subtle: '#24211D'
    surface-inset: '#2E2A25'
    on-surface: '#F5F2EC'
    on-surface-variant: '#C0B8AC'
    outline-variant: '#35302A'
    brand-red: '#FF4D4D'
    brand-red-cta: '#DC2626'
    brand-red-ink: '#FF6B6B'
    brand-orange: '#F64301'
    brand-orange-ink: '#FF8547'
    brand-green: '#1F6636'
    brand-green-ink: '#4ADE80'
typography:
  display-lg:
    fontFamily: Source Sans 3
    fontSize: clamp(1.35rem, 2.2vw, 1.9rem)
    fontWeight: '800'
    letterSpacing: -0.025em
  headline-md:
    fontFamily: Source Sans 3
    fontSize: 1.125rem
    fontWeight: '700'
    letterSpacing: -0.015em
  body-base:
    fontFamily: Source Sans 3
    fontSize: 0.9375rem
    fontWeight: '400'
  mono-tabular:
    fontFamily: JetBrains Mono
    fontSize: 0.8125rem
    fontWeight: '600'
---

# Design System: RED PEPPER — 3 Subgrupos, Dual Theme (Claro / Oscuro) & Dispositivos Reales

## 1. Visual Theme & Atmosphere
Identidad gastronómica apetitosa, ágil y cercana (*sánguches, hamburguesas, salchipapas al instante*) organizada bajo una arquitectura real de restaurante dividida en **3 subgrupos independientes** adaptados al dispositivo físico donde se operan:
- **Versión Blanca (Modo Claro — Alabastro `#FAF8F5` / `#FFFFFF`):** luminosa, limpia y apetitosa para luz de día, carta de clientes y revisión contable diurna.
- **Versión Oscura (Modo Oscuro — Carbón Cálido `#11100E` / `#1B1916`):** antirreflejo sin negro puro (`#000000`) ni neones violetas; calibrada especialmente para **Cocina KDS con poca luz/vapor**, pedidos nocturnos en celular y operación prolongada sin fatiga visual (contraste mínimo `>= 4.5:1` WCAG 2.2 AA en cada token).

## 2. Arquitectura en 3 Subgrupos y Modelos Reales por Dispositivo
1. **Subgrupo 1 — Experiencia Cliente (`cliente`)**:
   - **Celular (`<640px`, modelo PedidosYa / Uber Eats):** franja superior compacta, píldoras de categoría horizontales deslizables, filas horizontales apetitivas (`thumb` `88×88` + precio + `+`), barra flotante fija *"Ver Pedido"* sobre el nav inferior táctil y modal tipo hoja para cremas.
   - **Tablet (`640–1099px`):** rejilla de 2 columnas con barra de categorías y resumen lateral o superior limpio.
   - **PC (`>=1100px`):** portada asimétrica con fotografía gastronómica real, rejilla 3 columnas y cajón persistente derecho de pedido + seguimiento en vivo.
2. **Subgrupo 2 — Operaciones en Tienda (`pos` + `cocina` KDS)**:
   - **Mostrador POS (`Tablet` / `PC` modelo Square & Toast POS):** división operativa `62% / 38%`, botones de plato codificados por categoría (`>=48px`), selector de canal, métodos de pago y **calculadora rápida de efectivo y vuelto** (`Exacto`, `S/ 10`, `S/ 20`, `S/ 50`). En **Celular**: pestañas alternables `Catálogo | Comanda (N)` para mesero móvil sin scroll infinito.
   - **Cocina KDS (`Tablet` / `PC` monitor de cocina modelo Fresh KDS):** tablero tipo *bump-bar* de 3 columnas con indicadores de prioridad temporal (`verde`, `ámbar`, `rojo`), notas destacadas, avance de estado en 1 toque gigante y panel de **Stock Rápido (`86'd`)**. En **Celular**: cola priorizada vertical y banda de stock arriba.
3. **Subgrupo 3 — Administración & Finanzas NIIF 18 (`admin` + `marca`)**:
   - **PC (`>=1100px`, modelo Alegra / Toast Web Backoffice):** **navegación lateral fija (`220px`)** hacia los 4 módulos (`Margen P-14`, `Compras & Carta`, `Contabilidad NIIF 18 & SUNAT`, `Configuración y Marca`), 4 KPIs superiores, barras visuales de canal, calendario P-14, cascada NIIF 18 y bóveda SUNAT con vista previa modal.
   - **Tablet (`640–1099px`):** pestañas superiores de módulo + tarjetas 2 columnas y tablas con scroll horizontal contenido.
   - **Celular (`<640px`):** resumen ejecutivo `2×2` de KPIs, acciones directas y tarjetas sin compresión de barra lateral.

## 3. Dual Color Tokens & WCAG 2.2 AA Compliance
- **Oficiales invariables:** Rojo Brillante `#FF3131` · Naranja Vivo `#F64301` · Verde Oscuro `#1F6636`.
- **Modo Claro:** Fondo `#FAF8F5`, Superficie `#FFFFFF`, Tinta `#1C1917` (`16.5:1`), CTA rojo `#D91B1B` (`5.09:1` con `#FFF`), Acento naranja tinta `#C23500` (`5.52:1`), Verde `#1F6636` (`6.97:1`).
- **Modo Oscuro:** Fondo `#11100E`, Superficie `#1B1916`, Tinta `#F5F2EC` (`15.6:1`), Secundario `#C0B8AC` (`7.8:1`), CTA rojo `#DC2626` (`4.83:1` con `#FFF`), Rojo tinta `#FF6B6B` (`6.45:1`), Naranja tinta `#FF8547` (`7.10:1`), Verde tinta `#4ADE80` (`8.90:1`).

## 4. Typography, Motion & Anti-Patterns
- **Tipografía:** `Source Sans 3` (prohibido `Inter`, prohibidas serifas genéricas en UI) + `JetBrains Mono` con `tabular-nums` en toda cifra o código.
- **Movimiento:** Exclusivo sobre `transform` y `opacity` (`cubic-bezier(0.22, 1, 0.36, 1)`), respetando `prefers-reduced-motion` y `?capture=1`.
- **Prohibiciones estrictas:** cero negro puro `#000000`, cero brillos neón violeta/azul, cero emojis operativos, cero `window.prompt()`, cero mezcla de navegación pública en portales internos.
