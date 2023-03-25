import { Button, Flex, Input, Text } from "@chakra-ui/react"
import { useState } from "react"
import { useSetRecoilState } from "recoil"
import { authModalState } from "../../../atoms/authModalAtom"

const Login = () => {
    const setAuthModalState = useSetRecoilState(authModalState)

    const [loginForm, setLoginForm] = useState({
        email: '',
        password: ''
    })

    //firebase logic

    const onSubmit = () => {

    }
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        //update form state
        setLoginForm(prev => ({
            ...prev,
            [event.target.name]: event.target.value
        }))
    }

    return (
        <form onSubmit={onSubmit}>
            <Input
                required
                name='email'
                placeholder='email'
                type='email'
                color='black'
                mb={2}
                onChange={onChange}
                fontSize='10pt'
                _placeholder={{ color: 'gray.500' }}
                _hover={{
                    bg: 'white',
                    border: '1px solid',
                    borderColor: 'blue.500',
                }}
                _focus={{
                    outline: 'none',
                    bg: 'white',
                    border: '1px solid',
                    borderColor: 'blue.500'
                }}
                bg='gray.50'
            />
            <Input
                required
                name='password'
                placeholder='password'
                type='password'
                color='black'
                mb={2}
                onChange={onChange}
                fontSize='10pt'
                _placeholder={{ color: 'gray.500' }}
                _hover={{
                    bg: 'white',
                    border: '1px solid',
                    borderColor: 'blue.500',
                }}
                _focus={{
                    outline: 'none',
                    bg: 'white',
                    border: '1px solid',
                    borderColor: 'blue.500'
                }}
                bg='gray.50'
            />
            <Button width='100%' height='36px' mt={2} mb={2} type='submit'>
                Log In
            </Button>
            <Flex fontSize='9pt' justifyContent='center'>
                <Text mr={1}>New Here ?</Text>
                <Text color='blue.500' fontWeight={700} cursor='pointer' onClick={() => setAuthModalState((prev) => ({ ...prev, view: 'signup' }))}>SIGN UP</Text>
            </Flex>
        </form>
    )
}
export default Login