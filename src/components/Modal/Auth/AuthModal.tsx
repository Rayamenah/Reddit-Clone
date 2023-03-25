import React from 'react'
import { Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Flex } from '@chakra-ui/react'
import { useRecoilState } from 'recoil'
import { authModalState } from '../../../atoms/authModalAtom'
import AuthInputs from './AuthInputs'
import OAuthButtons from './OAuthButtons'

const AuthModal = () => {
    const [modalState, setModalState] = useRecoilState(authModalState)
    const handleClose = () => {
        setModalState(prev => ({
            ...prev,
            open: false
        }))
    }
    return (
        <>
            <Modal isOpen={modalState.open} onClose={handleClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader textAlign='center'>
                        {modalState.view === 'login' && 'Login'}
                        {modalState.view === 'signup' && 'Sign Up'}
                        {modalState.view === 'resetPassword' && 'Reset Password'}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display='flex'
                        flexDirection='column'
                        alignItems='center'
                        justifyContent='center'
                        pb={2}
                    >
                        <Flex
                            direction='column'
                            align='center'
                            justify='center'
                            width='70%'
                        >
                            <OAuthButtons />
                            <Text color='gray.500'>OR</Text>
                            <AuthInputs />
                            {/* <ResetPassword /> */}
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>

    )
}

export default AuthModal