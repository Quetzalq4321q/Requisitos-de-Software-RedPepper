# Auditoría de Accesibilidad Dual Theme (WCAG 2.2 AA) — RED PEPPER

Auditoría ejecutada mediante [`accessible-ui-auditor`](../.agents/skills/accessible-ui-auditor/SKILL.md) y verificación computada de luminancia real en Chromium headless (`scripts/qa_verify.mjs`) para **Versión Blanca** (`light`) y **Versión Oscura** (`dark`).

---

## 1. Correcciones de Contraste Cromático Aplicadas (Blanca & Oscura)

| Elemento / Tema | Hallazgo inicial | Corrección verificada en Chromium |
|---|---|---|
| Texto blanco sobre `#FF3131` (Blanca) | Ratio `3.66 : 1` (bajo `< 18 px` AA) | `--brand-red-cta: #D91B1B` (`5.09 : 1` AA medido), `--brand-red-ink: #B91C1C` (`6.47 : 1`); `#FF3131` reservado al emblema, bordes y titulares grandes. |
| Botón primario y tintas rojas (Oscura) | `#FF3131` oscuro sobre `#1B1916` necesita calibración | `--brand-red-cta: #DC2626` con `#FFFFFF` (`4.83 : 1` AA medido) y `--brand-red-ink: #FF6B6B` (`6.45 : 1` sobre `#1B1916`). |
| Texto sobre `#F64301` (Blanca & Oscura) | Texto blanco daba `3.67 : 1` | Etiquetas y botones naranjas usan tinta oscura cálida `#1C1917` fija (`4.77 : 1` AA) en ambos temas; sobre `#1B1916` oscuro se usa `#FF8C52` (`7.35 : 1`). |
| Verde oficial (`#1F6636`) | Cumple en claro, insuficiente sobre carbón `#1B1916` | En Versión Blanca `#1F6636` (`6.97 : 1` con blanco); en Versión Oscura `#1B6E3A` para botones blancos (`6.14 : 1`) y `#4ADE80` para texto positivo sobre `#1B1916` (`8.90 : 1`). |
| Lienzo Nocturno (Oscura) | Evitar negro puro `#000000` (halación ocular) | Base `#11100E` (`--color-bg`), tarjetas `#1B1916`, texto `#F5F2EC` (`17.02 : 1` AAA medido en `<h1>`). |

---

## 2. Verificación Estructural, Teclado y Objetivos Táctiles (`14/14` vista × tema)

| Criterio WCAG 2.2 AA | Implementación | Resultado Chromium QA |
|---|---|---|
| `2.4.1` Salto de bloques | `<a class="skip-link" href="#app-content">` | Presente en `index.html`. |
| `1.3.1` Encabezados únicos | Exactamente un `<h1>` visible por vista (`hasH1 === 1`) | **14 / 14** vistas (Blanca y Oscura). |
| `3.3.2 / 4.1.2` Etiquetas | `<input>` / `<select>` vinculados con `<label for>` o `aria-label` | **0** controles sin etiqueta (`unlabeledInputs: []`). |
| `2.1.1 / 2.4.7` Teclado y foco | `:focus-visible` adaptado por tema (`#D91B1B` / `#FF6B6B`); modales cierran con `Escape` y restauran foco | Verificado. |
| `2.5.8 / RNF-05` Tamaño táctil | Botones estándar `>= 40–44 px`; controles POS (`btn-touch`, `pos-chip`, `touch-48`) `>= 48 px` | **0** fallos (`touchFailures: []`). |
| `2.3.3` Movimiento reducido | `@media (prefers-reduced-motion: reduce)` y `?capture=1` | Verificado. |
