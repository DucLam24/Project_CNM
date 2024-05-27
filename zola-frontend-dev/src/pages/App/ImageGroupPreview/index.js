const {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Image,
  ModalHeader,
  Box,
} = require("@chakra-ui/react");

const ImageGroupPreview = ({ isOpen, url, onClose, onClickUpdate }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader />
        <ModalCloseButton />
        <ModalBody>
          <Image aspectRatio={1} borderRadius="100%" src={url} />
        </ModalBody>
        <ModalFooter gap={2}>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClickUpdate}>Update</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ImageGroupPreview;
