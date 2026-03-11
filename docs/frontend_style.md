# ToolSpace — Frontend Style Guide

## Design Philosophy

**Minimal · Clean · Functional**

ToolSpace follows a content-first, distraction-free design. Every element should serve a purpose. Whitespace is an active design element, not empty space.

---

## Color System

### Light Mode

| Token              | Value       | Usage                    |
| ------------------ | ----------- | ------------------------ |
| `--color-bg`       | `#ffffff`   | Page background          |
| `--color-surface`  | `#f8f9fa`   | Card / section bg        |
| `--color-border`   | `#e5e7eb`   | Borders, dividers        |
| `--color-text`     | `#111827`   | Primary text             |
| `--color-text-2`   | `#6b7280`   | Secondary / muted text   |
| `--color-primary`  | `#2563eb`   | Buttons, links, accents  |
| `--color-primary-hover` | `#1d4ed8` | Primary hover state   |
| `--color-success`  | `#16a34a`   | Success states           |
| `--color-error`    | `#dc2626`   | Error states             |

### Dark Mode

| Token              | Value       |
| ------------------ | ----------- |
| `--color-bg`       | `#0f172a`   |
| `--color-surface`  | `#1e293b`   |
| `--color-border`   | `#334155`   |
| `--color-text`     | `#f1f5f9`   |
| `--color-text-2`   | `#94a3b8`   |
| `--color-primary`  | `#3b82f6`   |
| `--color-primary-hover` | `#60a5fa` |

---

## Typography

- **Font Family**: `Inter`, system-ui fallback
- **Base Size**: `16px`
- **Scale**:
  - `h1`: 2rem / 700
  - `h2`: 1.5rem / 600
  - `h3`: 1.25rem / 600
  - `body`: 1rem / 400
  - `small`: 0.875rem / 400
- **Line Height**: 1.6 for body, 1.2 for headings

---

## Spacing

Use an 8px grid system:
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px
- `3xl`: 64px

---

## Border Radius

| Token       | Value  | Usage                      |
| ----------- | ------ | -------------------------- |
| `--radius-sm` | `6px`  | Small elements (tags)     |
| `--radius-md` | `10px` | Buttons, inputs           |
| `--radius-lg` | `16px` | Cards, containers         |
| `--radius-full` | `9999px` | Pills, avatars        |

---

## Shadows

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
```

---

## Component Patterns

### Buttons
- **Primary**: `bg: --color-primary`, white text, `radius-md`, subtle hover scale
- **Secondary**: `bg: transparent`, border, text color matches `--color-text`
- Height: 40px (default), 48px (large)
- Horizontal padding: 20px / 28px

### Input Fields
- Background: `--color-surface`
- Border: 1px `--color-border`
- Height: 44px
- Radius: `--radius-md`
- Focus: 2px ring `--color-primary` with 20% opacity

### Cards (Tool Cards)
- Background: `--color-surface`
- Border: 1px `--color-border`
- Radius: `--radius-lg`
- Padding: 24px
- Hover: lift with `--shadow-md` + subtle border color change

---

## Layout Rules

### Page Width
- Max content width: `1200px`
- Tool page content: `720px` centered
- Horizontal padding: 24px (mobile), 32px (desktop)

### Grid
- Tool list: CSS Grid, `repeat(auto-fill, minmax(280px, 1fr))`
- Gap: 24px

### Responsive Breakpoints
| Name   | Width   |
| ------ | ------- |
| `sm`   | 640px   |
| `md`   | 768px   |
| `lg`   | 1024px  |
| `xl`   | 1280px  |

---

## Accessibility
- Color contrast ratio ≥ 4.5:1 for text
- Focus-visible ring on all interactive elements
- Semantic HTML (`button`, `nav`, `main`, `footer`)
- All icons must have `aria-label`

---

## Ad Placements

Ad slots should blend with the layout. Avoid disrupting the tool usage flow.

| Placement         | Size         | Notes                              |
| ----------------- | ------------ | ---------------------------------- |
| Below header      | Leaderboard  | Homepage only                      |
| Tool page sidebar | Medium rect  | Desktop only, below instructions   |
| Below results     | Leaderboard  | After user completes an action     |
