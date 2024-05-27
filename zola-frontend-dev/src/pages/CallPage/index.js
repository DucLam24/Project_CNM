import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  ModalFooter,
  Button,
  Heading,
  Flex,
  Box,
  Input,
} from "@chakra-ui/react";
import Zego from "#/components/Zego";
function CallPage() {
  let { conversationId } = useParams();
  console.log("conversationId : ", conversationId);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    onOpen();
  }, [conversationId]);
  const handleCloseModal = () => {
    onClose();
    window.location.href = "/";
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleCloseModal} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <>
              <Zego />
            </>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCloseModal}>
              End call
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CallPage;
