/**
 * Simple placement type.
 */
export type SimplePlacementType = "top" | "bottom" | "left" | "right";

/**
 * Ensures an element at the given position fits into the viewport,
 * returning a new position.
 */
export function fitViewport(
  element: HTMLElement,
  [x, y]: [number, number],
): [number, number] {
  const positioningRect = element.getBoundingClientRect();

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  x = x + positioningRect.width < viewportWidth ? x : x - positioningRect.width;
  x = x < 0 ? 0 : x;

  y =
    y + positioningRect.height < viewportHeight
      ? y
      : y - positioningRect.height;
  y = y < 0 ? 0 : y;

  return [x, y];
}

/**
 * Returns the placement type of a tooltip text. Looks for
 * one of the following prefixes:
 * 
 * - `<?top?>`
 * - `<?bottom?>`
 * - `<?left?>`
 * - `<?right?>`
 */
export function getTooltipPlacement(text: string): SimplePlacementType {
  const m = text.match(/^<\?(top|bottom|left|right)\?>/);
  if (m) {
    return m[1] as SimplePlacementType;
  }
  return "bottom";
}

/**
 * Returns a tooltip text without any placement prefix.
 */
export function skipTooltipPlacement(text: string): string {
  return text.replace(/^<\?(?:top|bottom|left|right)\?>/, "");
}