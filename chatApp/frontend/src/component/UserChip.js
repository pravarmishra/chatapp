import { Card, Chip, Stack } from '@mui/material'
import React from 'react'
import { Badge } from "@chakra-ui/layout";

const UserChip = ({user,handleFunction}) => {
  return (
    <Badge
    px={2}
    py={1}
    borderRadius={"-moz-initial"}
    m={1}
    mb={2}
    variant="solid"
    fontSize={19}
   background={'rgb(215, 165, 165)'}
   color={'black'}
    cursor="pointer"
    onClick={handleFunction}
  >{user.name}
    </Badge>
  )
}

export default UserChip;