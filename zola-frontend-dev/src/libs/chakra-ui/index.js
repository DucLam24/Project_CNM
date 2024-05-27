import { extendTheme } from "@chakra-ui/react";

import { InputTheme } from "./CustomComponent/Input.custom";
import { ButtonTheme } from "./CustomComponent/Button.custom";

export const theme = extendTheme({
  components: {
    Input: InputTheme,
    Button: ButtonTheme,
  },
});
