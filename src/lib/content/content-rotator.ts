import type { ContentItem } from "@/types";

/**
 * Sequential content rotation manager.
 * Cycles through quotes in order: 1→2→3→...→N→1→2→...
 */
export class ContentRotator {
  private queue: ContentItem[];
  private index: number;

  constructor(items: ContentItem[]) {
    this.queue = [...items];
    this.index = 0;
  }

  next(): ContentItem {
    if (this.index >= this.queue.length) {
      this.index = 0;
    }
    return this.queue[this.index++];
  }

  setQueue(items: ContentItem[]) {
    this.queue = [...items];
    this.index = 0;
  }
}