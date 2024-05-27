import { useMemo } from "react";
import {
  Box,
  Grid,
  GridItem,
  Avatar,
  Flex,
  Stack,
  Text,
  Image,
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  Tooltip,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Icon } from "@iconify-icon/react";
import { convertTime } from "#/utils";

const Message = ({
  message,
  sender,
  isSender,
  previousSameUser,
  nextSameUser,
  onRevoke,
  startReply,
  repliedTo,
}) => {
  const handleClickRevoke = () => {
    onRevoke(message.cuid);
  };

  const renderImageGrid = useMemo(() => {
    const images = message?.content?.split(",");

    return (
      <Box
        borderRadius={
          isSender
            ? previousSameUser && nextSameUser
              ? "18px 8px 8px 18px"
              : !previousSameUser && !nextSameUser
              ? "18px"
              : !previousSameUser && nextSameUser
              ? "18px 4px 18px 18px"
              : "18px 18px 4px 18px"
            : previousSameUser && nextSameUser
            ? "8px 18px 18px 8px"
            : !previousSameUser && !nextSameUser
            ? "18px"
            : !previousSameUser && nextSameUser
            ? "4px 18px 18px 18px"
            : "18px 18px 18px 4px"
        }
        overflow="hidden"
      >
        {!_.isEmpty(images) && images.length > 2 ? (
          <Grid
            maxWidth={{ lg: "350px", xl: "400px" }}
            templateColumns="repeat(3, 1fr)"
            gap="3px"
          >
            {!_.isEmpty(images) &&
              images.map((image, index) => (
                <GridItem
                  key={index}
                  width="100%"
                  aspectRatio={1}
                  overflow="hidden"
                >
                  <Image
                    width="100%"
                    height="100%"
                    objectFit="cover"
                    src={image}
                  />
                </GridItem>
              ))}
          </Grid>
        ) : (
          <Stack maxWidth="200px" gap="5px">
            {images.map((image, index) => (
              <Box key={index}>
                <Image src={image} />
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    );
  }, [message, isSender, previousSameUser, nextSameUser]);
  const getFileTypeIcon = (fileType) => {
    switch (fileType) {
      case "application/pdf":
        return "📄"; // PDF icon
      case "application/vnd.ms-excel":
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        return "📊"; // Excel document icon
      case "image/jpeg":
      case "image/png":
      case "image/gif":
        return "🖼️"; // Image icon
      case "application/zip":
      case "application/x-rar-compressed":
        return "📦"; // Archive icon
      default:
        return "📁"; // Default file icon
    }
  };

  const fileTypeIcon = getFileTypeIcon(message.fileType);

  const getFileNameFromUrl = (filePath) => {
    const lastIndex = filePath.lastIndexOf("-");
    return lastIndex !== -1 ? filePath.substring(lastIndex + 1) : filePath;
  };

  return (
    <>
      <Flex
        justifyContent={isSender ? "end" : "start"}
        alignItems="start"
        flexDirection={isSender ? "row-reverse" : "row"}
        role="group"
      >
        <Avatar
          src={sender?.photoUrl || ""}
          size="sm"
          marginX="10px"
          height={nextSameUser && "0"}
          bg="gray.400"
        />
        {repliedTo && (
          <Box mb={2} p={2} backgroundColor="gray.200" borderRadius="md">
            <Text fontSize="xs">Replied to {repliedTo.displayName}</Text>
            <Text fontSize="sm">{repliedTo.content}</Text>
          </Box>
        )}
        {message?.typeMessage === "TEXT" && (
          <Text
            maxW="50%"
            padding="10px"
            borderRadius={
              isSender
                ? previousSameUser && nextSameUser
                  ? "18px 8px 8px 18px"
                  : !previousSameUser && !nextSameUser
                  ? "18px"
                  : !previousSameUser && nextSameUser
                  ? "18px 4px 18px 18px"
                  : "18px 18px 4px 18px"
                : previousSameUser && nextSameUser
                ? "8px 18px 18px 8px"
                : !previousSameUser && !nextSameUser
                ? "18px"
                : !previousSameUser && nextSameUser
                ? "4px 18px 18px 18px"
                : "18px 18px 18px 4px"
            }
            bg={isSender ? "teal.500" : "blackAlpha.200"}
            color={isSender ? "white" : "black"}
            fontSize="md"
          >
            {message?.content}
          </Text>
        )}
        {message?.typeMessage === "IMAGE" && renderImageGrid}
        {message?.typeMessage === "CALL" && (
          <Text
            maxW="50%"
            padding="10px"
            borderRadius={
              isSender
                ? previousSameUser && nextSameUser
                  ? "18px 8px 8px 18px"
                  : !previousSameUser && !nextSameUser
                  ? "18px"
                  : !previousSameUser && nextSameUser
                  ? "18px 4px 18px 18px"
                  : "18px 18px 4px 18px"
                : previousSameUser && nextSameUser
                ? "8px 18px 18px 8px"
                : !previousSameUser && !nextSameUser
                ? "18px"
                : !previousSameUser && nextSameUser
                ? "4px 18px 18px 18px"
                : "18px 18px 18px 4px"
            }
            bg={isSender ? "teal.500" : "blackAlpha.200"}
            color={isSender ? "white" : "black"}
            fontSize="md"
          >
            <Flex direction="row">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-video"
                style={{ marginRight: 20 }}
              >
                <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
                <rect x={2} y={6} width={14} height={12} rx={2} />
              </svg>
              <Text>{message?.content}</Text>
            </Flex>
            <br />
            <Text fontSize="sm" textAlign="right">
              {`At: ${convertTime(message?.createdAt)}`}{" "}
            </Text>
          </Text>
        )}
        {/* {message?.typeMessage === "FILE" && (
          <Flex
            justifyContent={isSender ? "end" : "start"}
            alignItems="center"
            padding="10px"
            borderRadius={
              isSender
                ? previousSameUser && nextSameUser
                  ? "18px 8px 8px 18px"
                  : !previousSameUser && !nextSameUser
                  ? "18px"
                  : !previousSameUser && nextSameUser
                  ? "18px 4px 18px 18px"
                  : "18px 18px 4px 18px"
                : previousSameUser && nextSameUser
                ? "8px 18px 18px 8px"
                : !previousSameUser && !nextSameUser
                ? "18px"
                : !previousSameUser && nextSameUser
                ? "4px 18px 18px 18px"
                : "18px 18px 18px 4px"
            }
            bg={isSender ? "teal.500" : "blackAlpha.200"}
            color={isSender ? "white" : "black"}
          >
            <Icon
              icon="fluent:document-48-filled"
              style={{ fontSize: "24px" }}
            />
            <Box ml="10px">
              <Text fontSize="md">{message.fileName}</Text>
              <Text fontSize="sm">{message.fileSize} MB</Text>
            </Box>
          </Flex>
        )} */}
        {message?.typeMessage === "FILE" && (
          <Box
            maxW="50%"
            padding="10px"
            borderRadius={
              isSender
                ? previousSameUser && nextSameUser
                  ? "18px 8px 8px 18px"
                  : !previousSameUser && !nextSameUser
                  ? "18px"
                  : !previousSameUser && nextSameUser
                  ? "18px 4px 18px 18px"
                  : "18px 18px 4px 18px"
                : previousSameUser && nextSameUser
                ? "8px 18px 18px 8px"
                : !previousSameUser && !nextSameUser
                ? "18px"
                : !previousSameUser && nextSameUser
                ? "4px 18px 18px 18px"
                : "18px 18px 18px 4px"
            }
            bg={isSender ? "teal.500" : "blackAlpha.200"}
            color={isSender ? "white" : "black"}
            fontSize="md"
          >
            <Flex
              direction="column"
              alignItems="center"
              justifyContent="space-between"
            >
              <Flex alignItems="center">
                <Text fontSize="2xl" marginRight="10px">
                  {fileTypeIcon}
                </Text>
                <Text>{getFileNameFromUrl(message?.content)}</Text>
              </Flex>
            </Flex>
            <Box>
              <Flex justifyContent="flex-end">
                <Tooltip label="View File" aria-label="View File Tooltip">
                  <svg
                    onClick={() => window.open(message?.content, "_blank")}
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-eye mr-2"
                    style={{ marginLeft: 10, cursor: "pointer" }}
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx={12} cy={12} r={3} />
                  </svg>
                </Tooltip>
                <Tooltip
                  label="Download File"
                  aria-label="Download File Tooltip"
                >
                  <svg
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = message?.content;
                      link.download = message.fileName;
                      link.style.display = "none";
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ marginLeft: 10, cursor: "pointer" }}
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </Tooltip>
              </Flex>
            </Box>
            <br />
            <Text fontSize="sm" textAlign="right">
              {`At: ${convertTime(message?.createdAt)}`}
            </Text>
          </Box>
        )}
        {message?.typeMessage === "VIDEO" && (
          <Box
            maxW="50%"
            padding="10px"
            borderRadius={
              isSender
                ? previousSameUser && nextSameUser
                  ? "18px 8px 8px 18px"
                  : !previousSameUser && !nextSameUser
                  ? "18px"
                  : !previousSameUser && nextSameUser
                  ? "18px 4px 18px 18px"
                  : "18px 18px 4px 18px"
                : previousSameUser && nextSameUser
                ? "8px 18px 18px 8px"
                : !previousSameUser && !nextSameUser
                ? "18px"
                : !previousSameUser && nextSameUser
                ? "4px 18px 18px 18px"
                : "18px 18px 18px 4px"
            }
            bg={isSender ? "teal.500" : "blackAlpha.200"}
            color={isSender ? "white" : "black"}
            fontSize="md"
          >
            <video controls width="100%">
              <source src={message?.content} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <Text textAlign="right" padding="8px">
              {getFileNameFromUrl(message?.content)}
            </Text>
            <Text fontSize="sm" textAlign="right">
              {`At: ${convertTime(message?.createdAt)}`}
            </Text>
          </Box>
        )}
        <Flex
          display="none"
          _groupHover={{ display: "flex" }}
          margin="0 20px"
          height="100%"
          alignItems="center"
        >
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<Icon icon="ri:more-2-fill" />}
              variant="ghost"
              fontSize="20px"
              borderRadius="100%"
              _hover={{ cursor: "pointer" }}
            />
            <MenuList margin="-10px 0 0 0">
              {isSender && (
                <MenuItem
                  icon={<Icon icon="tabler:trash" />}
                  onClick={handleClickRevoke}
                >
                  Revoke
                </MenuItem>
              )}
              {/* creating reply item to reply message */}
              <MenuItem
                icon={<Icon icon="ph:quotes-bold" />}
                onClick={() => startReply(message)}
              >
                Reply
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </>
  );
};

export default Message;

Message.propTypes = {
  message: PropTypes.shape({
    cuid: PropTypes.string,
    userId: PropTypes.string,
    content: PropTypes.string,
    typeMessage: PropTypes.string,
    isRevoke: PropTypes.bool,
    createdAt: PropTypes.string,
  }),
  sender: PropTypes.shape({
    id: PropTypes.string,
    displayName: PropTypes.string,
    photoUrl: PropTypes.string,
  }),
  isSender: PropTypes.bool,
  previousSameUser: PropTypes.bool,
  nextSameUser: PropTypes.bool,
};

Message.defaultProps = {
  message: {},
  sender: {},
  isSender: false,
  previousSameUser: false,
  nextSameUser: false,
};
