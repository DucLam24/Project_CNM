import { get, post } from "#/axios";
import {
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  InputGroup,
  InputLeftElement,
  Input,
  Stack,
  CheckboxGroup,
  Checkbox,
  Avatar,
  Text,
  ModalFooter,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { Icon } from "@iconify-icon/react";
import _ from "lodash";
import { useEffect, useState } from "react";

const AddUserGroup = ({ conversation, setConversation }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [friendList, setFriendList] = useState([]);
  const [userSearched, setUserSearched] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);

  useEffect(() => {
    const fetchFriend = async () => {
      try {
        const response = await get("/contacts/get-friends-user");
        if (response.status === 200) {
          const _friendList = response.data;
          const _groupMemberExistId = conversation.participants.map(
            ({ id }) => id
          );

          _.remove(
            _friendList,
            (item) => _groupMemberExistId.indexOf(item.id) >= 0
          );

          console.log(_friendList);

          setFriendList(_friendList);
          setUserSearched(_friendList);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchFriend();
  }, []);

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
    setSelectedUser(data);
  };

  const handleClickAddUser = async () => {
    const response = await post(
      `/conversations/${conversation.id}/group-member`,
      { participantIds: selectedUser }
    );
    const conversationAdded = response.data;

    setConversation(conversationAdded);
    onClose();
  };

  return (
    <>
      <IconButton
        icon={<Icon icon="fluent-mdl2:add-group" />}
        variant="ghost"
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Member</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box marginBottom="10px">
              <Box>
                <InputGroup>
                  <InputLeftElement pointerEvents={"none"}>
                    <Icon icon="radix-icons:magnifying-glass" />
                  </InputLeftElement>
                  <Input
                    placeholder="Enter name or email"
                    onChange={handleLiveSearch}
                  />
                </InputGroup>
              </Box>
            </Box>
            <Box>
              <Stack maxHeight="350px" padding="0 5px" overflowY="scroll">
                <CheckboxGroup colorScheme="teal" onChange={handleSelectUser}>
                  {userSearched.map((item, index) => (
                    <Checkbox value={item.id}>
                      <Box
                        key={index}
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
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button ml={3} onClick={handleClickAddUser}>
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddUserGroup;
