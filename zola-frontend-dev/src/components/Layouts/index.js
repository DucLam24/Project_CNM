import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, Outlet } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Input,
  Spinner,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { Icon } from "@iconify-icon/react";
import _ from "lodash";

import { get, post } from "#/axios";
import { getSocket } from "#/socket";

import { GlobalContext } from "#/contexts/GlobalContext";
import { SocketContext } from "#/contexts/SocketContext";

import UserSearched from "./SearchResult";
import ConversationList from "./ConversationList";
import { VIEW_CHAT, VIEW_CONTACT } from "#/constances/Active";
import ContactNav from "../ContactNav";
import ModelUser from "../ModelUser";
import MenuSetting from "./MenuSetting";
import AddGroupModal from "./AddGroupModal";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { ZIM } from "zego-zim-web";
import { updateZego } from "#/pages/Callkit/Callkit";
const AppLayout = () => {
  const {
    isOpen: isModalAddGroupOpen,
    onOpen: onOpenModalAddGroup,
    onClose: onCloseModalAddGroup,
  } = useDisclosure();
  const { user, setUser, setConversationId } = useContext(GlobalContext);
  const { setSocket } = useContext(SocketContext);
  const searchRef = useRef(null);
  const [isSearch, setSearch] = useState(false);
  const [listUser, setListUser] = useState([]);
  const [view, setView] = useState(VIEW_CHAT);
  const [dataSearch, setDataSearch] = useState([]);

  // call api get data-
  useEffect(() => {
    try {
      const getData = async () => {
        const me = await get("/users/me");

        if (me?.status === 200) {
          setUser(me?.data);
        }
      };
      getData();
    } catch (error) {}
  }, [setUser]);

  useEffect(() => {
    if (user && user.id && user.displayName) {
      try {
        const userID = user.id;
        const userName = user.displayName;
        const appID = 49365051;
        const serverSecret = "352f68b05ab78fd52fa2db0cce0b4bb7";
        const TOKEN = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          null,
          userID,
          userName
        );

        const zp = ZegoUIKitPrebuilt.create(TOKEN);
        zp?.addPlugins({ ZIM });
        updateZego(zp);
      } catch (error) {
        console.log(error);
      }
    }
  }, [user]);
  const getListFriend = async () => {
    const response = await get("/contacts/get-friends-user");
    if (response.status === 200) {
      setDataSearch(response.data);
    }
  };

  useEffect(() => {
    isSearch ? getListFriend() : setDataSearch([]);
  }, [isSearch]);

  // connect with root socket
  useEffect(() => {
    const rootSocket = getSocket("", { autoConnect: false });

    if (!_.isEmpty(user)) {
      rootSocket.connect();
      setSocket((prev) => {
        const socket = _.cloneDeep(prev);

        return {
          ...socket,
          rootSocket,
        };
      });
    }

    return () => {
      rootSocket.disconnect();
    };
  }, [user, setSocket]);

  const handleLiveSearch = (event) => {
    const { value } = event?.target;
    if (!value.trim()) return;
    const filteredData = dataSearch?.filter((item) => {
      if (
        item?.displayName.toLowerCase().includes(value?.toLowerCase()) ||
        item?.email.toLowerCase().includes(value?.toLowerCase())
      ) {
        return true;
      }
      return false;
    });
    setListUser(filteredData);
  };

  const handleClickUserSearched = useCallback(
    async (user) => {
      if (_.isEmpty(user)) return;

      try {
        const response = await post("/conversations", {
          participantIds: [user?.id],
        });

        if (response?.status === 201)
          return setConversationId(response?.data?.id);
      } catch (error) {}
    },
    [setConversationId]
  );

  /* const debounceLiveSearch = _.debounce(handleLiveSearch, 300); */

  const renderMainSidebar = useMemo(() => {
    const viewByPath = {
      VIEW_CHAT: () => <ConversationList />,
      VIEW_CONTACT: () => <ContactNav />,
      /* VIEW_NOTI : () => <NotificationNav/>, */
    };

    return (
      <>
        {isSearch ? (
          <Box flex={1} overflowY="scroll">
            {listUser &&
              listUser?.map((user, index) => (
                <UserSearched
                  key={index}
                  user={user}
                  onClick={handleClickUserSearched}
                />
              ))}
          </Box>
        ) : (
          <>{viewByPath[view]()}</>
        )}
      </>
    );
  }, [isSearch, listUser, view, handleClickUserSearched]);

  return (
    <>
      {_.isEmpty(user) ? (
        <Box height="100%" display="flex">
          <Spinner margin="auto" size="xl" color="teal.500" />
        </Box>
      ) : (
        <Box height="100%" display="flex">
          <Box
            width={"60px"}
            padding="10px 5px"
            display="flex"
            flexDirection="column"
            border="1px solid #e5e5e5"
          >
            <Box
              width="100%"
              aspectRatio={1}
              display="flex"
              justifyContent="center"
              alignItems="center"
              fontSize="28px"
              _hover={{
                cursor: "pointer",
                backgroundColor: "rgba(0, 0, 0, 0.05)",
              }}
              marginBottom={4}
            >
              <ModelUser />
            </Box>
            <Tooltip placement="auto-start" label="Chat">
              <Link to="/">
                <Box
                  width="100%"
                  aspectRatio={1}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  fontSize="28px"
                  borderRadius="10px"
                  backgroundColor={
                    view === VIEW_CHAT ? "rgba(0, 0, 0, 0.05)" : null
                  }
                  onClick={() => {
                    setView(VIEW_CHAT);
                  }}
                  _hover={{
                    cursor: "pointer",
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                  }}
                  marginBottom={4}
                >
                  <Icon icon="et:chat" style={{ color: "#008080" }} />
                </Box>
              </Link>
            </Tooltip>
            <Tooltip placement="auto-start" label="Contact manager">
              <Link to="/list-friend">
                <Box
                  width="100%"
                  aspectRatio={1}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  borderRadius="10px"
                  bg="rgba(255, 255, 255, 0.3)"
                  _hover={{
                    cursor: "pointer",
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                  }}
                  backgroundColor={
                    view === VIEW_CONTACT ? "rgba(0, 0, 0, 0.05)" : null
                  }
                  padding={1}
                  marginBottom={4}
                  onClick={() => setView(VIEW_CONTACT)}
                >
                  <Icon
                    icon="system-uicons:contacts"
                    width="100%"
                    height="100%"
                    style={{ color: "#008080" }}
                  />
                </Box>
              </Link>
            </Tooltip>
            {/* <Tooltip placement='auto-start' label='notification'>
              <Link to="/notification">
                <Box
                  width="100%"
                  aspectRatio={1}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  fontSize="28px"
                  borderRadius="10px"
                  backgroundColor={view === VIEW_NOTI ? "rgba(0, 0, 0, 0.05)" : null}
                  onClick={() => { setView(VIEW_NOTI) }}
                  _hover={{
                    cursor: "pointer",
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                  }}
                  marginBottom={4}
                >
                  <Icon icon="solar:notification-unread-lines-outline" style={{ color: "#008080" }} />
                </Box>
              </Link>
            </Tooltip> */}
            <Tooltip placement="bottom-end" label="setting">
              <Box width="100%" marginBottom={4}>
                <MenuSetting />
              </Box>
            </Tooltip>
          </Box>
          <Box
            width={"360px"}
            display="flex"
            flexDirection="column"
            border="1px solid #e5e5e5"
          >
            <Box
              paddingX="10px"
              paddingY="5px"
              borderBottom="1px solid #e5e5e5"
            >
              <Heading size="sm">
                {view === VIEW_CHAT ? "Chat" : "Contact"}
              </Heading>
              <Flex alignItems="center" gap={2}>
                <Flex alignItems="center" flex={1}>
                  {isSearch && (
                    <Box
                      height="30px"
                      marginRight="10px"
                      aspectRatio={1}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      fontSize="20px"
                      borderRadius="100%"
                      _hover={{
                        cursor: "pointer",
                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                      }}
                      onClick={() => {
                        searchRef.current.value = "";
                        setSearch(false);
                        setListUser([]);
                      }}
                    >
                      <Icon icon="ion:arrow-back" />
                    </Box>
                  )}
                  <Input
                    ref={searchRef}
                    my="10px"
                    placeholder="Search"
                    onFocus={() => setSearch(true)}
                    onChange={handleLiveSearch}
                  />
                </Flex>
                <Box>
                  <IconButton
                    variant="ghost"
                    icon={
                      <Icon
                        style={{ fontSize: "24px" }}
                        icon="fluent-mdl2:add-group"
                      />
                    }
                    onClick={onOpenModalAddGroup}
                  />
                </Box>
              </Flex>
            </Box>
            {renderMainSidebar}
          </Box>
          <Box flex={1}>
            <Outlet />
          </Box>
        </Box>
      )}

      {/* Modal Add Group here */}
      <AddGroupModal
        isOpen={isModalAddGroupOpen}
        onClose={onCloseModalAddGroup}
      />
    </>
  );
};

export default AppLayout;
