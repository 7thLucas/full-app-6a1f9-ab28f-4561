# Cafe Dash — Design Guidelines

## Color Palette
- **Primary:** Warm Orange `#FF7043` — energetic, food-forward
- **Secondary:** Golden Yellow `#FFC107` — cheerful, inviting
- **Accent:** Soft Teal `#26C6DA` — refreshing, balancing contrast
- **Background:** Cream White `#FFF8F0` — warm, welcoming base
- **Surface:** Light Peach `#FFE0CC` — soft card/panel backgrounds
- **Text Primary:** Dark Brown `#3E2723` — readable, warm
- **Text Secondary:** Medium Brown `#6D4C41` — secondary labels
- **Success:** Fresh Green `#66BB6A`
- **Warning:** Amber `#FFA726`
- **Error:** Coral Red `#EF5350`

## Typography
- **Display / Game Title:** Rounded bold sans-serif (e.g., Nunito ExtraBold or Fredoka One) — playful, big, readable
- **Body / UI Labels:** Nunito SemiBold — friendly and clear
- **Score / Numbers:** Tabular, bold, high contrast for quick readability

## Elevation & Depth
- Use soft drop shadows (`box-shadow: 0 4px 12px rgba(0,0,0,0.12)`) for cards and panels
- Slight border-radius on all interactive elements (12–16px) for a friendly, rounded feel
- Layered panels: background → table surface → order cards → HUD overlays

## Components & UI Patterns

### Buttons
- Large tap targets (min 48px height) for mobile friendliness
- Rounded pill shape (`border-radius: 999px`) for primary CTAs
- Filled primary buttons in Orange `#FF7043` with white text
- Ghost/secondary buttons in outlined Teal

### Cards / Order Tickets
- Rounded corners (16px)
- Light peach background with a warm border
- Icon + label layout for each item (clear visual language)
- Color-coded urgency: green (new) → yellow (mid) → red (urgent)

### HUD (Heads-Up Display)
- Top bar: Score, Timer, Lives/Stars
- Bottom bar: Prep station shortcuts
- Minimal and non-intrusive — game world should breathe

### Game World
- Top-down or isometric 2D view
- Bright, saturated table colors to distinguish seating areas
- Customer sprites: simple, expressive characters with emotion indicators (speech bubbles, emojis)
- Prep station icons clearly labeled

## Animation Principles (Apple HIG-inspired)
- Smooth transitions (ease-in-out, 200–300ms)
- Satisfying "pop" on successful delivery
- Gentle idle animations on customers waiting
- Avoid jarring or abrupt state changes

## Accessibility
- High contrast between text and backgrounds
- Tap targets no smaller than 44x44pt
- Avoid relying solely on color to communicate state (use icons + text)
