// third-party
import * as React from "react";

// local
import type { PopoverMenuOpenParams } from "./PopoverMenu";
import { RTLContext } from "../layout/RTL";
import { BUTTON_NAVIGABLE } from "../utils/Constants";

/**
 * A context-dependent item component. Currently used
 * inside a `PopoverMenu`.
 */
export function Item(params: {
  disabled?: boolean,

  children?: React.ReactNode,
  className?: string,
  id?: string,
  style?: React.CSSProperties,

  click?: React.MouseEventHandler<HTMLButtonElement>,
}): React.ReactNode {
  // button
  const button = React.useRef<null | HTMLButtonElement>(null);

  // timeouts
  const hover_timeout = React.useRef<number>(0);

  // handlers
  const click_handler = React.useRef(params.click);

  // ?rtl
  const rtl = React.useContext(RTLContext);
  const rtl_reference = React.useRef(rtl);

  // initialization
  React.useEffect(() => {
    //
  }, []);

  // sync click handler
  React.useEffect(() => {
    click_handler.current = params.click;
  }, [params.click]);

  // sync ?rtl
  React.useEffect(() => {
    rtl_reference.current = rtl;
  }, [rtl]);

  // handle click
  function click(e: React.MouseEvent<HTMLButtonElement>): void {
    // begin popover menu - click
    const parentPopoverMenu = get_parent_popover_menu();
    const popoverMenu = get_popover_menu();
    if (parentPopoverMenu) {
      button.current!.focus();
      // close other sibling menus
      for (const other of parentPopoverMenu!.children[1].children) {
        if (other === button.current!) {
          continue;
        }
        if (other.classList.contains("Item") && other.getAttribute("data-open") == "true") {
          other.removeAttribute("data-open");
          other.nextElementSibling!.dispatchEvent(new Event("_PopoverMenu_close"));
        }
      }
      // open submenu
      if (popoverMenu) {
        const p: PopoverMenuOpenParams = {
          reference: button.current!,
          prefer: rtl_reference.current ? "left" : "right",
        };
        button.current!.setAttribute("data-open", "true");
        popoverMenu.dispatchEvent(new CustomEvent("_PopoverMenu_open", {
          detail: p,
        }));
      // or close all PopoverMenus
      } else {
        // enumerate parent PopoverMenus (ascending order)
        const parents: HTMLDivElement[] = [parentPopoverMenu];
        let possibly_unrelated_parent = parentPopoverMenu.parentElement?.parentElement;
        for (; possibly_unrelated_parent;) {
          if (possibly_unrelated_parent.classList.contains("PopoverMenu")) {
            parents.splice(0, 0, possibly_unrelated_parent as HTMLDivElement);
          } else {
            break;
          }
          possibly_unrelated_parent = possibly_unrelated_parent.parentElement?.parentElement;
        }

        // close them
        parents[0].dispatchEvent(new Event("_PopoverMenu_close"));
      }
      params.click?.(e);
      return;
    }
    // end popover menu - click

    params.click?.(e);
  }

  // handle pointer over
  function pointer_over(e: React.PointerEvent<HTMLButtonElement>): void {
    // begin popover menu - pointer over
    const parentPopoverMenu = get_parent_popover_menu();
    const popoverMenu = get_popover_menu();
    if (parentPopoverMenu) {
      const last_button = parseInt(parentPopoverMenu!.getAttribute("data-last-button") ?? "0");

      // make sure to not focus/open item if pressed a button
      // too recently.
      if (Date.now() > last_button + 1_000) {
        button.current!.focus();

        // close other sibling menus
        for (const other of parentPopoverMenu!.children[1].children) {
          if (other === button.current!) {
            continue;
          }
          if (other.classList.contains("Item") && other.getAttribute("data-open") == "true") {
            other.removeAttribute("data-open");
            other.nextElementSibling!.dispatchEvent(new Event("_PopoverMenu_close"));
          }
        }
        if (popoverMenu) {
          hover_timeout.current = window.setTimeout(() => {
            hover_timeout.current = -1;
            const p: PopoverMenuOpenParams = {
              reference: button.current!,
              prefer: rtl_reference.current ? "left" : "right",
            };
            button.current!.setAttribute("data-open", "true");
            popoverMenu.dispatchEvent(new CustomEvent("_PopoverMenu_open", {
              detail: p,
            }));
          }, 250);
        }
      }
      return;
    }
    // end popover menu - pointer over
  }

  // handle pointer out
  function pointer_out(e: React.PointerEvent<HTMLButtonElement>): void {
    // begin popover menu - pointer out
    const parentPopoverMenu = get_parent_popover_menu();
    if (parentPopoverMenu) {
      if (hover_timeout.current != -1) {
        window.clearTimeout(hover_timeout.current);
        hover_timeout.current = -1;
      }
      return;
    }
    // end popover menu - pointer out
  }

  // returns the parent PopoverMenu if the case
  function get_parent_popover_menu(): null | HTMLDivElement {
    const el = button.current!.parentElement?.parentElement;
    if (el?.classList.contains("PopoverMenu")) {
      return (el ?? null) as null | HTMLDivElement;
    }
    return null;
  }

  // returns the nested PopoverMenu if the case
  function get_popover_menu(): null | HTMLDivElement {
    if (button.current!.nextElementSibling?.classList.contains("PopoverMenu")) {
      return button.current!.nextElementSibling! as HTMLDivElement;
    }
    return null;
  }

  return (
    <button
      className={
        ["Item", BUTTON_NAVIGABLE, ...(params.className ?? "").split(" ").filter(c => c != "")].join(" ")
      }
      id={params.id}
      style={params.style}
      disabled={params.disabled}
      onClick={click}
      onPointerOver={pointer_over}
      onPointerOut={pointer_out}
      ref={button}>

      {params.children}
    </button>
  );
}