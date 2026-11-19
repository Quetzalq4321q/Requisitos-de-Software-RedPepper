# Arquitectura de Información y UX/UI en 3 Subgrupos — RED PEPPER

Aplicando la metodología **Stitch (`taste-design`, `stitch-extract-design-md`, `enhance-prompt`)**, [`ux-information-architect`](../.agents/skills/ux-information-architect/SKILL.md) y [`responsive-interface-builder`](../.agents/skills/responsive-interface-builder/SKILL.md), la plataforma **RED PEPPER** se organiza en **3 Subgrupos operativos** inspirados en software gastronómico real de producción y diferenciados para **Celular**, **Tablet** y **PC**, disponibles en **Versión Blanca** (`light`) y **Versión Oscura** (`dark`).

---

## 1. Arquitectura en 3 Subgrupos por Dispositivo y Modelo Real

| Subgrupo | Portales | Modelo real de referencia | Celular (`< 640 px`) | Tablet (`640 – 1099 px`) | PC (`>= 1100 px`) |
|---|---|---|---|---|---|
| **Subgrupo 1 · Experiencia Cliente** | `cliente` (`Carta`, `Tu Pedido`, `Seguimiento`, `El Local`) | **PedidosYa / Uber Eats** | Tarjeta horizontal compacta (`96×96`), chips de categoría en fila única deslizante, barra inferior fija (`4` botones) y barra flotante `Ver ->` de carrito. | Grilla limpia de 2 columnas + acceso directo al carrito debajo. | Portada editorial asimétrica (`1.35fr / 1fr`), catálogo en 3 columnas y resumen persistente a la derecha (`40 %`). |
| **Subgrupo 2 · Operaciones en Tienda** | `pos` (`Mostrador POS`) + `cocina` (`Cocina KDS`) | **Square / Toast POS + Fresh KDS** | **POS Mesero Móvil:** selector de pestañas `Carta | Comanda · S/ Total`. **KDS Móvil:** cola vertical priorizada. | **POS Táctil:** botones `>= 48 px`, franjas por categoría y calculadora de vuelto (`Exacto / S/ 20 / S/ 50 / S/ 100`). **KDS:** columnas apilables + barra Stock Rápido 86'd. | Split POS `62 % / 38 %` + monitor KDS en 3 columnas con línea de urgencia (`Pendiente`, `En preparación`, `Listo`) + interruptor *Modo Día / Nocturno*. |
| **Subgrupo 3 · Administración & Marca** | `admin` (`Margen P-14`, `Compras`, `Contabilidad`, `Config`) + `marca` | **Alegra / QuickBooks / Toast Backoffice** | KPIs apilados y tablas con `.table-wrap`. | Navegación superior horizontal + grilla KPI 2×2 + paneles de 1 columna. | Barra lateral izquierda dedicada (`.admin-rail` de `224 px`) sin pestañas duplicadas en cabecera, barras proporcionales por canal, cascada NIIF 18 y modal SUNAT. |

El selector modal **Subgrupos** (`#btn-staff-switcher`) separa el acceso operativo de la navegación comercial pública (`RNF-01`), manteniendo un máximo de **4 destinos** en la barra de cliente.

---

## 2. Sistema Dual de Apariencia (Versión Blanca y Versión Oscura)

- **Versión Blanca (`[data-theme="light"]`):** Alabastro cálido (`#FAF8F5`) y tarjetas `#FFFFFF`, ideal para cartas con apetito visual diurno y oficinas administrativas bien iluminadas.
- **Versión Oscura (`[data-theme="dark"]`):** Carbón profundo (`#11100E`) y tarjetas `#1B1916` (sin negro puro `#000000`), calibrado para turnos nocturnos en Cocina KDS, barras poco iluminadas y ahorro de fatiga ocular.
- **Conmutación instantánea:** botón en cabecera (`#btn-theme-toggle`), parámetro `?theme=light|dark`, persistencia automática en estado local y cambio dinámico del logotipo SVG (`logo-red-pepper.svg` vs `logo-red-pepper-dark.svg`).

---

## 3. Reglas de Simplicidad y Revelación Progresiva

1. **Sin duplicidad de información:** cada cifra o tabla vive únicamente en su subgrupo correspondiente.
2. **Detalle bajo demanda:** descripción extensa y selección granular de cremas en Carta abren en modal accesible al pulsar **Detalle**.
3. **Desgloses contables plegables:** costos indirectos fijos en NIIF 18 permanecen tras `<details>`, y comprobantes SUNAT se inspeccionan en vista previa modal (`#btn-view-sunat`).
4. **Cero diálogos nativos:** modales accesibles con cierre por `Escape`, etiqueta explícita y validación en línea.
