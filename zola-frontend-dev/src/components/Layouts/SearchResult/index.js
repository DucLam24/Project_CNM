import { Box, Avatar, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";

const UserSearched = ({ user, onClick }) => {
  return (
    <Box
      padding="10px"
      margin="10px"
      display="flex"
      alignItems="center"
      borderRadius="15px"
      _hover={{
        cursor: "pointer",
        backgroundColor: "rgba(0, 0, 0, 0.05)",
      }}
      onClick={() => onClick(user)}
    >
      <Avatar src={user?.photoUrl ? user.photoUrl : ""} />
      <Box marginLeft="10px" flex={1}>
        <Text>{user?.displayName}</Text>
      </Box>
    </Box>
  );
};

export default UserSearched;

UserSearched.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    displayName: PropTypes.string,
    photoUrl: PropTypes.string,
  }),
  onClick: PropTypes.func,
};

UserSearched.defaultProps = {
  user: {
    id: "",
    displayName: "",
    photoUrl: "",
  },
  onClick: () => {},
};
