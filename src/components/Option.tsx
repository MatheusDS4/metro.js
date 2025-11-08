// third-party
import React from "react";

/**
 * Option inside a `ComboBox`.
 */
export function Option(params: {
  value: string,
  children?: React.ReactNode,
}): React.ReactNode {
  return (
    <div className="Option" data-value={params.value}>
      {params.children}
    </div>
  );
}