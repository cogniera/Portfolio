@AGENTS.md

# Design Layers 
Everything you make should have 3 layers , 
one for Desktop : 1200px , 1000px , 
one for Phone : 390px , 1000px , 
One for Tablet : 810px, 1000px

All the animations should be smooth , 
and the page should follow the Theme and style of the page 

# Color Palette — Neural Midnight (White + Purple)

## Core Colors

Background:     #FFFFFF  — primary page background, always white
Surface:        #F5F4F2  — cards, input fields, subtle section separation
Border:         #E8E7E4  — dividers, card outlines, input borders (0.5–1px)

Text primary:   #111111  — headings, body copy, all main text
Text secondary: #888888  — captions, placeholders, muted labels
Text hint:      #BBBBBB  — disabled states, timestamps

Accent:         #7F77DD  — primary CTA buttons, active states, links, highlights
Accent hover:   #534AB7  — button hover, focused inputs
Accent light:   #EEEDFE  — accent backgrounds, selected states, tag fills
Accent mid:     #AFA9EC  — accent borders, skill tag outlines

## Usage Rules

- Background + Text primary = 90% of the design
- Accent (#7F77DD) = max once per section, CTA buttons, active nav item
- Accent light (#EEEDFE) = tag backgrounds, hover surfaces, selected states
- Surface (#F5F4F2) = card backgrounds, code blocks, input backgrounds
- Never use colored section backgrounds — white throughout

## Semantic

Success:        #639922  — confirmation, completed states
Warning:        #BA7517  — caution badges, rate limits
Error:          #E24B4A  — form errors, destructive actions
Info:           #378ADD  — tooltips, informational callouts

## Typography Colors

Hero heading:   #111111  weight 700
Section label:  #7F77DD  weight 600  uppercase  letter-spacing 0.08em
Body text:      #111111  weight 400  line-height 1.7
Secondary text: #888888  weight 400
Code:           #534AB7  on #EEEDFE background

## CSS Variables

--color-bg:           #FFFFFF;
--color-surface:      #F5F4F2;
--color-border:       #E8E7E4;
--color-text:         #111111;
--color-text-muted:   #888888;
--color-accent:       #7F77DD;
--color-accent-hover: #534AB7;
--color-accent-light: #EEEDFE;
--color-accent-mid:   #AFA9EC;

## Minimalist Style Rules

These rules are non-negotiable. Follow them on every component and page.

### Layout
- White background on every section — never colored section backgrounds
- Section padding: 64px top/bottom on mobile, 128px on desktop
- Container max-width: 1200px, centered with auto margins
- All spacing values must come from this scale only:
  4px, 8px, 16px, 24px, 32px, 48px, 64px, 96px, 128px, 160px
- Never use arbitrary values like 17px, 23px, 37px

### Typography
- Font: Inter (primary), Space Grotesk (display headings only)
- Maximum 2 font families across the entire site
- Hero heading: 72–120px, weight 700, color #111111
- Section headings: 48–64px, weight 700, color #111111
- Section labels: 11–12px, weight 600, uppercase, letter-spacing 0.08em, color #7F77DD
- Body text: 16–18px, weight 400, line-height 1.7, color #111111
- Secondary text: 14px, weight 400, color #888888
- Body paragraphs max-width: 600px — never let text run full width

### Components
- Borders: always 0.5px solid #E8E7E4 — never thick borders
- Border radius: 8px for small elements, 12px for cards, 20px for large sections
- No box shadows — use borders and whitespace for separation instead
- No gradients anywhere — flat solid colors only
- No background images on sections — use whitespace and typography
- Buttons: transparent background, 0.5–1px border, text color #111111
  Primary CTA only: background #7F77DD, color #ffffff, no border
- Cards: background #F5F4F2, border 0.5px solid #E8E7E4, radius 12px, padding 24–32px

### Accent Color Rules
- #7F77DD appears maximum once per section
- Use only for: primary CTA button, active nav item, section labels, hover states
- Never use for decorative purposes or backgrounds (use #EEEDFE for backgrounds instead)
- Never combine accent with colored text on colored backgrounds

### Animation
- Duration: 300–500ms only — never slow dramatic animations
- Easing: ease-out or cubic-bezier(0.25, 0.46, 0.45, 0.94)
- Only animate: opacity, transform (translateY, translateX, scale)
- Never animate: color, background, width, height, padding, margin
- Scroll reveal: elements fade up 20px on enter, no other scroll animations unless explicitly requested
- Respect prefers-reduced-motion: wrap all animations in the media query

### What to Never Generate
- Gradient backgrounds or gradient text
- Multiple accent colors
- Colored section backgrounds
- Box shadows (except 0 0 0 Npx focus rings on inputs)
- More than 2 font families
- Spacing values outside the defined scale
- Thick borders (> 1px) except on featured/highlighted cards (max 1.5px)
- Decorative dividers, ornamental elements, or unnecessary flourishes
- Centered body text (left-align everything except hero headings)
- ALL CAPS headings (uppercase only on small labels with letter-spacing)

### What Minimalist Means Here
- Every element on screen must earn its place — if removing it doesn't break anything, remove it
- Whitespace is a design element — use more than feels comfortable
- One visual focal point per section — everything else is secondary
- The design should feel like it has been edited down, not built up
- When in doubt between adding and removing something — remove it