# 🎨 Modernist Portfolio Design System

## Design Inspiration Analysis

Based on the clean Photography section design, here's our unified approach:

### 🎯 **Core Design Principles**

1. **Typography Hierarchy**
   - Large, bold section titles (text-4xl to text-6xl)
   - Clean, readable subtitles (text-lg)
   - Professional font weights (font-light to font-normal)

2. **Filter Tab System**
   - Green active state (#16a34a - green-600)
   - Clean outlined inactive states
   - Rounded pill styling
   - Subtle hover effects

3. **Layout & Spacing**
   - Generous white space
   - Left-aligned content for readability
   - Consistent container max-widths
   - Responsive grid systems

### 🛠 **Unified Components**

#### SectionHeader Component
```tsx
<SectionHeader
  title="Photography"
  subtitle="A collection of moments captured through my lens..."
  alignment="left" // or "center"
  className="mb-16"
/>
```

#### FilterTabs Component
```tsx
<FilterTabs
  categories={["All Photos", "Street", "Portrait", "Landscape", "Architecture"]}
  selectedCategory={selectedCategory}
  onCategoryChange={setSelectedCategory}
  activeColor="green" // or "primary" or "accent"
/>
```

### 🎨 **Color Palette**

- **Active Green**: `#16a34a` (green-600)
- **Text Primary**: Clean black/dark gray
- **Text Muted**: Light gray for descriptions
- **Backgrounds**: Pure white with subtle borders

### 📱 **Responsive Behavior**

- Mobile-first approach
- Flexible filter button wrapping
- Adaptive typography scaling
- Container padding adjustments

### 🌟 **Implementation Status**

✅ **Gallery Page**: Updated with unified header and green filter tabs
✅ **Blog Page**: Updated with consistent SectionHeader
✅ **Portfolio Page**: Updated with FilterTabs component
✅ **Component Library**: Created reusable SectionHeader and FilterTabs

### 🚀 **Usage Guidelines**

1. Always use SectionHeader for main page titles
2. Use FilterTabs for category filtering
3. Maintain green accent for photography-related sections
4. Keep typography hierarchy consistent
5. Use left-alignment for professional feel

### 🎭 **Animation & Interactions**

- Subtle hover effects on buttons
- Clean transitions (200-300ms)
- Scale hover effects (hover:scale-105)
- Smooth color transitions

This design system ensures consistency across all sections while maintaining the clean, professional aesthetic inspired by your Photography section design.
