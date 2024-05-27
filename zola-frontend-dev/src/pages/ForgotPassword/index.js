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
  Input,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

import { post } from "#/axios";
import { authValidation } from "#/components/Form/validatePattern";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const onSubmit = async (payload) => {
    setLoading(true);
    try {
      const response = await post("/auth/forgot-password", payload).finally(() =>
        setLoading(false)
      );

      if (response?.status === 200) {
        setAlertMessage(response?.data?.message || "Password reset email sent successfully");
      }
    } catch (error) {
      const message = error?.response?.data?.error || "Something went wrong. Please try again later.";
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
          <Heading>Forgot Password</Heading>
          <Text>Enter your email to reset your password</Text>
        </Box>
        {alertMessage && (
          <Alert status="info">
            <AlertIcon />
            {alertMessage}
          </Alert>
        )}
        <Box marginTop="10px">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box marginBottom="20px">
              <Input
                placeholder="Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                borderRadius="10px"
                borderColor={errors.email ? "red.500" : "teal.500"}
                focusBorderColor="teal.500"
                _placeholder={{ color: "gray.400" }}
                autoFocus={true}
              />
              {errors.email && (
                <Text color="red.500">
                  {errors.email.message || "Invalid email address"}
                </Text>
              )}
            </Box>
            <Box textAlign="center">
              <Button type="submit" isLoading={loading}>
                Submit
              </Button>
            </Box>
          </form>
        </Box>
        <Box marginTop="20px" textAlign="center">
          <Text>
            Remembered your password?{" "}
            <Link as={ReactRouterLink} to="/login" color="teal.500">
              Log In
            </Link>
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
