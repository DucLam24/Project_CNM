import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react';
import React from 'react'

const AboutModel = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Giới thiệu</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Đây là modal giới thiệt</Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AboutModel