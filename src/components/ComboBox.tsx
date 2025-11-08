// third-party
import assert from "assert";
import $ from "jquery";
import React from "react";
import { styled } from "styled-components";
import { Color } from "@hydroperx/color";
import { input } from "@hydroperx/inputaction";

// local
import { RTLContext } from "../layout/RTL";
import { Icon, NativeIcons } from "./Icon";
import { Theme, ThemeContext } from "../theme";
import * as ColorUtils from "../utils/ColorUtils";
import { MAXIMUM_Z_INDEX  } from "../utils/Constants";
import * as REMConvert from "../utils/REMConvert";
import { focusPrevSibling, focusNextSibling } from "../utils/FocusUtils";
import { REMObserver } from "../utils/REMObserver";
import * as StringUtils from "../utils/StringUtils";
import * as ComboBoxPlacement from "./combobox/ComboBoxPlacement";
import { ComboBoxEffect } from "./combobox/ComboBoxEffect";