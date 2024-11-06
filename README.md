# Ocra

Fast, ultra-accurate text extraction from images and PDFs with structured markdown output.

## Features

- 🚀 Extracts text accurately from any image or PDF, even low quality ones
- 📝 Preserves formatting by outputting clean markdown
- 🎯 Handles tables, equations, handwriting or any other content with ease
- ⚡ Processes multiple pages quickly in parallel
- 🔄 Automatically retries failed extractions
- 🎨 Works with all common image formats
- ✍️ Recognizes any font or writing style

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
  - [macOS](#macos)
  - [Windows](#windows)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Input Sources](#input-sources)
- [API Reference](#api-reference)
- [Error Handling](#error-handling)
- [Used Models](#used-models)
- [Contributing](#contributing)

## Prerequisites

Ocra requires GraphicsMagick and Ghostscript to be installed on your system for PDF processing.

### macOS

```bash
brew install graphicsmagick ghostscript
```

### Windows

Download and install the following:

- [GraphicsMagick](http://www.graphicsmagick.org/)
- [Ghostscript](https://www.ghostscript.com/download/gsdnld.html)

## Installation

```bash
npm install ocra
```

## Quick Start

```typescript
import {Ocra} from 'ocra';

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

| Input Type     | Example                                                          |
| -------------- | ---------------------------------------------------------------- |
| File paths     | `'/path/to/image.jpg'`, `'C:\\Documents\\scan.pdf'`              |
| URLs           | `'https://example.com/image.png'`, `'https://files.com/doc.pdf'` |
| Base64 strings | `'data:image/jpeg;base64,/9j/4AAQSkZJRg...'`                     |
| Buffer objects | `Buffer.from(imageData)`, `fs.readFileSync('image.jpg')`         |

## API Reference

| Method              | Description                 | Parameters                                                                                             | Return Type             | Details                                                                                                    |
| ------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| `new Ocra(config)`  | Creates a new Ocra instance | `config`: Object containing:<br>- `provider`: OCR provider ('openai')<br>- `key`: API key for provider | `Ocra`                  | Initializes Ocra with specified provider and credentials                                                   |
| `ocra.image(input)` | Processes a single image    | `input`: File path, URL, base64 string, or Buffer                                                      | `Promise<ImageResult>`  | Returns object containing:<br>- `content`: Extracted text in markdown<br>- `metadata`: Processing metadata |
| `ocra.pdf(input)`   | Processes a PDF document    | `input`: File path, URL, base64 string, or Buffer                                                      | `Promise<PageResult[]>` | Returns array of results with:<br>- Page number<br>- Content<br>- Metadata                                 |

## Error Handling

Ocra includes built-in error handling with detailed error messages and automatic retries for transient failures.

```typescript
try {
  const result = await ocra.image('path/to/image.jpg');
} catch (error) {
  console.error('Processing failed:', error.message);
}
```

## Used Models

| Provider | Model       |
| -------- | ----------- |
| OpenAI   | gpt-4o-mini |

## Contributing

For guidelines on contributing, please read the [contributing guide](https://github.com/arshad-yaseen/ocra/blob/main/CONTRIBUTING.md).

We welcome contributions from the community to enhance Ocra's capabilities and make it even more powerful. ❤️
