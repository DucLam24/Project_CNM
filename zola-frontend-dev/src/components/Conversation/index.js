import { Box, Flex, Avatar, AvatarGroup, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { formatDistance } from "date-fns";

import { formatConversationName, getConversationAvatar } from "#/utils";
import { useContext } from "react";
import { GlobalContext } from "#/contexts/GlobalContext";
import ConversationAvatar from "./ConversationAvatar";

const Conversation = ({ conversation, isRead, isSelect, onClick }) => {
  const { user } = useContext(GlobalContext);

  const handleClick = () => {
    onClick(conversation.id);
  };

  return (
    <>
      <Box
        padding="10px"
        margin="10px"
        display="flex"
        alignItems="center"
        borderRadius="15px"
        backgroundColor={isSelect ? "rgba(0, 0, 0, 0.05)" : ""}
        _hover={{
          cursor: "pointer",
          backgroundColor: "rgba(0, 0, 0, 0.05)",
        }}
        onClick={handleClick}
      >
        <Box width="20%">
          <ConversationAvatar conversation={conversation} user={user} />
        </Box>
        <Box marginLeft="10px" flex={1}>
          <Flex justifyContent="space-between">
            <Text as="b" noOfLines={1} flex={1}>
              {formatConversationName(conversation, user.id)}
            </Text>
            <Text fontSize="sm" color="#65676b">
              {formatDistance(new Date(conversation?.updatedAt), new Date())}
            </Text>
          </Flex>
          {conversation.latestMessage && (
            <Text
              fontSize="sm"
              as={isRead ? "" : "b"}
              color={isRead ? "#65676b" : "black"}
              noOfLines={1}
            >
              {`${
                user.id === conversation.latestMessage.userId ? "you: " : ""
              }${
                conversation?.latestMessage?.typeMessage === "TEXT"
                  ? conversation.latestMessage.content
                  : `Sent attached ${conversation?.latestMessage?.typeMessage?.toLowerCase()}`
              }`}
            </Text>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Conversation;

Conversation.propTypes = {
  conversation: PropTypes.shape({
    id: PropTypes.string,
    participants: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        displayName: PropTypes.string,
        photoUrl: PropTypes.string,
      })
    ),
    isGroup: PropTypes.bool,
    groupName: PropTypes.string,
    groupImage: PropTypes.string,
    groupOwner: PropTypes.string,
    userSeen: PropTypes.arrayOf(PropTypes.string),
    latestMessage: PropTypes.shape({
      userId: PropTypes.string,
      content: PropTypes.string,
      typeMessage: PropTypes.string,
      createdAt: PropTypes.string,
    }),
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
  }),
  isRead: PropTypes.bool,
  isSelect: PropTypes.bool,
  onclick: PropTypes.func,
};

Conversation.defaultProps = {
  conversation: {},
  isRead: false,
  isSelect: false,
  onClick: () => {},
};
