/**
 * Performs a fetch request with a timeout.
 * @param url - The URL to fetch.
 * @param options - Fetch options.
 * @param timeout - Timeout in milliseconds.
 * @returns The fetch response.
 * @throws If the request times out.
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}
