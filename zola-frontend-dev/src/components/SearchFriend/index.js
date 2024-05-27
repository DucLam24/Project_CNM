import { Box, Flex, Text, Button, Input, Avatar } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import SearchFriendModal from "../SearchFriendModel";
import { Icon } from "@iconify-icon/react";
import { get } from "#/axios";

const SearchFriend = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    getContacts();
  }, []);
  const getContacts = async () => {
    try {
      const response = await get("/contacts");
      if (response.status === 200) {
        setUserList(response.data);
      }
    } catch (error) {}
  };
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <Box w={30}>
      <Button onClick={handleOpenModal}>
        <Icon icon="fluent-mdl2:add-friend" />
      </Button>
      <SearchFriendModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        userList={userList}
      />
    </Box>
  );
};

export default SearchFriend;
