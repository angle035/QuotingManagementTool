# React Quotes Manager

A React TypeScript single page application built with Ant Design for displaying and managing product quotes.

## Features

- **Quote Table Display**: Shows all quotes in a clean, professional table format
- **Inline Editing**: Edit Quote Date, First Cost, Retail Price, and Committed fields directly in the table
- **Expandable Rows**: Click the expand/collapse button to view detailed component material costing information
- **Local Storage Persistence**: All changes are automatically saved to browser's local storage
- **Visual Indicators**: Unsaved changes are highlighted with different background colors
- **Responsive Design**: Clean, professional UI that works on different screen sizes

## Table Columns

- **Expand/Collapse Control**: Toggle button to show/hide component material costing details
- **Item Name**: Product name
- **Item Description**: Detailed product description
- **Supplier**: Supplier company name
- **Quote Date**: Quote date in YYYY-MM-DD format (editable)
- **First Cost**: Product cost in USD (editable)
- **Retail Price**: Retail price in USD (editable)
- **Committed**: Whether the quote is committed (editable)
- **Actions**: Edit, Save, and Cancel buttons

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

```bash
npm run build
```

This builds the app for production to the `build` folder.

## Usage

1. **Viewing Quotes**: The table displays all quotes with pagination (10 quotes per page by default)
2. **Editing**: Click the "Edit" button in the Actions column to enable inline editing
3. **Saving Changes**: Click "Save" to persist changes to local storage
4. **Canceling Changes**: Click "Cancel" to discard unsaved changes
5. **Expanding Rows**: Click the arrow button in the Expand column to view component material costing details
6. **Visual Feedback**: 
   - Rows with unsaved changes have a light orange background
   - Rows being edited have a light blue background

## Data Source

The application uses the provided `QuoteData.json` file as the initial data source. All modifications are stored in the browser's local storage and will persist between sessions.

## Technologies Used

- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe JavaScript
- **Ant Design**: Professional UI component library
- **dayjs**: Lightweight date manipulation library
- **CSS3**: Custom styling for enhanced user experience
