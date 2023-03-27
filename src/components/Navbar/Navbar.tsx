import { Flex, Image } from '@chakra-ui/react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../Firebase/clientApp'
import RightContent from './RightContent/RightContent'
import SearchInput from './SearchInput'

const Navbar = () => {
    const [user, loading, error] = useAuthState(auth)

    return (
        <Flex bg='white' height='44px' padding='8px 12px'>
            <Flex align='center' mr={2}>
                <Image
                    src='/images/redditFace.svg' height='30px'
                    alt='logo' />
                <Image
                    src='/images/redditText.svg' height='44px'
                    alt='logo'
                    display={{ base: 'none', md: 'unset' }} />
            </Flex>
            <SearchInput />
            <RightContent user={user} />
            {/* <Directory /> */}

        </Flex>
    )
}
export default Navbar