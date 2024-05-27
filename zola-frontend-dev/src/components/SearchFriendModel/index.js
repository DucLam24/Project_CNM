import {
  Avatar,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  Flex,
  Text,
  Box,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Icon } from "@iconify-icon/react";
import CustomAlert from "#/CustomAlert";
import { get, post } from "#/axios";

const SearchFriendModal = ({ isOpen, onClose, userList }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [alt, setAlt] = useState(false);
  const [mess, setMess] = useState("");
  const [statusMess, setStatusMess] = useState("info");

  useEffect(() => {
    if (userList.length > 0) {
      const results = userList.filter(
        (user) =>
          user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          user.status !== 1
      );
      setSearchResults(results);
    }
  }, [userList, searchTerm]);

  const handleSearch = () => {
    // Logic để tìm kiếm trong userList dựa trên searchTerm
    const results = userList.filter((user) =>
      user.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleAddFriend = async (id) => {
    const friendId = id;
    try {
      const response = await post("/contacts/send-request", { friendId });
      if (response.status === 201) {
        setAlt(true);
        setMess("Friend request sent successfully.");
        setStatusMess("success");
        setTimeout(() => {
          setAlt(false);
        }, 1000);
      } else if (response.status === 200) {
        setMess("Friend request is pending !");
        setStatusMess("info");
        setAlt(true);
        setTimeout(() => {
          setAlt(false);
        }, 1000);
      }
    } catch (error) {
      setAlt(true);
      setMess("send request fail !");
      setStatusMess("warning");
      setTimeout(() => {
        setAlt(false);
      }, 1000);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent style={{ maxHeight: "80vh" }}>
        <ModalHeader>Add new friend</ModalHeader>
        <Box px={5}>
          <Flex direction="row">
            <Input
              placeholder="Enter email or name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              mr={1}
            />
            <Button onClick={handleSearch}>
              <Icon icon="bytesize:search" style={{ color: "#fbf9f9" }} />
            </Button>
          </Flex>
        </Box>
        <ModalBody
          style={{ overflowY: "scroll", maxHeight: "calc(100vh - 200px)" }}
        >
          <hr style={{ marginTop: "10px", marginBottom: "10px" }} />
          {searchResults.map((user) => (
            <Box
              key={user.id}
              mt={4}
              p={2}
              borderRadius="lg"
              boxShadow="md"
              bg="white"
            >
              <Flex justify="space-between" align="center">
                <Box>
                  <Avatar
                    src={user?.photoUrl}
                    style={{
                      border: "1px solid #008080",
                      maxWidth: "48px",
                      maxHeight: "48px",
                    }}
                  />
                </Box>
                <Box flex="1" ml={2}>
                  <Text fontSize="lg" fontWeight="bold">
                    {user.displayName}
                  </Text>
                  <Text fontSize="sm" fontStyle="italic">
                    Email: {user.email}
                  </Text>
                </Box>
                <Button
                  onClick={() => handleAddFriend(user.id)}
                  bg="teal.500"
                  color="white"
                  _hover={{ bg: "teal.600" }}
                >
                  <Icon icon="iconoir:add-user" />
                </Button>
              </Flex>
            </Box>
          ))}
          <hr style={{ marginTop: "10px", marginBottom: "10px" }} />
        </ModalBody>
        <Box px={3} style={{ width: "100%", height: "55px" }}>
          {alt ? (
            <CustomAlert
              message={mess}
              status={statusMess}
              style={{
                position: "fixed",
                bottom: "10px",
                right: "10px",
                zIndex: "9999",
              }}
            />
          ) : null}
        </Box>
        <ModalFooter>
          <Button onClick={onClose}>Đóng</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SearchFriendModal;
