import { Alert, AlertIcon, AlertTitle } from '@chakra-ui/react';

const CustomAlert = ({ message, status }) => {
  return (
    <Alert status={status} variant="solid" rounded="md" shadow="md" animation="ease-out 0.5s">
      <AlertIcon />
      <AlertTitle mr={2}>{message}</AlertTitle>
    </Alert>
  )
};

export default CustomAlert;