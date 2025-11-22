# YOUWARE.md

This file provides guidance to YOUWARE Agent (youware.com) when working with code in this repository.

## Project Overview

**xzTimes (PixAI)** is a commercial-grade AI Image Generation Platform prototype built with **Vue 3**, **TypeScript**, **Element Plus**, and **Tailwind CSS**. It features a **Modern Light / SaaS Theme** UI designed for clarity and ease of use, fully localized in Chinese.

## Tech Stack

- **Frontend Framework**: Vue 3 + Vite
- **UI Library**: Element Plus
- **Styling**: Tailwind CSS + clsx + tailwind-merge
- **Icons**: Lucide Vue Next
- **Routing**: Vue Router 4
- **State Management**: Vue Reactive Store (`src/store/favorites.ts`)

## Project Structure

```
src/
├── layouts/
│   ├── MainLayout.vue       # Public pages layout (Navbar + Footer)
│   ├── AuthLayout.vue       # Login/Register layout (Centered)
│   └── DashboardLayout.vue  # App layout (Collapsible Sidebar + Header)
├── pages/
│   ├── Home.vue             # Landing page (Showcase + Features)
│   ├── Login.vue            # Sign in page (Phone/Username)
│   ├── Register.vue         # Sign up page (Phone/Username + Confirm Password + CAPTCHA)
│   ├── Generate.vue         # Main AI generation workspace (Session-based History)
│   ├── UserCenter.vue       # User profile & Favorites management
│   └── Gallery.vue          # Public Gallery
├── components/
│   └── ui/                  # Reusable UI components
│       ├── GalleryCard.vue  # Unified gallery item card with hover actions
│       └── GalleryModal.vue # Unified detail modal for gallery items
├── assets/
│   └── logo.png             # Project Logo (xzTimes)
├── store/
│   └── favorites.ts         # LocalStorage-based favorites & folders store
└── lib/
    └── utils.ts             # Utility functions (cn)
```

## Key Features Implemented

1.  **AI Generator Workspace (`/generate`)**:
    -   **Unified Interface**: Merged Text-to-Image and Image-to-Image workflows.
    -   **Session History**: Right sidebar displays conversation sessions.
    -   **Chat Interface**: Main area renders full conversation history.
    -   **Reference Media**: Upload area with Image/Video toggle.
    -   **Amazon Suite Mode**: One-click setup for generating 6 product images.
    -   **Creative Tools**: Sidebar for Art Style, Aspect Ratio, and Count.
    -   **Lightbox**: Full-screen image preview.
    -   **Unified Gallery Sidebar**: Right sidebar includes a gallery tab using `GalleryCard`.

2.  **Public Gallery (`/gallery`)**:
    -   **Masonry Layout**: Responsive grid display using `GalleryCard`.
    -   **Detail Modal**: Unified `GalleryModal` with Favorite, Copy Prompt, and "Use as Reference" actions.

3.  **User Center (`/profile`)**:
    -   **Favorites Management**: View favorites, filter by folder (simplified).
    -   **Profile Editing**: Basic profile fields.

4.  **Authentication**:
    -   **Simplified Login**: Supports Phone/Username only.
    -   **Secure Register**: Includes Phone/Username, Password, Confirm Password, and CAPTCHA.

5.  **Layout**:
    -   **Collapsible Sidebar**: Dashboard sidebar can be collapsed.
    -   **Responsive Design**: Content areas adapt to sidebar states.
    -   **Navigation**: Top bar includes Home, Gallery, AI Generation, and Profile links.

## Development Commands

### Setup
```bash
npm install
```

### Development
Start the development server:
```bash
npm run dev
```

### Build
Build for production:
```bash
npm run build
```

### Linting
```bash
npm run lint
```

## Configuration
-   **Vite Config**: `vite.config.ts` (configured for Vue).
-   **Tailwind Config**: `tailwind.config.js` (standard configuration).
-   **TypeScript**: `tsconfig.json` & `tsconfig.app.json`.

## Future Roadmap
-   Integrate real backend API (Youware Backend).
-   Implement persistent state for history (currently mock).
-   Add video playback support in History.
