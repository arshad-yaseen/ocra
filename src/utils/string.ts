/**
 * Removes code block markers from text content.
 * Handles both language-specific (```language) and plain (```) code blocks.
 * @param text - The text content to process
 * @returns The text with code block markers removed
 */
export function removeCodeBlockMarkers(text: string): string {
  // Remove ```language and closing ```
  text = text.replace(/```[a-zA-Z0-9]*\n([\s\S]*?)```/g, '$1');

  // Remove plain ``` wrapping
  text = text.replace(/```\n([\s\S]*?)```/g, '$1');

  return text.trim();
}
