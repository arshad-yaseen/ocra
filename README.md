# Ocra

Fast, ultra-accurate text extraction from images and PDFs with structured markdown output.

## Features

- 🚀 Exceptional text extraction from even the most challenging images and PDFs
- 🔍 Handles blurry, low-resolution, and poorly scanned documents with ease
- 📝 Structured markdown output that preserves original formatting
- 🎯 Accurately processes complex layouts, tables, equations, and handwritten text
- ⚡ Fast concurrent processing for multi-page documents
- 🔄 Built-in reliability with automatic retries and exponential backoff
- 🎨 Works with any image format, quality level, or scanning condition
- ✍️ Robust font recognition for any text style, from pristine print to messy handwriting

## Installation

```bash
npm install ocra
```

## Quick Start

```typescript
import {Ocra} from 'ocra';

// Initialize Ocra with your provider config
const ocra = new Ocra({
  provider: 'openai',
  key: 'your-api-key',
});

// Extract text from an image
const imageResult = await ocra.image('path/to/image.jpg');
console.log(imageResult.content);

// Process a PDF document
const pdfResults = await ocra.pdf('path/to/document.pdf');
pdfResults.forEach(page => {
  console.log(`Page ${page.page}:`, page.content);
});
```

## Input Sources

Ocra accepts multiple input formats:

- File paths: `'/path/to/image.jpg'`, `'C:\\Documents\\scan.pdf'`
- URLs: `'https://example.com/image.png'`, `'https://files.com/doc.pdf'`
- Base64 strings: `'data:image/jpeg;base64,/9j/4AAQSkZJRg...'`
- Buffer objects: `Buffer.from(imageData)`, `fs.readFileSync('image.jpg')`

## API Reference

### `new Ocra(config)`

Creates a new Ocra instance.

**Config Options:**

- `provider`: OCR provider ('openai')
- `key`: API key for the selected provider

### `ocra.image(input)`

Processes a single image.

**Returns:** `Promise<ImageResult>`

- `content`: Extracted text in markdown format
- `metadata`: Processing metadata

### `ocra.pdf(input)`

Processes a PDF document.

**Returns:** `Promise<PageResult[]>`

- Array of results for each page
- Each result includes page number, content, and metadata

## Error Handling

Ocra includes built-in error handling with detailed error messages and automatic retries for transient failures.

```typescript
try {
  const result = await ocra.image('path/to/image.jpg');
} catch (error) {
  console.error('Processing failed:', error.message);
}
```

## Contributing

For guidelines on contributing, please read the [contributing guide](https://github.com/arshad-yaseen/ocra/blob/main/CONTRIBUTING.md).

We welcome contributions from the community to enhance Ocra's capabilities and make it even more powerful. ❤️
