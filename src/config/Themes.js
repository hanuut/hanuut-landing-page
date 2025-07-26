export const light = {
  // ----------------- COLORS -----------------
  // Based on your new brand palette

  // Neutral Tones
  body: "#FDF4E3",              // Soft Ivory - Main page background
  text: "#111217",              // Deep Charcoal - Primary text for high contrast
  textRgba: "17, 18, 23",       // RGB for Deep Charcoal
  
  // Primary & Secondary
  primary: "#39A170",           // Hanuut Green - For key actions and branding
  primaryRgba: "57, 161, 112",  // RGB for Hanuut Green
  primaryLight: "#6ED3A3",      // Mint Breeze - Lighter shade for hover or active states
  secondary: "#397FF9",         //Electric Blue - For secondary actions or highlights
  
  // System Tones
  accent: "#F07A48",            // // Sunset Coral - For Call-to-action or special highlights
  accentRgba: "57, 127, 249",   // RGB for Electric Blue
  error: "#D9404D",             // Bold Red - For error messages or destructive actions
  
  // Surface Tones for UI Elements
  surface: "rgba(255, 255, 255, 0.45)", // A clean white with transparency for the glass effect
  surfaceBorder: "rgba(0, 0, 0, 0.1)", // A subtle, semi-transparent black for card borders

  // ----------------- TYPOGRAPHY -----------------
  // Hierarchical and responsive font scale
  fontxxxl: "clamp(2rem, 5vw, 3rem)",    // Page titles
  fontxxl: "clamp(1.5rem, 4vw, 2rem)",   // Section titles
  fontxl: "1.25rem",                      // Card titles
  fontlg: "1rem",                         // Body text, descriptions
  fontmd: "1rem",                         // Default body text
  fontsm: "0.875rem",                     // Captions, ingredients
  fontxs: "0.75rem",                      // Fine print

  // ----------------- LAYOUT & EFFECTS -----------------
  // Consistent spacing, sizing, and effects
  navHeight: "5rem",                      // Standard navigation bar height
  defaultRadius: "12px",                  // Modern, larger radius for containers
  smallRadius: "8px",                     // Radius for smaller elements like buttons/tags
  cardHoverEffect: "transform: translateY(-5px); box-shadow: 0 8px 20px rgba(0,0,0,0.07);",
  glassmorphism: "background-color: rgba(255, 255, 255, 0.45); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);",
};