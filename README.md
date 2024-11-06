# OcrLLM

Fast, ultra-accurate text extraction from any image or PDF—including challenging ones—with structured markdown output powered by vision models.

## Features

- 🚀 Extracts text from any image or PDF, even super low-quality ones
- 📝 Outputs clean markdown
- 🎯 Handles tables, equations, handwriting, complex layouts, etc.
- ⚡ Processes multiple pages in parallel
- 🔄 Retries failed extractions
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

OcrLLM requires GraphicsMagick and Ghostscript for PDF processing. These dependencies will attempt to install automatically after you install the package. However, if automatic installation fails, you may need to install them manually:

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
npm install ocr-llm
```

## Quick Start

```typescript
import {OcrLLM} from 'ocr-llm';

const ocrllm = new OcrLLM({
  provider: 'openai',
  key: 'your-api-key',
});

// Extract text from an image
const imageResult = await ocrllm.image('path/to/image.jpg');
console.log(imageResult.content);

// Process a PDF document
const pdfResults = await ocrllm.pdf('path/to/document.pdf');
pdfResults.forEach(page => {
  console.log(`Page ${page.page}:`, page.content);
});
```

## Input Sources

OcrLLM accepts multiple input formats:

| Input Type     | Example                                                          |
| -------------- | ---------------------------------------------------------------- |
| File paths     | `'/path/to/image.jpg'`, `'C:\\Documents\\scan.pdf'`              |
| URLs           | `'https://example.com/image.png'`, `'https://files.com/doc.pdf'` |
| Base64 strings | `'data:image/jpeg;base64,/9j/4AAQSkZJRg...'`                     |
| Buffer objects | `Buffer.from(imageData)`, `fs.readFileSync('image.jpg')`         |

## API Reference

| Method                | Description                   | Parameters                                                                                             | Return Type             | Details                                                                                                    |
| --------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| `new OcrLLM(config)`  | Creates a new OcrLLM instance | `config`: Object containing:<br>- `provider`: OCR provider ('openai')<br>- `key`: API key for provider | `OcrLLM`                | Initializes OcrLLM with specified provider and credentials                                                 |
| `ocrllm.image(input)` | Processes a single image      | `input`: File path, URL, base64 string, or Buffer                                                      | `Promise<ImageResult>`  | Returns object containing:<br>- `content`: Extracted text in markdown<br>- `metadata`: Processing metadata |
| `ocrllm.pdf(input)`   | Processes a PDF document      | `input`: File path, URL, base64 string, or Buffer                                                      | `Promise<PageResult[]>` | Returns array of results with:<br>- Page number<br>- Content<br>- Metadata                                 |

## Error Handling

OcrLLM includes built-in error handling with detailed error messages and automatic retries for transient failures.

```typescript
try {
  const result = await ocrllm.image('path/to/image.jpg');
} catch (error) {
  console.error('Processing failed:', error.message);
}
```

## Used Models

| Provider | Model       | Description                                                                                       |
| -------- | ----------- | ------------------------------------------------------------------------------------------------- |
| OpenAI   | gpt-4o-mini | High-performance model optimized for efficient text extraction with excellent accuracy and speed. |

## Contributing

For guidelines on contributing, please read the [contributing guide](https://github.com/arshad-yaseen/ocr-llm/blob/main/CONTRIBUTING.md).

We welcome contributions from the community to enhance OcrLLM's capabilities and make it even more powerful. ❤️
