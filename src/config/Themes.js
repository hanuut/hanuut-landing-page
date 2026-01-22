// Shared typography and layout values (Keep your existing settings)
const commonSettings = {
  // Typography
  fontxxxl: "clamp(2rem, 5vw, 3rem)",
  fontxxl: "clamp(1.5rem, 4vw, 2rem)",
  fontxl: "1.25rem",
  fontlg: "1rem",
  fontmd: "0.8rem",
  fontsm: "0.75rem",
  fontxs: "0.65rem",
  navSpacer: "5rem", // Should match navHeight
  navSpacerMobile: "4rem",
  
  // Layout
  navHeight: "5rem",
  navHeightMobile: "4rem",
  defaultRadius: "12px",
  bigRadius: "24px", // Added for the new Bento Grids
  smallRadius: "8px",
  actionButtonPadding: "1.25rem",
  actionButtonPaddingMobile: "0.8rem", // Added to prevent mobile breaking

  // Effects
  cardHoverEffect: "transform: translateY(-5px); box-shadow: 0 8px 20px rgba(0,0,0,0.07);",
  glassmorphism: "background-color: rgba(255, 255, 255, 0.45); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);",
};

// ---------------------------------------------------------
// 1. CUSTOMER THEME (The "Light" Theme - Green Dominant)
// ---------------------------------------------------------
export const light = {
  ...commonSettings,
  
  // --- EXISTING VARIABLES (DO NOT DELETE) ---\n  body: "#FDF4E3",              // Soft Ivory
  text: "#111217",              // Deep Charcoal
  textColor: "#111217",         
  textRgba: "17, 18, 23",
  
  primary: "#39A170",           // Hanuut Green
  primaryColor: "#39A170",      
  darkGreen: "#194435",         
  primaryRgba: "57, 161, 112",
  primaryLight: "#6ED3A3",
  
  secondary: "#397FF9",         // Electric Blue
  secondaryColor: "#397FF9",
  
  accent: "#F07A48",            // Sunset Coral (Orange)
  accentRgba: "240, 122, 72",   
  error: "#D9404D",
  
  surface: "rgba(255, 255, 255, 0.45)", 
  surfaceBorder: "rgba(0, 0, 0, 0.1)",

  // --- NEW GEMINI VARIABLES (Mapped for Light Mode) ---
  zinc950: "#09090b", 
  zinc900: "#18181b",
  zinc800: "#27272a",
  zinc500: "#71717a",
  zinc100: "#f4f4f5",

  beamColor: "#39A170", // Green beam for customers
  glassSurface: "rgba(255, 255, 255, 0.6)",
  glassBorder: "rgba(0, 0, 0, 0.1)",
};

// ---------------------------------------------------------
// 2. PARTNER THEME (The "Apple Dark" Theme)
// ---------------------------------------------------------
// Use this theme specifically for the /partners and Shop Landing Routes
export const partnerTheme = {
  ...commonSettings,

  // Backgrounds - Apple System Grey 6 (#1C1C1E) instead of #000000
  body: "#1C1C1E",              
  text: "#F2F2F7",              // System Grey 6 Text (Off-White)
  textColor: "#F2F2F7",
  textRgba: "242, 242, 247",
  secondaryText: "#8E8E93",     // System Grey

  // Brand Colors (Orange Dominant)
  primary: "#F07A48",           // Hanuut Orange
  primaryColor: "#F07A48",      
  darkGreen: "#1C1C1E",         // Replaced with background color
  primaryRgba: "240, 122, 72",
  primaryLight: "#FDBA74",      

  secondary: "#39A170",         // Green becomes the secondary accent
  secondaryColor: "#39A170",

  accent: "#397FF9",            // Blue accent
  accentRgba: "57, 127, 249",
  error: "#FF453A",             // Apple Red

  // Surface - System Grey 5 (#2C2C2E) for Cards
  surface: "#2C2C2E", 
  surfaceBorder: "rgba(255, 255, 255, 0.1)", 

  // Specific Variables for the "Premium" Look
  appleGlass: "backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%); background-color: rgba(28, 28, 30, 0.75);",
  
  // Gemini Specifics (Updated for Apple Dark)
  zinc950: "#1C1C1E", 
  zinc900: "#2C2C2E",
  zinc800: "#3A3A3C",
  zinc500: "#8E8E93",
  zinc100: "#F2F2F7",

  beamColor: "#F07A48", 
  glassSurface: "rgba(44, 44, 46, 0.6)", 
  glassBorder: "rgba(255, 255, 255, 0.1)",  
};