# Common Components Documentation

## Overview
This document describes the common components and shared code used across the FLL History Hackers website.

## Shared Files

### 1. shared-styles.css
Contains all common styles including:
- CSS variables and theme colors
- Navigation header styles
- Mobile menu styles
- Animated background effects
- Loading spinner styles
- Typography and layout utilities
- Responsive design breakpoints
- Button styles
- Card and grid layouts
- Code block styles

### 2. shared-scripts.js
Contains all common JavaScript functionality:
- Mobile menu toggle functionality
- Header scroll effect (adds 'scrolled' class)
- Smooth scrolling for anchor links
- Copy to clipboard for code blocks
- Section collapse/expand functionality
- Loading animation fadeout
- Active nav link highlighting

## Common HTML Structure

### Navigation Header (Required on all pages)
```html
<header id="header">
    <nav>
        <a href="index.html" class="logo">
            <span>🏛️</span>
            <span>History Hackers #71494</span>
        </a>
        <ul class="nav-links" id="navLinks">
            <li><a href="index.html" class="nav-link">Home</a></li>
            <li><a href="missions.html" class="nav-link">Missions</a></li>
            <li><a href="pybricks_tutorial.html" class="nav-link">Tutorial</a></li>
            <li><a href="pybricks_cheatsheet.html" class="nav-link">Cheat Sheet</a></li>
        </ul>
        <button class="mobile-menu-toggle" id="mobileToggle" onclick="toggleMenu()">
            <span></span>
            <span></span>
            <span></span>
        </button>
    </nav>
</header>
```
Note: Add class="active" to the appropriate nav-link for the current page.

### Loading Spinner (Optional)
```html
<div class="loader">
    <div class="loader-spinner"></div>
</div>
```

### Animated Background (Optional)
```html
<div class="bg-animation"></div>
```

## Required Setup

### In `<head>` section:
```html
<link rel="stylesheet" href="shared-styles.css">
```

### Before closing `</body>`:
```html
<script src="shared-scripts.js"></script>
```

## Features Automatically Handled

1. **Mobile Menu**: Hamburger menu with slide-from-right animation
2. **Header Scroll Effect**: Header changes appearance when scrolling
3. **Smooth Scrolling**: All anchor links scroll smoothly
4. **Loading Animation**: Fades out after 1.5 seconds
5. **Active Navigation**: Current page is highlighted in nav
6. **Responsive Design**: Mobile-first approach with breakpoints

## Page-Specific Styles

Each page should only contain styles specific to its unique content. Common styles should be added to shared-styles.css.

## Best Practices

1. Always include shared-styles.css before page-specific styles
2. Always include shared-scripts.js at the end of the body
3. Use CSS variables defined in shared-styles.css for consistent theming
4. Don't duplicate common functionality - add it to shared files
5. Keep navigation structure consistent across all pages
6. Use semantic HTML and follow accessibility guidelines

## Theme Variables

Key CSS variables available:
- `--gold`: #ffd700
- `--gold-light`: #ffed4e
- `--gold-dark`: #ccaa00
- `--bg-dark`: #0a0a0a
- `--text`: #ffffff
- `--card`: rgba(255,255,255,0.02)
- `--border`: rgba(255,255,255,0.08)

## Responsive Breakpoints

- Mobile: max-width: 768px
- Tablet: max-width: 1024px
- Small mobile: max-width: 480px
- Large screens: min-width: 1440px
- Ultra-wide: min-width: 1920px