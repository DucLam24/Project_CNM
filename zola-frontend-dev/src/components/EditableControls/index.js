import {
  useEditableControls,
  Flex,
  ButtonGroup,
  IconButton,
} from "@chakra-ui/react";
import { Icon } from "@iconify-icon/react";

const EditableControls = () => {
  const {
    isEditing,
    getSubmitButtonProps,
    getCancelButtonProps,
    getEditButtonProps,
  } = useEditableControls();

  return isEditing ? (
    <ButtonGroup justifyContent="center">
      <IconButton
        font="md"
        variant="ghost"
        icon={<Icon icon="bi:check" />}
        {...getSubmitButtonProps()}
      />
      <IconButton
        size="md"
        variant="ghost"
        icon={<Icon icon="iconamoon:close-fill" />}
        {...getCancelButtonProps()}
      />
    </ButtonGroup>
  ) : (
    <Flex position="absolute" justifyContent="center" top="0" right="-35px">
      <IconButton
        size="md"
        variant="unset"
        icon={<Icon icon="iconamoon:edit" />}
        {...getEditButtonProps()}
      />
    </Flex>
  );
};

export default EditableControls;
