import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react';
import React from 'react'

const DisplaySettingModel =  ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Thiết lập hiển thị</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Đây là modal thiết lập hiển thị</Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DisplaySettingModel