import React, { useEffect, useState } from "react";
import { useNavigate, Link as ReactRouterLink } from "react-router-dom";
import { Box, Heading, Text, Link } from "@chakra-ui/react";

import RegisterSuccessSVG from "#/assets/images/RegisterSuccess.svg";
import successEle from "#/assets/images/successEle.svg";
import successEle2 from "#/assets/images/successEle2.svg";

export default function RegisterSuccess() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(15);

  //More effiecient way to handle countdown, Tks to @KaitoHasei for the suggestion :))))
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setCountdown((prevTime) => {
        if (prevTime === 0) {
          clearInterval(timerInterval);
          navigate("/login");
          return 0;
        } else {
          return prevTime - 1;
        }
      });
    }, 1000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(timerInterval);
  }, []);

  return (
    <Box
      position="relative"
      display="flex"
      width="100%"
      height="100vh"
      flexDirection="row"
      padding="5rem"
    >
      <Box
        width="50%"
        height="100%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Heading
          as="h1"
          size="3xl"
          mb="4"
          textTransform="uppercase"
          color="teal"
        >
          Account Created Successfully
        </Heading>
        <Heading as="h3" size="lg" mb="4" display="flex" flexDirection="row">
          Redirecting to login page in&nbsp;
          <Box color="teal"> {countdown} </Box>
          &nbsp;seconds
        </Heading>
        <Text mb="4">Please check your email to verify your account</Text>
        <Text mb="4">
          If you are not redirected, click{" "}
          <Link as={ReactRouterLink} to="/login" color="teal.500">
            here
          </Link>
        </Text>
      </Box>
      <Box
        width="50%"
        height="100%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <img src={RegisterSuccessSVG} alt="Register Success" />
      </Box>
      <img
        style={{
          top: 0,
          left: 0,
          position: "absolute",
          zIndex: -1,
          width: "30%",
          height: "auto",
        }}
        src={successEle2}
        alt="top left"
      />
      <img
        style={{
          bottom: 0,
          left: 0,
          position: "absolute",
          zIndex: -1,
          width: "30%",
          height: "auto",
        }}
        src={successEle}
        alt="bottom left"
      />
    </Box>
  );
}
