import { Button, Flex, Icon, Stack, Text } from "@chakra-ui/react"
import { FaReddit } from "react-icons/fa"
import { useSetRecoilState } from "recoil"
import { createCommunityMenuState } from "../../atoms/createCommunityAtom"
import useDirectory from "../../hooks/useDirectory"

const PersonalHome = () => {
    const { toggleMenuOpen } = useDirectory()
    const setCreateCommunityState = useSetRecoilState(createCommunityMenuState)

    return (
        <Flex
            direction='column'
            bg='white'
            borderRadius={4}
            borderColor='gray.300'
            position='sticky'
        >
            <Flex
                align='center'
                color='white'
                p='6px 10px'
                bg='blue.500'
                height='34px'
                borderRadius='4px 4px 0px 0px'
                fontWeight={600}
                bgImage='url(/images/redditPersonalHome.png)'
                backgroundSize='cover'
            ></Flex>
            <Flex direction='column' p='12px'>
                <Flex align='center' mb={2}>
                    <Icon as={FaReddit} fontSize={50} color='brand.100' mr={2} />
                    <Text fontWeight={600}>Home</Text>
                </Flex>
                <Stack spacing={3}>
                    <Text fontSize='9pt'>
                        Your Personal Reddit frontpage, built for you
                    </Text>
                    <Button height='30px' onClick={toggleMenuOpen}>Create Post</Button>
                    <Button
                        variant='outline'
                        height='30px'
                        onClick={() => { setCreateCommunityState({ isOpen: true }) }}
                    >
                        Create Community
                    </Button>
                </Stack>
            </Flex>
        </Flex>
    )
}

export default PersonalHome

function useSetRecoilStateValue(createCommunityMenuState: any) {
    throw new Error("Function not implemented.")
}
