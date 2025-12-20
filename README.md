# Weavy.ai Clone - LLM Workflow Builder

A pixel-perfect clone of Weavy.ai's workflow builder, focused on LLM workflows using React Flow and Google Gemini API.

## Features

- ✅ Pixel-perfect UI matching Weavy.ai
- ✅ Left sidebar with collapsible search and Quick Access
- ✅ React Flow canvas with dot grid background
- ✅ Three node types: Text, Image, and LLM
- ✅ Google Gemini API integration with vision support
- ✅ Undo/Redo functionality
- ✅ Workflow save/load/export/import
- ✅ Pre-built Product Listing Generator workflow
- ✅ Keyboard shortcuts (Delete, Undo/Redo)
- ✅ TypeScript strict mode
- ✅ Zod validation for API routes

## Tech Stack

- Next.js 16 (App Router)
- TypeScript (strict mode)
- React Flow
- Tailwind CSS
- Zustand (state management)
- Zod (API validation)
- @google/generative-ai (Gemini API)
- Lucide React (icons)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
# Add your GEMINI_API_KEY to .env.local
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

Deploy to Vercel:

1. Push your code to GitHub
2. Import project in Vercel
3. Add `GEMINI_API_KEY` to environment variables
4. Deploy!

## Usage

- Click node buttons in the sidebar to add nodes to the canvas
- Connect nodes by dragging from output handle to input handle
- Click "Run" on LLM nodes to execute
- Use keyboard shortcuts:
  - `Delete` / `Backspace`: Delete selected nodes/edges
  - `Ctrl+Z` / `Cmd+Z`: Undo
  - `Ctrl+Y` / `Cmd+Y`: Redo

## Project Structure

```
├── app/
│   ├── api/gemini/     # Gemini API route
│   ├── globals.css     # Global styles with Tailwind
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Main page
├── components/
│   ├── nodes/          # Node components
│   ├── Sidebar.tsx     # Left sidebar
│   ├── WorkflowCanvas.tsx
│   └── WorkflowBuilder.tsx
└── lib/
    └── store.ts         # Zustand store
```



