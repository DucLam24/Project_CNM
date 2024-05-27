import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react';
import React from 'react'

const ChangeLanguageModel = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chọn ngôn ngữ</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Đây là modal chọn ngôn ngữ</Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ChangeLanguageModel