import { post } from '#/axios'
import AboutModel from '#/components/AboutModel'
import AccountInfoModal from '#/components/AccountInfoModal'
import ChangeLanguageModel from '#/components/ChangeLanguageModel'
import ChangePasswordModel from '#/components/ChangePasswordModel'
import DisplaySettingModel from '#/components/DisplaySettingModel'
import { GlobalContext } from '#/contexts/GlobalContext'
import { Box, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react'
import { Icon } from '@iconify-icon/react'
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MenuSetting = () => {
  const { logOut } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [showAccountInfoModal, setShowAccountInfoModal] = useState(false);
  const [showDisplaySettingsModal, setShowDisplaySettingsModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  const handleLogout = async () => {
    try {
      await post("/auth/logout", null, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).finally(() =>
        logOut()
      );
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <>
      <Menu placement="right-end">
        <MenuButton
          as={Box}
          width="100%"
          aspectRatio={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
          borderRadius="10px"
          _hover={{
            cursor: 'pointer',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
          }}
          padding={1}
        >
          <Icon icon="mdi-light:settings" width="100%" height="100%" style={{ color: "#008080" }} />
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => setShowAccountInfoModal(true)}>
            <Icon icon="mdi:account-cog-outline" style={{ color: "#23b3a9" }} />
            <Text marginLeft={2}>Thông tin tài khoản</Text>
          </MenuItem>
          <MenuItem onClick={() => setShowDisplaySettingsModal(true)}>
            <Icon icon="material-symbols-light:display-settings-outline-sharp" style={{ color: "#23b3a9" }} />
            <Text marginLeft={2}>Cài đặt hiển thị</Text>
          </MenuItem>
          <MenuItem onClick={() => setShowChangePasswordModal(true)}>
            <Icon icon="material-symbols:settings-account-box-outline-rounded" style={{ color: "#23b3a9" }} />
            <Text marginLeft={2}>Tài khoản - mật khẩu</Text>
          </MenuItem>
          <MenuItem onClick={() => setShowLanguageModal(true)}>
            <Icon icon="iconoir:language" style={{ color: "#23b3a9" }} />
            <Text marginLeft={2}>Ngôn ngữ</Text>
          </MenuItem>
          <MenuItem onClick={() => setShowAboutModal(true)}>
            <Icon icon="system-uicons:info-circle" style={{ color: "#23b3a9" }} />
            <Text marginLeft={2}>Giới thiệu</Text>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <Icon icon="ic:outline-logout" style={{ color: "#e70808" }} />
            <Text marginLeft={2} color='palevioletred'>Đăng xuất</Text>
          </MenuItem>
        </MenuList>
      </Menu>
      <AccountInfoModal isOpen={showAccountInfoModal} onClose={() => setShowAccountInfoModal(false)} />
      <DisplaySettingModel isOpen={showDisplaySettingsModal} onClose={() => setShowDisplaySettingsModal(false)} />
      <ChangePasswordModel isOpen={showChangePasswordModal} onClose={() => setShowChangePasswordModal(false)} />
      <ChangeLanguageModel isOpen={showLanguageModal} onClose={() => setShowLanguageModal(false)} />
      <AboutModel isOpen={showAboutModal} onClose={() => setShowAboutModal(false)} />
    </>
  )
}

export default MenuSetting