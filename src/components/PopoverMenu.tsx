// third-party
import * as React from "react";
import { styled } from "styled-components";
import gsap from "gsap";
import * as FloatingUI from "@floating-ui/dom";

// local
import { RTLContext } from "../layout/RTL";
import { Theme, ThemeContext } from "../theme/Theme";
import * as MathUtils from "../utils/MathUtils";
import * as REMConvert from "../utils/REMConvert";
import { COMMON_DELAY } from "../utils/Constants";

/**
 * Either a popover menu or a context menu.
 */
export function PopoverMenu(params: {
  children?: React.ReactNode,
  className?: string,
  style?: React.CSSProperties,
  id?: string,
}): React.ReactNode {
  // div
  const div = React.useRef<null | HTMLDivElement>(null);

  // ?rtl
  const rtl = React.useContext(RTLContext);

  // ?theme
  const theme = React.useContext(ThemeContext);

  return (
    <Div
      className={
        ["PopoverMenu", (params.className ?? "").split(" ").filter(p => p != "")].join(" ")
      }
      id={params.id}
      style={params.style}
      ref={div}>

      <div className="PopoverMenu-up-arrow"></div>
      <div className="PopoverMenu-content">
        {params.children}
      </div>
      <div className="PopoverMenu-down-arrow"></div>
    </Div>
  );
}

const Div = styled.div<{
  //
}> `

`;