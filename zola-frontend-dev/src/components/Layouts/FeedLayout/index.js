import { Box, Stack, useDimensions } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useRef } from "react";

const FeedLayout = ({ title, children, ...rest }) => {
  const elementRef = useRef(null);
  const dimensionTitle = useDimensions(elementRef, true);

  return (
    <Stack gap="0" {...rest}>
      <Box ref={elementRef} minHeight="56px" border="1px solid #e5e5e5">
        {title}
      </Box>
      <Box
        height={`calc(100% - ${
          dimensionTitle ? dimensionTitle?.borderBox.height : "56px"
        }px)`}
      >
        {children}
      </Box>
    </Stack>
  );
};

export default FeedLayout;

FeedLayout.propTypes = {
  title: PropTypes.node,
  children: PropTypes.node,
};

FeedLayout.defaultProps = {
  title: <></>,
  children: <></>,
};
