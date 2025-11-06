// third-party
import React from "react";

// local
import { Icon, NativeIcons } from "./Icon";
import { RTLContext } from "../layout/RTL";

/**
 * A context-dependent indicator icon. Currently used
 * inside a `PopoverMenu`'s submenu-representing `Item`,
 * inside the third child tag, as in:
 * 
 * ```
 * <Item>
 *     <span></span>
 *     <Label>More</Label>
 *     <span><Indicator/></span>
 *     <PopoverMenu>
 *         ...
 *     </PopoverMenu>
 * </Item>
 * ```
 */
export function Indicator() {
  // div
  const div = React.useRef<null | HTMLDivElement>(null);

  // indicator type
  const [indicator_type, set_indicator_type] = React.useState<string>("popoverMenu");

  // ?rtl
  const rtl = React.useContext(RTLContext);

  // initialization
  React.useEffect(() => {
    const div_el = div.current!;
    if (div_el.parentElement?.parentElement?.parentElement?.classList.contains("PopoverMenu")) {
      set_indicator_type("popoverMenu");
    }
  }, []);

  return (
    <div
      className="Indicator"
      ref={div}>

      {
        indicator_type == "popoverMenu" ?
          <Icon type={rtl ? NativeIcons.ARROW_LEFT : NativeIcons.ARROW_RIGHT}/> :
          undefined
      }
    </div>
  );
}