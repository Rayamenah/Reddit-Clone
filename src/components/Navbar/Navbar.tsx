import { Flex, Image } from '@chakra-ui/react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../Firebase/clientApp'
import { defaultMenuItem } from '../../atoms/directoryAtom'
import useDirectory from '../../hooks/useDirectory'
import Directory from './Directory/Directory'
import RightContent from './RightContent/RightContent'
import SearchInput from './SearchInput'

const Navbar = () => {
    const [user] = useAuthState(auth)
    const { onSelectedMenuItem } = useDirectory()
    return (
        <Flex
            bg='white'
            height='44px'
            padding='8px 12px'
            justify={{ md: 'space-between', }}
        >
            <Flex
                align='center'
                width={{ base: '40px', md: 'auto' }}
                mr={{ base: 0, md: 2 }}
                onClick={() => { onSelectedMenuItem(defaultMenuItem) }}
            >
                <Image
                    src='/images/redditFace.svg' height='30px'
                    alt='logo' />
                <Image
                    src='/images/redditText.svg' height='44px'
                    alt='logo'
                    display={{ base: 'none', md: 'unset' }} />
            </Flex>
            {user && <Directory />}
            <SearchInput user={user} />
            <RightContent user={user} />

        </Flex>
    )
}
export default Navbar