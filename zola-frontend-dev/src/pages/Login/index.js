import { useContext, useState } from "react";
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

import { GlobalContext } from "#/contexts/GlobalContext";
import Form, { FormInput } from "#/components/Form";

const Login = () => {
  const navigate = useNavigate();
  const {
    formState: { errors },
    register,
    setValue,
    handleSubmit,
  } = useForm();
  const { logIn } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const onSignIn = async (payload) => {
    setLoading(true);
    try {
      const response = await post("/auth/login", payload).finally(() =>
        setLoading(false)
      );

      if (response?.status === 200) {
        logIn(response?.data["access_token"]);
        return navigate("/");
      }
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
        <Box marginBottom="10px" textAlign="center">
          <Heading>Login</Heading>
          <Text>Hello! Log in with your email </Text>
        </Box>
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
              onSubmit: handleSubmit(onSignIn),
            }}
          >
            <FormInput name="email" label="Email" autoFocus={true} />
            <FormInput name="password" label="Password" type="password" />
            <Box textAlign="center">
              <Button type="submit" isLoading={loading}>
                Sign In
              </Button>
            </Box>
          </Form>
        </Box>
        <Box marginTop="20px" textAlign="center">
          <Text>
            Don&apos;t have an account?{" "}
            <Link as={ReactRouterLink} to="/register" color="teal.500">
              Sign Up
            </Link>
          </Text>
        </Box>
        <Box marginTop="20px" textAlign="center">
          <Text>
            <Link as={ReactRouterLink} to="/forgot-password" color="teal.500">
              Forgot passwod !
            </Link>
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
