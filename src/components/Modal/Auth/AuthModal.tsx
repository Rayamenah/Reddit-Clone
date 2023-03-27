import { Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRecoilState } from 'recoil'
import { authModalState } from '../../../atoms/authModalAtom'
import { auth } from '../../../Firebase/clientApp'
import AuthInputs from './AuthInputs'
import OAuthButtons from './OAuthButtons'
import ResetPassword from './ResetPassword'

const AuthModal = () => {
    const [modalState, setModalState] = useRecoilState(authModalState)
    const [user, loading, error] = useAuthState(auth)

    // const toggleView = (view: string) => {
    //     setModalState({
    //         ...modalState,
    //         view: view as typeof modalState.view,
    //     });
    // };

    const handleClose = () => {
        setModalState(prev => ({
            ...prev,
            open: false
        }))
    }
    useEffect(() => {
        if (user) {
            setModalState(prev => ({
                ...prev,
                open: false
            }))
        }
    }, [setModalState, user])
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
                            {(modalState.view === 'login' || modalState.view === 'signup') && <OAuthButtons />}
                            {(modalState.view === 'login' || modalState.view === 'signup') ? (<AuthInputs />) : (<ResetPassword />)}
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>

    )
}

export default AuthModal