import CustomAlert from "#/CustomAlert";
import { post } from "#/axios";
import { GlobalContext } from "#/contexts/GlobalContext";
import { Box, Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { Icon } from "@iconify-icon/react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alt, setAlt] = useState(false);
  const [mess, setMess] = useState('');
  const [statusMess, setStatusMess] = useState('info');
  const { logOut } = useContext(GlobalContext);
  const navigate = useNavigate();

  const checkValid = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setAlt(true);
      setMess('Please enter all the required information !');
      setStatusMess('warning');
      setTimeout(() => {
        setAlt(false);
      }, 3000);
      return false;
    } else if (oldPassword.trim() === newPassword.trim()) {
      setAlt(true);
      setMess(`New password isn't match the old password!`);
      setStatusMess('warning');
      setTimeout(() => {
        setAlt(false);
      }, 3000);
      return false;
    }
    return true;
  }

  const handleOnClose = () => {
    setAlt(false);
    setIsLoading(false);
    setMess("");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onClose();
  }
  const handleChangePassword = async () => {
    setIsLoading(true);
    const check = checkValid();
    if (check) {
      if (confirmPassword === newPassword) {
        const data = {
          oldPassword: oldPassword,
          newPassword: newPassword
        }
        try {
          const response = await post('/users/change-password', data);
          if (response.status === 200) {
            setAlt(true);
            setMess('Change password success !');
            setStatusMess('success');
            setTimeout(() => {
              setAlt(true);
              setMess('Redirect to login now !');
              setStatusMess('info');
              setTimeout(() => {
                setAlt(false);
                logOut();
                return navigate("/login");
              }, 2000);
            }, 2000);
          } else if (response.status === 401) {
            setAlt(true);
            setMess('Old password is incorrect !');
            setStatusMess('warning');
            setTimeout(() => {
              setAlt(false);
            }, 3000);
          } else if (response.status === 500) {
            setAlt(true);
            setMess('Change password failed !');
            setStatusMess('error');
            setTimeout(() => {
              setAlt(false);
            }, 3000);
          }
        } catch (error) {
          setAlt(true);
          setMess('Old password is incorrect !');
          setStatusMess('warning');
          setTimeout(() => {
            setAlt(false);
          }, 3000);
        }
      }
    }
    setIsLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Change Password</ModalHeader>
        <ModalCloseButton />
        <Box display='flex' justifyContent='center' alignItems='center'>
          <Icon icon="arcticons:password" width="96" height="96" style={{ color: "#23b3a9" }} />
        </Box>
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Old Password</FormLabel>
            <Input type="password" placeholder="Enter your old password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>New Password</FormLabel>
            <Input type="password" placeholder="Enter your new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Confirm New Password</FormLabel>
            <Input type="password" placeholder="Confirm your new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button backgroundColor="teal.500" isLoading={isLoading} onClick={handleChangePassword}>
            Change Password
          </Button>
        </ModalFooter>
        <Box p={2} style={{ width: "100%", height: '60px' }}>
          {alt ? (<CustomAlert message={mess} status={statusMess} style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: '9999' }} />) : null}
        </Box>
      </ModalContent>
    </Modal>
  );
};

export default ChangePasswordModal;