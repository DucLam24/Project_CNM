import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  VStack,
  Box,
  Text,
  HStack,
  Button,
  StackDivider,
  Avatar,
  Image,
  Grid,
  GridItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
  AvatarGroup,
  IconButton,
  Editable,
  EditablePreview,
  Input,
  EditableInput,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { Icon } from "@iconify-icon/react";
import { del, get, patch, put } from "#/axios";
import ConversationAvatar from "#/components/Conversation/ConversationAvatar";
import ImageGroupPreview from "../ImageGroupPreview";
import EditableControls from "#/components/EditableControls";
import _ from "lodash";
import AddUserGroup from "./AddUserGroup";
const ConversationInfo = ({
  user,
  conversation,
  getConversationAvatar,
  formatConversationName,
  conversationId,
  setConversation,
}) => {
  const inputGroupImageRef = useRef(null);

  const [activeView, setActiveView] = useState("default");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const handleViewChange = (view) => {
    setActiveView(view);
  };
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const {
    isOpen: isImageGroupPreivewOpen,
    onOpen: onOpenImageGroupPreview,
    onClose: onCloseImageGroupPreview,
  } = useDisclosure();

  const [images, setImages] = useState([]);
  const [avatarGroup, setAvatarGroup] = useState(null);
  const [avatarGroupUrl, setAvatarGroupUrl] = useState(null);

  useEffect(() => {
    if (activeView === "media" && conversationId) {
      const fetchImages = async () => {
        try {
          const response = await get(`/conversations/${conversationId}/images`);
          const uniqueImages = Array.from(new Set(response.data));
          setImages(uniqueImages);
        } catch (error) {
          console.error("Error fetching images:", error);
        }
      };

      fetchImages();
    }
  }, [conversationId, activeView, isMinimized]);

  useEffect(() => {
    let fileReader,
      isCancel = false;
    if (avatarGroup) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setAvatarGroupUrl(result);
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

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    onOpen();
  };

  const handleUpdateGroupImage = () => {
    if (!conversation.isGroup || conversation.groupOwner !== user.id) return;

    inputGroupImageRef.current.click();
  };

  const handlePickImage = (event) => {
    const _image = event.target.files[0];

    event.target.value = "";

    setAvatarGroup(_image);
    onOpenImageGroupPreview();
  };

  const handleClickUpdate = async () => {
    if (!avatarGroup) return;

    const formData = new FormData();

    formData.append("avatar", avatarGroup);

    const response = await patch(
      `/conversations/${conversation.id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setConversation(response.data);
    onCloseImageGroupPreview();
  };

  const handleEditName = async (data) => {
    if (!data.trim() || data.trim() === conversation.groupName) return;

    const response = await put(`/conversations/${conversation.id}`, {
      groupName: data,
    });

    setConversation(response.data);
  };

  const handleRemoveMember = async (item) => {
    if (_.isEmpty(item)) return;

    try {
      const response = await del(
        `/conversations/${conversationId}/group-member/${item?.id}`
      );
      const data = response.data;

      setConversation(data);
    } catch (error) {
      console.log(error);
    }
  };

  const renderEditName = useMemo(() => {
    const conversationName = formatConversationName(conversation, user.id);

    return (
      <Editable
        key={user?.id}
        // textAlign="center"
        defaultValue={conversationName}
        // fontSize="2xl"
        isPreviewFocusable={false}
        submitOnBlur={false}
        onSubmit={handleEditName}
      >
        <Box textAlign="center" position="relative">
          <EditablePreview />
          {/* Here is the custom input */}
          <Input as={EditableInput} padding="10px" />
          <EditableControls />
        </Box>
      </Editable>
    );
  }, [user, handleEditName]);

  const renderMediaView = () => {
    return (
      <Box width="100%" maxH="90vh" overflowY="auto">
        <Grid
          maxWidth={{ lg: "350px", xl: "400px" }}
          templateColumns="repeat(3, 1fr)"
          gap="3px"
        >
          {images.map((imageUrl, index) => (
            <GridItem
              key={index}
              width="100%"
              aspectRatio={1}
              overflow="hidden"
              cursor="pointer"
              onClick={() => handleImageClick(imageUrl)}
            >
              <Image
                src={imageUrl}
                alt={`Media ${index}`}
                objectFit="cover"
                width="100%"
                height="100%"
              />
            </GridItem>
          ))}
        </Grid>
      </Box>
    );
  };
  const renderConversationInfo = useMemo(() => {
    return (
      <VStack
        key={isMinimized}
        width={isMinimized ? "5%" : "20%"}
        height="100%"
        padding="10px 0"
        borderLeft="solid lightgrey 1px"
        position="relative"
        overflow={isMinimized ? "hidden" : "auto"}
      >
        <IconButton
          icon={
            <Icon
              icon={
                isMinimized
                  ? "icon-park-twotone:expand-left"
                  : "iconoir:sidebar-collapse"
              }
            />
          }
          variant="ghost"
          position="absolute"
          top="2"
          right="2"
          onClick={toggleMinimize}
          zIndex="1"
          fontSize="24px"
        />
        {!isMinimized && activeView === "default" && (
          // ... render the rest of panel content only if not minimized
          <VStack width={"100%"}>
            <Box
              width="100%"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <Box cursor="pointer" onClick={handleUpdateGroupImage}>
                <ConversationAvatar conversation={conversation} user={user} />
                <input
                  ref={inputGroupImageRef}
                  type="file"
                  accept="image/jpeg, image/jpg, image/png"
                  hidden={true}
                  onChange={handlePickImage}
                />
              </Box>
              {conversation.isGroup &&
                conversation.groupOwner === user.id &&
                renderEditName}
              {conversation?.isGroup && conversation.groupOwner === user.id && (
                <AddUserGroup
                  conversation={conversation}
                  setConversation={setConversation}
                />
              )}
            </Box>
            <VStack
              padding="0.5rem 0"
              borderTop="solid lightgrey 1px"
              divider={<StackDivider borderColor="gray.200" />}
              width="100%"
            >
              <Button
                onClick={() => handleViewChange("media")}
                leftIcon={<Icon icon="pajamas:media" />}
                justifyContent="flex-start"
                width="100%"
                variant="ghost"
                color="black"
                _hover={{ bg: "#ebedf0" }}
              >
                Media
              </Button>
              <Button
                onClick={() => handleViewChange("file")}
                leftIcon={<Icon icon="mdi:files" />}
                justifyContent="flex-start"
                width="100%"
                variant="ghost"
                color="black"
                _hover={{ bg: "#ebedf0" }}
              >
                Files
              </Button>
              <Button
                onClick={() => handleViewChange("link")}
                leftIcon={<Icon icon="dashicons:admin-links" />}
                justifyContent="flex-start"
                width="100%"
                variant="ghost"
                color="black"
                _hover={{ bg: "#ebedf0" }}
              >
                Links
              </Button>
            </VStack>
          </VStack>
        )}

        {!isMinimized && activeView === "media" && (
          <VStack width={"100%"}>
            <HStack
              position="relative"
              display="flex"
              justifyContent="center"
              width="100%"
              alignItems="center"
            >
              <Box
                position="absolute"
                left="0"
                onClick={() => handleViewChange("default")}
                padding="0.5rem"
              >
                <Icon icon="humbleicons:arrow-go-back" width="1.5rem" />
              </Box>

              <Text fontSize="lg" fontWeight="bold">
                Media
              </Text>
            </HStack>
            {renderMediaView()}
          </VStack>
        )}
        {!isMinimized && activeView === "link" && (
          <VStack width={"100%"}>
            <HStack
              position="relative"
              display="flex"
              justifyContent="center"
              width="100%"
              alignItems="center"
            >
              <Box
                position="absolute"
                left="0"
                onClick={() => handleViewChange("default")}
                padding="0.5rem"
              >
                <Icon icon="humbleicons:arrow-go-back" width="1.5rem" />
              </Box>

              <Text fontSize="lg" fontWeight="bold">
                Links
              </Text>
            </HStack>
          </VStack>
        )}
        {!isMinimized && activeView === "file" && (
          <VStack width={"100%"}>
            <HStack
              position="relative"
              display="flex"
              justifyContent="center"
              width="100%"
              alignItems="center"
            >
              <Box
                position="absolute"
                left="0"
                onClick={() => handleViewChange("default")}
                padding="0.5rem"
              >
                <Icon icon="humbleicons:arrow-go-back" width="1.5rem" />
              </Box>

              <Text fontSize="lg" fontWeight="bold">
                Files
              </Text>
            </HStack>
          </VStack>
        )}
        {!isMinimized && conversation?.isGroup && (
          <Accordion allowMultiple width="100%">
            <AccordionItem>
              <AccordionButton>
                <Text as="b" flex="1" textAlign="left">
                  Group members
                </Text>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                {conversation?.participants?.map((item, index) => (
                  <Box
                    key={index}
                    padding="8px"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    _hover={{
                      cursor: "pointer",
                    }}
                    role="group"
                  >
                    <Avatar
                      size="sm"
                      src={item?.photoUrl ? item.photoUrl : ""}
                    />
                    <Box marginLeft="10px" flex={1}>
                      <Text>{item?.displayName}</Text>
                    </Box>
                    {conversation.groupOwner === item?.id && (
                      <Box>
                        <Text>🗝️</Text>
                      </Box>
                    )}
                    {conversation.groupOwner !== item?.id && (
                      <Flex
                        display="none"
                        _groupHover={{ display: "flex" }}
                        height="100%"
                        alignItems="center"
                      >
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            icon={
                              <Icon
                                style={{ fontSize: "15px" }}
                                icon="ri:more-2-fill"
                              />
                            }
                            variant="ghost"
                            borderRadius="100%"
                            _hover={{ cursor: "pointer" }}
                          />
                          <MenuList margin="-10px 0 0 0">
                            {conversation.groupOwner === user.id && (
                              <MenuItem
                                color="red"
                                icon={<Icon icon="tabler:trash" />}
                                onClick={() => handleRemoveMember(item)}
                              >
                                Remove member
                              </MenuItem>
                            )}
                          </MenuList>
                        </Menu>
                      </Flex>
                    )}
                  </Box>
                ))}
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        )}
      </VStack>
    );
  }, [user, conversation, activeView, images, isMinimized]);

  return (
    <>
      {renderConversationInfo}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Image
              src={selectedImage}
              alt="Selected media"
              maxW="100%"
              maxH="100%"
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* preview image group modal here */}
      <ImageGroupPreview
        isOpen={isImageGroupPreivewOpen}
        url={avatarGroupUrl}
        onClose={onCloseImageGroupPreview}
        onClickUpdate={handleClickUpdate}
      />
    </>
  );
};
export default ConversationInfo;
