# Documentation Extractor - Chrome Extension

## Overview
A simple Chrome extension that helps developers grab documentation content from web pages and either copy it to clipboard or save it as a file. Built with React, TypeScript, and Tailwind CSS.

## Core Features
1. Chrome toolbar icon that opens a popup
2. Two main actions:
   - Copy to clipboard button
   - Save as file button
3. Basic success/error notifications

## Technical Implementation

### Extension Structure
- Popup interface (React + Tailwind)
- Background script for Chrome extension functionality
- Content script to interact with web pages

### Main Components

1. **Popup UI**
   - Simple popup with two big buttons
   - Minimal styling with Tailwind
   - Basic loading/success/error states

2. **Content Extraction**
   - Focus on common documentation elements:
     - Main content area
     - Headers (h1-h6)
     - Code blocks
     - Lists
     - Tables
   - Remove obvious non-doc elements:
     - Navigation
     - Sidebars
     - Footers
     - Ads

3. **Export Options**
   - Clipboard: Plain text with basic markdown
   - File: Simple .md file download

### Tech Stack
- React (for popup UI)
- TypeScript
- Tailwind CSS
- Chrome Extension APIs
- Webpack (for building)

### MVP Approach
1. Get basic Chrome extension structure working
2. Build simple popup UI
3. Implement basic content extraction
4. Add copy to clipboard
5. Add file download
6. Basic error handling
7. Simple success notifications

### Future Enhancements (Post-MVP)
- Better content detection
- Format preservation
- Settings/options
- Multiple page support
- Custom extraction rules

## Development Priority
1. Get minimum viable version working
2. Test on common doc sites
3. Refine content extraction
4. Add polish and error handling

Keep everything simple and focused on the core functionality. No fancy features or complex configurations for the first version - just reliable content extraction with two clear actions.
