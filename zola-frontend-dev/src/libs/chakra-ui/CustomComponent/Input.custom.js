import { inputAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys);

const baseStyle = definePartsStyle({
  field: {
    _focus: {
      borderColor: "teal !important",
      boxShadow: "0 0 2px teal !important",
    },
  },
});

export const InputTheme = defineMultiStyleConfig({
  baseStyle,
});
