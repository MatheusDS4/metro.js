// third-party
import * as React from "react";
import { styled } from "styled-components";
import { Color } from "@hydroperx/color";
import gsap from "gsap";
import * as FloatingUI from "@floating-ui/dom";

// local
import { RTLContext } from "../layout/RTL";
import { Theme, ThemeContext } from "../theme/Theme";
import * as ColorUtils from "../utils/ColorUtils";
import * as MathUtils from "../utils/MathUtils";
import * as REMConvert from "../utils/REMConvert";
import { COMMON_DELAY, MAXIMUM_Z_INDEX } from "../utils/Constants";

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
        [
          "PopoverMenu",
          ...(rtl ? ["rtl"] : []),
          ...(params.className ?? "").split(" ").filter(p => p != ""),
        ].join(" ")
      }
      id={params.id}
      style={params.style}
      ref={div}
      $backgroundColor={theme.colors.inputBackground}
      $borderColor={theme.colors.inputBorder}
      $foreground={theme.colors.foreground}>

      <div className="PopoverMenu-up-arrow"></div>
      <div className="PopoverMenu-content">
        {params.children}
      </div>
      <div className="PopoverMenu-down-arrow"></div>
    </Div>
  );
}

const Div = styled.div<{
  $backgroundColor: string,
  $borderColor: string,
  $foreground: string,
}> `
  && {
    display: inline-flex;
    flex-direction: column;
    position: fixed;
    background: ${$ => $.$backgroundColor};
    border: 0.15rem solid ${$ => $.$borderColor};
    padding: ${REMConvert.pixels.remPlusUnit(6)} 0;
    min-width: 12rem;
    max-height: 30rem;
    left: 0;
    top: 0;
    z-index: ${MAXIMUM_Z_INDEX};
    visibility: hidden;
    opacity: 0;
  }

  && > .PopoverMenu-up-arrow,
  && > .PopoverMenu-down-arrow {
    display: none;
    color: ${$ => $.$foreground};
    flex-direction: row;
    justify-content: center;
    height: ${REMConvert.pixels.remPlusUnit(10)};
  }

  && > .PopoverMenu-content {
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    scrollbar-width: none;
    flex-grow: 3;
  }

  /* Item */
  && > .PopoverMenu-content > .Item {
    display: inline-flex;
    flex-direction: row;
    gap: 0.9rem;
    padding: 0.5rem 0.7rem;
    background: none;
    border: none;
    outline: none;
    color: ${$ => $.$foreground};
  }
  &&.rtl > .PopoverMenu-content > .Item {
    flex-direction: row-reverse;
  }
  && > .PopoverMenu-content > .Item:focus:not(:disabled),
  && > .PopoverMenu-content > .Item:active:not(:disabled) {
    background: ${$ => ColorUtils.contrast($.$backgroundColor, 0.4)};
    color: ${$ => $.$foreground};
  }
  && > .PopoverMenu-content > .Item:disabled {
    opacity: 0.5;
  }

  /* icon reserved space for an Item */
  && > .PopoverMenu-content > .Item > span:nth-child(1) {
    width: ${REMConvert.pixels.remPlusUnit(9)};
    height: ${REMConvert.pixels.remPlusUnit(9)};
  }

  /* label reserved space for an Item */
  &&.rtl > .PopoverMenu-content > .Item > .Label:nth-child(2) {
    text-align: right;
  }

  /* ending reserved space for an Item */
  && > .PopoverMenu-content > .Item > span:nth-child(3) {
    flex-grow: 4;
    font-size: 0.8rem;
    opacity: 0.6;
    min-width: ${REMConvert.pixels.remPlusUnit(9)};
    min-height: ${REMConvert.pixels.remPlusUnit(9)};
  }
  &&:not(.rtl) > .PopoverMenu-content > .Item > span:nth-child(3) {
    text-align: right;
    margin-left: 2rem;
  }
  &&.rtl > .PopoverMenu-content > .Item > span:nth-child(3) {
    text-align: left;
    margin-right: 2rem;
  }

  /* Indicator */
  && > .PopoverMenu-content > .Item > span:nth-child(3) > .Indicator {
    width: ${REMConvert.pixels.remPlusUnit(9)};
    height: ${REMConvert.pixels.remPlusUnit(9)};
  }

  /* Separator */
  && > .PopoverMenu-content > .Separator {
    padding: 0.45rem;
  }
`;