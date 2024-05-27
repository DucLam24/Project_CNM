import { Box, Flex, Text } from '@chakra-ui/react'
import { Icon } from '@iconify-icon/react'
import React from 'react'

const ListGroup = () => {
  return (
    <div style={{ height: '100vh' }}>
      {/* header */}
      <Box style={{
        borderBottom: '1px solid gray'
      }}>
        <Flex align='center' h="60px" direction='row' color="black" p={5}>
          <Icon icon="iconoir:group" width='40px' height='25px' />
          <Text as='b'>Danh sách nhóm</Text>
        </Flex>
      </Box>
      {/* main scroll */}
      <Box overflowY="scroll" height="calc(100vh - 60px)">
        <Flex bg='teal.20'>

        </Flex>
      </Box>
    </div >
  )
}

export default ListGroup