/**
 * Logical pixels conversion to cascading `em`.
 */
export const pixels = {
  /**
   * Returns a cascading `em` unit.
   */
  emPlusUnit(value: number): string {
    return pixels.em(value) + "em";
  },

  /**
   * Returns a cascading `em` unit's value.
   */
  em(value: number): number {
    return value * 0.0625;
  }
};