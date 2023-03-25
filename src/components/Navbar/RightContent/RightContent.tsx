import React from 'react'
import { Flex } from '@chakra-ui/react'
import AuthButtons from './AuthButtons'
import AuthModal from '../../Modal/Auth/AuthModal'

const RightContent = () => {
    return (
        <>
            <AuthModal />
            <Flex justify='center' align='center'>
                <AuthButtons />
            </Flex>
        </>
    )
}

export default RightContent