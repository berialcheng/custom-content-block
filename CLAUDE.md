# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Salesforce Marketing Cloud Engagement (MCE) Custom Content Block for displaying product recommendations in marketing emails. The block is built with Next.js and designed for deployment on Vercel.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
npm start        # Start production server
```

## Architecture

### MCE SDK Integration (`src/lib/mce-sdk.ts`)
- `MCEBlockSDK` class wraps the postmonger messaging API for communication with Marketing Cloud
- Handles SDK initialization, data persistence, and content updates
- Falls back to sample data when running outside MCE (local development/preview mode)

### Core Components
- `ContentBlockEditor` (`src/components/ContentBlockEditor.tsx`): Main editor UI with edit/preview tabs. Manages block configuration state and auto-saves to MCE
- `ProductPreview` (`src/components/ProductPreview.tsx`): Renders product display in three layouts: grid, list, carousel

### Data Flow
1. MCE loads the block via iframe and initializes postmonger
2. `MCEBlockSDK.getData()` retrieves saved configuration from MCE
3. User edits trigger `MCEBlockSDK.setData()` and `setContent()` (email HTML)
4. `generateEmailHTML()` in ContentBlockEditor produces table-based email HTML

### Configuration (`public/config.json`)
MCE manifest file defining the content block. Before deployment:
- Replace `{{YOUR_VERCEL_URL}}` with actual deployment URL
- Replace `{{YOUR_APP_EXTENSION_KEY}}` with app extension key from MCE Installed Package

## Key Types

```typescript
interface ContentBlockData {
  customText: string;           // Header text
  products: Product[];          // Product array
  layout: 'grid' | 'list' | 'carousel';
  maxProducts: number;
}
```

## Path Alias

`@/*` maps to `./src/*` (configured in tsconfig.json)
