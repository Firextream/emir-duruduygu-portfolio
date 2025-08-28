# Rectangular Architectural Design System

## Overview
This design system implements a **rectangular, architectural aesthetic** inspired by brutalist and modernist architecture. The system emphasizes sharp edges, geometric forms, and minimal ornamentation to create a sophisticated, professional appearance that mirrors the structural clarity of contemporary architectural photography.

## Design Philosophy

The rectangular design system draws inspiration from:
- **Brutalist Architecture**: Raw concrete forms with sharp edges
- **Modernist Buildings**: Clean lines and geometric precision  
- **Contemporary Photography**: Stark compositions and architectural framing
- **Minimalist Design**: Reduction to essential elements

## Core Principles

### 1. Rectangular Geometry
- **No rounded corners** - All elements use sharp, 90-degree angles
- **Architectural shadows** - Hard, offset shadows instead of soft blur effects
- **Strong borders** - 2px minimum border width for definition
- **Geometric forms** - Square and rectangular layouts throughout

### 2. Typography Hierarchy
- **Heading Font**: Work Sans (300-700 weights) - geometric sans-serif
- **Body Font**: Open Sans (400-600 weights) - highly legible
- **Line Height**: Generous spacing for readability (1.5-1.625)
- **Letter Spacing**: Wide tracking for headings, normal for body

### 3. Color Palette
- **Primary**: Near-black (#000) for maximum contrast
- **Accent**: Green (#16a34a) for interactive elements
- **Background**: Pure white (#fff) for clean canvas
- **Muted**: Light grays for secondary content
- **Borders**: Medium gray for definition without distraction

## Architectural CSS Framework

### Global Configuration
```css
.architectural-rectangular {
  --radius: 0rem; /* No rounded corners */
}

/* Override default rounded classes for rectangular design */
.rounded-lg,
.rounded-md,
.rounded-xl,
.rounded-2xl {
  border-radius: 0 !important;
}
```

### Shadows
```css
.architectural-shadow {
  box-shadow: 8px 8px 0px rgba(0, 0, 0, 0.1);
}

.architectural-shadow-dark {
  box-shadow: 8px 8px 0px rgba(0, 0, 0, 0.3);
}
```

### Borders
```css
.architectural-border {
  border: 2px solid hsl(var(--border));
}

.architectural-border-thick {
  border: 4px solid hsl(var(--border));
}
```

## Core Components

### SectionHeader
Clean, geometric page titles and introductions.

**Usage:**
```tsx
<SectionHeader 
  title="Gallery" 
  subtitle="A curated collection of architectural photography"
  alignment="left" 
/>
```

**Features:**
- Sharp typography hierarchy
- Consistent rectangular spacing
- Left or center alignment options
- No decorative elements - pure functionality

### FilterTabs  
Rectangular filter buttons with strong visual states.

**Usage:**
```tsx
<FilterTabs
  categories={["All", "Architecture", "Interior", "Landscape"]}
  selectedCategory={selectedCategory}
  onCategoryChange={setSelectedCategory}
  activeColor="green"
/>
```

**Features:**
- Sharp rectangular buttons (no rounded corners)
- Architectural shadow on active state
- Green accent color system
- Bold 2px borders for definition

## Component Implementation

### Blog Cards
```tsx
<article className="group bg-card border-2 border-border overflow-hidden hover:architectural-shadow transition-all duration-300">
```

**Design Elements:**
- Sharp rectangular containers
- 2px borders for strong definition
- Architectural shadow on hover
- No image scaling effects - static, architectural feel
- Clean typography hierarchy

### Gallery Images
- Clean rectangular frames
- No border radius on containers
- Sharp overlay elements  
- Strong geometric composition
- Architectural information overlays

### Navigation & Buttons
```tsx
<Button className="border-2 border-white/30 architectural-border hover:architectural-shadow">
```

**Design Elements:**
- Rectangular button shapes (no rounded corners)
- 2px minimum borders
- Architectural shadow states
- Sharp, defined hover effects
- Strong visual hierarchy

## Layout Principles

### Grid Systems
- **Sharp Alignments**: All elements align to strict grid
- **Rectangular Modules**: Components fit into rectangular containers
- **Geometric Spacing**: 8px base unit maintains proportion
- **Architectural Rhythm**: Consistent vertical and horizontal spacing

### Composition Rules
- **90-Degree Angles**: No diagonal or curved elements
- **Sharp Edges**: All containers and components have hard edges
- **Strong Hierarchy**: Clear visual weight through border thickness
- **Minimal Decoration**: Function over ornamentation

## Interactive Elements

### Hover States
- **Architectural Shadows**: Hard offset shadows instead of blur
- **Sharp Transitions**: Quick, precise state changes
- **Border Emphasis**: Thicker borders for active states
- **Color Blocks**: Solid color changes, no gradients

### Active States
- **Green Accent**: Strong green color for selected items
- **Hard Shadows**: Architectural shadow treatment
- **Bold Borders**: 2px+ borders for definition
- **Sharp Contrast**: Clear on/off visual states

## Responsive Behavior

### Mobile Adaptations
- Maintains rectangular aesthetic on all screen sizes
- Typography scales while preserving geometric character
- Component spacing adjusts maintaining architectural integrity
- Touch targets remain rectangular with adequate spacing

### Desktop Enhancements
- Larger architectural shadows for hover states
- More pronounced border treatments
- Enhanced geometric spacing
- Stronger visual hierarchy through scale

## Design Guidelines

### Do's
✅ Use sharp, 90-degree angles for all elements
✅ Apply 2px minimum borders for definition  
✅ Use architectural shadows for interactive states
✅ Maintain geometric spacing relationships
✅ Keep compositions clean and minimal

### Don'ts
❌ Never use rounded corners on containers
❌ Avoid soft shadows or blur effects
❌ Don't use decorative elements or ornaments
❌ Avoid diagonal lines or curved elements
❌ Don't use gradient backgrounds or effects

## Implementation Checklist

- [ ] Apply `architectural-rectangular` class to body
- [ ] Remove all `rounded-*` classes from components
- [ ] Update borders to minimum 2px thickness
- [ ] Replace soft shadows with architectural shadows
- [ ] Ensure all interactive elements use rectangular shapes
- [ ] Verify grid alignments maintain geometric precision
- [ ] Test responsive behavior maintains architectural integrity

This rectangular design system creates a cohesive, professional aesthetic that directly reflects the stark geometry and precision found in contemporary architectural photography and modernist building design.
