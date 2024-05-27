import { useState } from "react";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Button,
  Link,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import { post } from "#/axios";
import { authValidation } from "#/components/Form/validatePattern";

import Form, { FormInput } from "#/components/Form";

const Register = () => {
  const navigate = useNavigate();
  const {
    formState: { errors },
    register,
    setValue,
    handleSubmit,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const onSignUp = async (payload) => {
    setLoading(true);
    try {
      const response = await post("/auth/register", payload).finally(() =>
        setLoading(false)
      );
      if (response?.status === 200 || response?.status === 201)
        return navigate("/register-success");
    } catch (error) {
      const code = error?.response?.data?.error?.code;
      const message = code ? code.replace("-", " ") : "something went wrong!";

      setAlertMessage(message);
    }
  };

  return (
    <Box height="100%" display="flex">
      <Box
        width={{ base: "100%", sm: "450px", xl: "500px" }}
        margin="auto"
        padding="50px"
        border="1px solid #0000003b"
        borderRadius="15px"
        boxShadow="0 1px 0.5px #0000003b"
      >
        <Heading marginBottom="10px" textAlign="center">
          Create Your Account
        </Heading>
        {/* <Text textAlign="center">Hello! Log in with your email </Text> */}
        {alertMessage && (
          <Alert status="error">
            <AlertIcon />
            {alertMessage}
          </Alert>
        )}
        <Box marginTop="10px">
          <Form
            {...{
              validation: authValidation,
              errors,
              register,
              setValue,
              onSubmit: handleSubmit(onSignUp),
            }}
          >
            <FormInput name="username" label="Username" autoFocus={true} />
            <FormInput name="email" label="Email" />
            <FormInput name="password" label="Password" type="password" />
            <Box textAlign="center">
              <Button type="submit" isLoading={loading}>
                Sign Up
              </Button>
            </Box>
          </Form>
        </Box>
        <Box marginTop="20px" textAlign="center">
          <Text>
            Have an account?{" "}
            <Link as={ReactRouterLink} to="/login" color="teal.500">
              Log In
            </Link>
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
