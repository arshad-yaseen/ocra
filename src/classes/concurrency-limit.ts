/**
 * Controls the maximum number of concurrent asynchronous operations.
 */
export class ConcurrencyLimit {
  private running = 0;
  private queue: Array<() => void> = [];

  /**
   * @param maxConcurrent - Maximum number of concurrent operations.
   */
  constructor(private maxConcurrent: number) {}

  private async acquire(): Promise<void> {
    if (this.running < this.maxConcurrent) {
      this.running++;
      return;
    }
    await new Promise<void>(resolve => this.queue.push(resolve));
  }

  private release(): void {
    this.running--;
    if (this.queue.length > 0) {
      this.running++;
      const next = this.queue.shift();
      next && next();
    }
  }

  /**
   * Runs an asynchronous function with concurrency control.
   * @param fn - The function to run.
   * @returns The result of the function.
   */
  async run<T>(fn: () => Promise<T>): Promise<T> {
    await this.acquire();
    try {
      return await fn();
    } finally {
      this.release();
    }
  }
}
