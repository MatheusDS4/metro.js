// third-party
import * as React from "react";

/**
 * A context-dependent item component. Currently used
 * inside a `PopoverMenu`.
 */
export function Item(params: {
  /**
   * If the `Item` belongs to a `PopoverMenu`, indicates
   * whether it represents a sub-popover-menu.
   */
  submenu?: boolean,

  children?: React.ReactNode,
  className?: string,
  id?: string,
  style?: React.CSSProperties,
}): React.ReactNode {
  // div
  const div = React.useRef<null | HTMLDivElement>(null);

  return (
    <div
      className={
        ["Item", ...(params.className ?? "").split(" ").filter(c => c != "")].join(" ")
      }
      id={params.id}
      style={params.style}
      ref={div}
      data-submenu={params.submenu ? "true" : undefined}>

      {params.children}
    </div>
  );
}