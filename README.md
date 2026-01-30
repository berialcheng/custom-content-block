# Salesforce MCE Custom Content Block - Product Recommendations

A custom content block for Salesforce Marketing Cloud Engagement to display product recommendations in marketing emails.

## Features

- Product recommendation display (grid, list, carousel layouts)
- Custom header text
- Real-time preview
- Responsive design
- Vercel deployment ready

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:3000 to view the result.

## Deploy to Vercel

### Option 1: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Option 2: Via GitHub

1. Push code to GitHub
2. Import project in Vercel
3. Vercel will deploy automatically

## Configure in Marketing Cloud

1. **Create Installed Package**
   - Log in to Marketing Cloud Setup
   - Navigate to Platform Tools > Apps > Installed Packages
   - Create a new Package

2. **Add Custom Content Block Component**
   - Add a component to the Package
   - Select "Custom Content Block"
   - Configure Endpoint URL with your Vercel URL

3. **Update config.json**
   - Replace `{{YOUR_VERCEL_URL}}` in `public/config.json` with your actual URL
   - Replace `{{YOUR_APP_EXTENSION_KEY}}` with your App Extension Key

## Configuration

### config.json Parameters

| Parameter | Description |
|-----------|-------------|
| `customText` | Custom header text |
| `products` | Product array |
| `layout` | Layout type: grid/list/carousel |
| `maxProducts` | Maximum number of products to display |

### Product Data Structure

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "price": "number",
  "currency": "string",
  "imageUrl": "string",
  "productUrl": "string"
}
```

## Custom Product Data

To use real product data, modify `sampleProducts` in `src/lib/mce-sdk.ts` or integrate your product API.

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

## Tech Stack

- Next.js 16.1.2
- React 19.2.3
- TypeScript 5
- Tailwind CSS 4
- Salesforce MCE SDK (postmonger)
- Node.js >= 20

## License

MIT
