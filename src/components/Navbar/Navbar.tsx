import { Flex, Image } from '@chakra-ui/react'
import SearchInput from './SearchInput'
import RightContent from './RightContent/RightContent'

const Navbar = () => {
    return (
        <Flex bg='white' height='44px' padding='8px 12px'>
            <Flex align='center'>
                <Image
                    src='/images/redditface.svg' height='30px'
                    alt='logo' />
                <Image
                    src='/images/redditText.svg' height='44px'
                    alt='logo'
                    display={{ base: 'none', md: 'unset' }} />
            </Flex>
            <SearchInput />
            <RightContent />
            {/* <Directory /> */}

        </Flex>
    )
}
export default Navbar