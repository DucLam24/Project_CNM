import CustomAlert from '#/CustomAlert';
import { get, post } from '#/axios';
import { Box, Flex, Text, Button, Input, Avatar } from '@chakra-ui/react'
import { Icon } from '@iconify-icon/react'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { GlobalContext } from '#/contexts/GlobalContext';
import { useNavigate } from "react-router-dom";
import SearchFriend from '#/components/SearchFriend';
import FriendModal from '#/components/FriendModal';

const ListFriend = () => {
  const [userList, setUserList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [data, setData] = useState([]);
  const [alt, setAlt] = useState(false);
  const [mess, setMess] = useState('');
  const [statusMess, setStatusMess] = useState('info');
  const navigate = useNavigate();
  const { setConversationId } = useContext(GlobalContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  useEffect(() => {
    getAllFriendUser();
  }, []);
  
  const getAllFriendUser = async () => {
    try {
      const response = await get("/contacts/get-friends");
      if (response.status === 200) {
        setData(response.data);
      }
    } catch (error) {
    }
  }

  const filteredData = data.filter(item => {
    if (
      item.friend.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.friend.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return true;
    }
    return false;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortBy === 'name') {
      return a.friend.displayName.localeCompare(b.friend.displayName);
    }
    return 0;
  });

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (type) => {
    setSortBy(type);
  };

  const handleGoChat = async (id) => {
    try {
      const response = await post("/conversations", {
        participantIds: [id],
      });

      if (response.status === 201) {
        setConversationId(response.data.id);
        return navigate("/");
      }
    } catch (error) { }

  };

  const handleRemoveFriend = async (id) => {
    try {
      const response = await post("/contacts/remove-friend", { id });
      if (response.status === 200) {
        setMess('Remove successfully !');
        setStatusMess('success');
        setAlt(true);
        setTimeout(() => {
          setAlt(false);
        }, 1000);
        getAllFriendUser();
      } else {
        setMess('Error remove friend !');
        setStatusMess('error');
        setAlt(true);
        setTimeout(() => {
          setAlt(false);
        }, 1000);
      }
    } catch (error) {
    }
  }

  const handleGetInfo = (item) => {
    setSelectedFriend(item.friend);
    setIsModalOpen(true);
  }
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div style={{ height: '100vh' }}>
      {/* header */}
      <Box style={{
        borderBottom: '1px solid gray'
      }}>
        <Flex align='center' h="60px" direction='row' color="black" p={5} justifyContent='space-between'>
          <Box display='flex'>
            <Icon icon="mingcute:contacts-line" width='40px' height='25px' />
            <Text>Friends list</Text>
          </Box>
          <Box>
            <SearchFriend />
          </Box>
        </Flex>
      </Box >

      <Box>
        <Flex align="center" h="60px" direction="row" color="black">
          <Icon icon="bytesize:search" style={{ color: '#fbf9f9' }} />
          <Input
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={handleSearchChange}
            ml={2}
            mr={4}
          />
          <Button
            variant={sortBy === 'time' ? 'solid' : 'outline'}
            onClick={() => handleSortChange('time')}
            mr={2}
          >Sort by time</Button>
          <Button
            variant={sortBy === 'name' ? 'solid' : 'outline'}
            onClick={() => handleSortChange('name')}
          >Sort by name</Button>
        </Flex>
      </Box>
      <Box>
        <hr style={{ width: '100%', height: 15 }} />
        <Text pl={5} as='b'>{`Friends(${sortedData.length})`}</Text>
        <hr style={{ width: '100%' }} />
      </Box>
      <Box overflowY="scroll" height="calc(100vh - 120px)">
        {sortedData.length <= 0 ?
          (<Box w='100%' p={5}>
            <Flex justifyContent='center' alignContent='center' >
              <Text textAlign='center'>Not exists new requirement !</Text>
            </Flex>
          </Box>) :
          (sortedData.map(item => (
            <Box bg='teal.20'>
              <Flex bg='teal.20' direction="row">
                <Box key={item.id} p={4} mt={4} borderRadius="lg" boxShadow="md" bg="white" w='100%'>
                  <Flex justifyContent='space-between' alignItems='center' mx={4} direction='row'>
                    <Box>
                      <Avatar src={item.friend.photoUrl} style={{ border: '1px solid #008080', maxWidth: '48px', maxHeight: '48px' }} />
                    </Box>
                    <Box flex="1" ml={2}>
                      <Text fontSize="lg" fontWeight="bold">{item.friend.displayName}</Text>
                      <Text fontSize="sm" fontStyle="italic">Email: {item.friend.email}</Text>
                    </Box>
                    <Flex>
                      <Button
                        aria-label="info"
                        colorScheme="blue"
                        onClick={() => handleGetInfo(item)}
                        mr={2}
                      >info</Button>
                      <Button
                        aria-label="Chat"
                        colorScheme="teal"
                        onClick={() => handleGoChat(item.friendId)}
                        mr={2}
                      >Chat</Button>
                      <Button
                        aria-label="Delete Friend"
                        colorScheme="gray"
                        onClick={() => handleRemoveFriend(item.id)}
                      >Remove</Button>
                    </Flex>
                  </Flex>
                </Box>

              </Flex>
            </Box>
          )))
        }
        <FriendModal isOpen={isModalOpen} onClose={handleCloseModal} friend={selectedFriend} />
        <Box px={3}
          style={{
            width: "100%",
            height: '55px',
            position: 'fixed',
            bottom: 0,
            right: '10px',
            zIndex: '9999'
          }}>
          {alt ? (<CustomAlert message={mess} status={statusMess} style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: '9999' }} />) : null}
        </Box>
      </Box>
    </div >
  )
}

export default ListFriend