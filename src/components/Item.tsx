// third-party
import * as React from "react";

/**
 * A context-dependent item component. Currently used
 * inside a `PopoverMenu`.
 */
export function Item(params: {
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
      ref={div}>

      {params.children}
    </div>
  );
}