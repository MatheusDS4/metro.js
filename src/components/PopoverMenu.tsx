// third-party
import { ColorObserver } from "@hydroperx/color";
import * as React from "react";
import { styled } from "styled-components";
import gsap from "gsap";

// local
import { RTLContext } from "../layout/RTL";
import { Theme, ThemeContext } from "../theme/Theme";
import * as MathUtils from "../utils/MathUtils";
import * as REMConvert from "../utils/REMConvert";
import { EasingFunction } from "../enum";
import { COMMON_DELAY } from "../utils/Constants";