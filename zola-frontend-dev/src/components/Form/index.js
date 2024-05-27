import React, { useEffect, useRef } from "react";
import { Box, Input, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";

const FormInput = React.forwardRef((props, ref) => {
  const { label, error, variant, ...inputProps } = props;

  return (
    <Box mb={5}>
      <Text mb="8px">{label}</Text>
      <Input
        ref={ref}
        autoCapitalize="none"
        variant={variant}
        isInvalid={error}
        {...inputProps}
      />
      <Text fontSize="sm" color="red.500">
        {error && error.message}
      </Text>
    </Box>
  );
});

const Form = ({
  validation,
  errors,
  children,
  register,
  setValue,
  onSubmit,
}) => {
  const inputRefs = useRef([]);

  useEffect(() => {
    (Array.isArray(children) ? [...children] : [children]).forEach((child) => {
      if (child.props.name) {
        register(child.props.name, validation[child.props.name]);
      }
    });
  }, [register, validation, children]);

  return (
    <>
      <form onSubmit={onSubmit}>
        {(Array.isArray(children) ? [...children] : [children]).map(
          (child, index) => {
            return child.props.name
              ? React.createElement(child.type, {
                  key: child.props.name,
                  ...{
                    ...child.props,
                    ref: (ref) => {
                      inputRefs.current[index] = ref;
                    },
                    error: errors[child.props.name],
                    onChange: (event) =>
                      setValue(
                        child.props.name,
                        event.target.value.trim(),
                        true
                      ),
                  },
                })
              : child;
          }
        )}
      </form>
    </>
  );
};

export default Form;
export { FormInput };

Form.propTypes = {
  validation: PropTypes.objectOf(PropTypes.any),
  errors: PropTypes.objectOf(PropTypes.any),
  children: PropTypes.node,
  register: PropTypes.func,
  setValue: PropTypes.func,
  onSubmit: PropTypes.func,
};

Form.defaultProps = {
  validation: {},
  errors: {},
  children: <></>,
  register: () => {},
  setValue: () => {},
  onSubmit: () => {},
};
