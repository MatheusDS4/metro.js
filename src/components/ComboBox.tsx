// third-party
import assert from "assert";
import $ from "jquery";
import React from "react";
import { styled } from "styled-components";
import { Color } from "@hydroperx/color";
import { input } from "@hydroperx/inputaction";

// local
import * as ComboBoxPlacement from "./combobox/ComboBoxPlacement";
import { ComboBoxStatic } from "./combobox/ComboBoxStatic";
import { ComboBoxEffect } from "./combobox/ComboBoxEffect";
import { RTLContext } from "../layout/RTL";
import { Icon, NativeIcons } from "./Icon";
import { Theme, ThemeContext } from "../theme/Theme";
import * as ColorUtils from "../utils/ColorUtils";
import { focusPrevSibling, focusNextSibling } from "../utils/FocusUtils";
import * as StringUtils from "../utils/StringUtils";
import { MAXIMUM_Z_INDEX  } from "../utils/Constants";
import * as REMConvert from "../utils/REMConvert";
import { REMObserver } from "../utils/REMObserver";

/**
 * Represents an user input that opens a dropdown for
 * selecting one of multiple options.
 */
export function ComboBox(params: {
  id?: string,
  className?: string,
  children?: React.ReactNode,
  style?: React.CSSProperties,
  ref?: React.Ref<HTMLButtonElement>,

  /**
   * Default internal value matching one of the `Option`s inside.
   */
  default?: string,

  /**
   * Whether the input is disabled.
   */
  disabled?: boolean,

  /**
   * Whether the input button is light big.
   */
  big?: boolean,

  /**
   * Whether the input button is light medium.
   */
  medium?: boolean,

  /**
   * Event triggered on value change.
   */
  change?: (value: string) => void,

}): React.ReactNode {
  // bindings
  const combobox = React.useRef<null | HTMLButtonElement>(null);
  const dropdown = React.useRef<null | HTMLDivElement>(null);

  // global handlers
  const global_handlers = React.useRef<ComboBoxGlobalHandlers>({
    pointerDown: null,
    inputPressed: null,
    keyDown: null,
    wheel: null,
  });

  // handlers
  const change_handler = React.useRef<undefined | ((value: string) => void)>(undefined);

  // ?rtl
  const rtl = React.useContext(RTLContext);
  const rtl_sync = React.useRef(rtl);

  // initialization
  React.useEffect(() => {
    // handle external "_ComboBox_reflect" event
    function external_reflect(): void {
      // search for:
      //
      //   function reflect() {
      //
      // in old ComboBox
      fixme();
    }
    combobox.current!.addEventListener("_ComboBox_reflect", external_reflect);

    // cleanup
    return () => {
      combobox.current!.removeEventListener("_ComboBox_reflect", external_reflect);
      // dispose of global handlers
      dispose_global_handlers();
    };
  }, []);

  // sync `change` handler
  React.useEffect(() => {
    change_handler.current = params.change;
  }, [params.change]);

  // sync ?rtl
  React.useEffect(() => {
    rtl_sync.current = rtl;
  }, [rtl]);

  // register global event handlers used by the ComboBox.
  function register_global_handlers(): void {
    dispose_global_handlers();

    // handle pointer down anywhere the viewport
    global_handlers.current.pointerDown = global_pointer_down;
    window.addEventListener("pointerdown", global_handlers.current.pointerDown as any);

    // handle input pressed
    global_handlers.current.inputPressed = input_pressed;
    input.on("inputPressed", global_handlers.current.inputPressed as any);

    // handle key down
    global_handlers.current.keyDown = key_down;
    window.addEventListener("keydown", global_handlers.current.keyDown as any);

    // handle wheel
    global_handlers.current.wheel = global_wheel;
    window.addEventListener("wheel", global_handlers.current.wheel as any, { passive: false });
  }

  // unregister global event handlers used by the ComboBox.
  function dispose_global_handlers(): void {
    if (global_handlers.current.pointerDown) {
      window.removeEventListener("pointerdown", global_handlers.current.pointerDown as any);
    }
    if (global_handlers.current.inputPressed) {
      input.off("inputPressed", global_handlers.current.inputPressed as any);
    }
    if (global_handlers.current.keyDown) {
      window.removeEventListener("keydown", global_handlers.current.keyDown as any);
    }
    if (global_handlers.current.wheel) {
      window.removeEventListener("wheel", global_handlers.current.wheel as any);
    }
  }

  return (
    <>
      <ComboBoxButton
        id={params.id}
        className={[
          "ComboBox",
          ...(rtl ? ["rtl"] : []),
          ...(params.big ? ["ComboBox-big"] : []),
          ...(params.medium ? ["ComboBox-medium"] : []),
          ...(params.className ?? "").split(" ").filter(c => c != "")
        ].join(" ")}
        style={params.style}
        ref={val => {
          combobox.current = val;
          if (typeof params.ref == "function") {
            params.ref(val);
          } else if (params.ref) {
            params.ref.current = val;
          }
        }}
        disabled={params.disabled}>

        <div
          className="ComboBox-button-inner"
          dangerouslySetInnerHTML={{ __html: value_html }}>
        </div>

        <div className="ComboBox-button-arrow">
          <Icon type={NativeIcons.ARROW_DOWN} size={params.big ? 18 : 10.5}/>
        </div>
      </ComboBoxButton>
      <ComboBoxDropdown
        ref={dropdown}
        className={[
          ...[rtl ? ["rtl"] : []],
        ].join(" ")}>
        
        <div className="ComboBox-up-arrow">
          <Icon type={NativeIcons.ARROW_UP} size={7.5}/>
        </div>
        <div className="ComboBox-list">{params.children}</div>
        <div className="ComboBox-down-arrow">
          <Icon type={NativeIcons.ARROW_DOWN} size={7.5}/>
        </div>
      </ComboBoxDropdown>
    </>
  );
}

// style sheet
const ComboBoxButton = styled.button<{
  //
}> `
`;

// style sheet for the dropdown (sibling of the ComboBox button)
const ComboBoxDropdown = styled.div<{
  //
}> `
`;

type ComboBoxGlobalHandlers = {
  pointerDown: null | Function,
  inputPressed: null | Function,
  keyDown: null | Function,
  wheel: null | Function,
};