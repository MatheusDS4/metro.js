// third-party
import React from "react";

// local
import { ComboBoxStatic } from "./combobox/ComboBoxStatic";
import { BUTTON_NAVIGABLE } from "../utils/Constants";

/**
 * Option inside a `ComboBox`.
 */
export function Option(params: {
  /**
   * Option's internal value.
   */
  value: string,

  className?: string,
  children?: React.ReactNode,
  style?: React.CSSProperties,
}): React.ReactNode {
  // button
  const button = React.useRef<null | HTMLButtonElement>(null);

  // value sync
  const value_sync = React.useRef<string>(params.value);

  // value sync
  React.useEffect(() => {
    value_sync.current = params.value;
  }, [params.value]);

  // update parent
  React.useEffect(() => {
    const p = button.current!.parentElement?.parentElement?.previousElementSibling;
    if (p?.classList.contains("ComboBox")) {
      p.dispatchEvent(new Event("_ComboBox_reflect"));
    }
  });

  // handle click
  function click(): void {
    const p = button.current!.parentElement;
    if (p?.classList.contains("ComboBox-list")) {
      if (Date.now() - ComboBoxStatic.cooldown < 50) {
        return;
      }
      ComboBoxStatic.change?.(value_sync.current);
      ComboBoxStatic.close?.();
    }
  }

  // handle pointer over
  function pointer_over(): void {
    const p = button.current!.parentElement?.parentElement?.previousElementSibling;

    // begin combo-box - pointer over
    if (p?.classList.contains("ComboBox")) {
      const last_button = parseInt(p!.getAttribute("data-last-button") ?? "0");

      // make sure to not focus option if pressed a button
      // too recently.
      if (Date.now() > last_button + 1_000) {
        button.current!.focus();
      }
      return;
    }
    // end combo-box - pointer over
  }

  return (
    <button
      className={["Option", BUTTON_NAVIGABLE, ...(params.className ?? "").split(" ").filter(c => c != "")].join(" ")}
      style={params.style}
      data-value={params.value}
      onClick={click}
      onPointerOver={pointer_over}
      ref={button}>

      {params.children}
    </button>
  );
}