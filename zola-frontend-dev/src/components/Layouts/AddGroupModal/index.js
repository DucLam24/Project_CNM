import { useContext, useEffect, useRef, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Flex,
  Box,
  IconButton,
  Input,
  Stack,
  InputGroup,
  InputLeftElement,
  CheckboxGroup,
  Checkbox,
  Avatar,
  Text,
  Image,
  Button,
} from "@chakra-ui/react";
import { Icon } from "@iconify-icon/react";
import PropTypes from "prop-types";

import { get, patch, post } from "#/axios";

import { GlobalContext } from "#/contexts/GlobalContext";

const AddGroupModal = ({ isOpen, onClose }) => {
  const { setConversationId } = useContext(GlobalContext);
  const groupImageInputRef = useRef(null);
  const groupNameInputRef = useRef(null);

  const [friendList, setFriendList] = useState([]);
  const [userSearched, setUserSearched] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [avatarGroup, setAvatarGroup] = useState(null);
  const [avatarUrl, setAvatarURL] = useState(null);

  useEffect(() => {
    const fetchFriend = async () => {
      try {
        const response = await get("/contacts/get-friends-user");
        if (response.status === 200) {
          setFriendList(response.data);
          setUserSearched(response.data);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchFriend();
  }, []);

  useEffect(() => {
    let fileReader,
      isCancel = false;
    if (avatarGroup) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setAvatarURL(result);
        }
      };
      fileReader.readAsDataURL(avatarGroup);
    }
    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    };
  }, [avatarGroup]);

  const handleClickSelectImage = () => {
    groupImageInputRef.current.click();
  };

  const handlePickImage = (event) => {
    const _image = event.target.files[0];

    event.target.value = "";

    setAvatarGroup(_image);
  };

  const handleRemoveImage = () => {
    setAvatarGroup(null);
  };

  const handleLiveSearch = (event) => {
    const { value } = event?.target;

    if (!value.trim()) {
      setUserSearched([...friendList]);
      return;
    }

    const filteredData = friendList?.filter((item) => {
      if (
        item?.displayName.toLowerCase().includes(value?.toLowerCase()) ||
        item?.email.toLowerCase().includes(value?.toLowerCase())
      ) {
        return true;
      }
      return false;
    });
    setUserSearched(filteredData);
  };

  const handleSelectUser = (data) => {
    setGroupMembers(data);
  };

  const handleCreateGroup = async () => {
    const groupName = groupNameInputRef.current.value || "";

    const response = await post("/conversations", {
      participantIds: groupMembers,
      groupName,
    });

    const conversation = response.data;

    if (conversation && conversation?.id && avatarGroup) {
      const formData = new FormData();

      formData.append("avatar", avatarGroup);

      await patch(`/conversations/${conversation.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }

    setGroupMembers([]);
    setConversationId(conversation.id);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Group</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack gap={2}>
            <Flex gap={3}>
              <Box>
                {!avatarGroup ? (
                  <IconButton
                    variant="outline"
                    icon={
                      <Icon
                        style={{ fontSize: "20px" }}
                        icon="mdi:camera-outline"
                      />
                    }
                    borderRadius="100%"
                    onClick={handleClickSelectImage}
                  />
                ) : (
                  <Box position="relative" _hover={{ cursor: "pointer" }}>
                    <Icon
                      style={{
                        position: "absolute",
                        top: "0",
                        right: "0",
                        background: "white",
                        borderRadius: "100%",
                      }}
                      icon="carbon:close-outline"
                      onClick={handleRemoveImage}
                    />
                    <Box
                      width="40px"
                      height="40px"
                      borderRadius="100%"
                      overflow="hidden"
                      onClick={handleClickSelectImage}
                    >
                      <Image
                        src={avatarUrl}
                        width="100%"
                        aspectRatio={1}
                        objectFit="cover"
                      />
                    </Box>
                  </Box>
                )}
                <input
                  ref={groupImageInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  hidden={true}
                  onChange={handlePickImage}
                />
              </Box>
              <Box flex={1}>
                <Input
                  ref={groupNameInputRef}
                  variant="flushed"
                  placeholder="Enter group name"
                />
              </Box>
            </Flex>
            <Stack>
              <Box>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon icon="ic:twotone-search" />
                  </InputLeftElement>
                  <Input
                    placeholder="Enter name or email"
                    onChange={handleLiveSearch}
                  />
                </InputGroup>
              </Box>
              <Stack maxHeight="350px" overflowY="scroll" paddingX="5px">
                <CheckboxGroup colorScheme="teal" onChange={handleSelectUser}>
                  {userSearched.map((item, index) => (
                    <Checkbox key={index} value={item.id}>
                      <Box
                        padding="10px"
                        display="flex"
                        alignItems="center"
                        _hover={{
                          cursor: "pointer",
                        }}
                      >
                        <Avatar
                          size="sm"
                          src={item?.photoUrl ? item.photoUrl : ""}
                        />
                        <Box marginLeft="10px" flex={1}>
                          <Text>{item?.displayName}</Text>
                        </Box>
                      </Box>
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              </Stack>
            </Stack>
          </Stack>
        </ModalBody>
        <ModalFooter gap={2}>
          <Button variant="outline">Cancel</Button>
          <Button
            isDisabled={groupMembers.length < 2}
            onClick={handleCreateGroup}
          >
            Create group
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddGroupModal;

AddGroupModal.propTypes = {
  isOpen: PropTypes.bool,
  user: PropTypes.shape({
    id: PropTypes.string,
    displayName: PropTypes.string,
    photoUrl: PropTypes.string,
  }),
  onClose: PropTypes.func,
};

AddGroupModal.defaultProps = {
  isOpen: false,
  user: {},
  onClose: () => {},
};
