import React from 'react'
import { Flex, Image } from '@chakra-ui/react'

const Navbar = () => {
    return (
        <Flex bg='white' height='44px' padding='6px 12px'>
            <Flex align='center'>
                <Image
                    src='/images/redditface.svg' height='30px'
                    alt='logo' />
                <Image
                    src='/images/redditText.svg' height='44px'
                    alt='logo'
                    display={{ base: 'none', md: 'unset' }} />
            </Flex>
            {/* <Directory />
            <SearchInput />
            <RightContent /> */}
        </Flex>
    )
}
export default Navbar