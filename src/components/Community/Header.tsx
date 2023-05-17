import { Box, Button, Flex, Icon, Image, Text } from "@chakra-ui/react"
import { Community } from "../../atoms/communitiesAtom"
import { FaReddit } from "react-icons/fa"
import useCommunityData from "../../hooks/useCommunityData"

type HeaderProps = {
    communityData: Community
}

const Header = ({ communityData }: HeaderProps) => {
    const { communityStateValue, onJoinOrLeaveCommunity, loading } = useCommunityData()
    const isJoined = !!communityStateValue.mySnippets.find((item) => item.communityId === communityData.id)


    return (
        <Flex direction='column' height='146px' width='100%'>
            <Box height='50%' bg='blue.400' />
            <Flex justify='center' bg='white' flexGrow={1}>
                <Flex width='95%' maxWidth='860px'>
                    {communityStateValue.currentCommunity?.imageURL! ? (
                        <Image
                            alt='community image'
                            src={communityStateValue.currentCommunity?.imageURL!}
                            borderRadius='full'
                            boxSize='60px'
                            top={-2}
                            color='blue.500'
                            border='4px solid white'
                            position='relative'
                        />
                    ) : (
                        <Icon
                            as={FaReddit}
                            fontSize={64}
                            position='relative'
                            top={-3}
                            color='blue.500'
                            border='4px solid white'
                            borderRadius='50%'
                        />
                    )}
                    <Flex padding='10px 16px'>
                        <Flex direction='column' mr={6}>
                            <Text fontWeight={800} fontSize='10pt' color='gray.400'>{`r/${communityData.id}`}</Text>
                        </Flex>
                    </Flex>
                    <Button
                        variant={isJoined ? 'outline' : 'solid'}
                        height='30px'
                        pr={6}
                        pl={6}
                        mt={1}
                        isLoading={loading}
                        onClick={() => (onJoinOrLeaveCommunity(communityData, isJoined))}
                    >{isJoined ? 'Joined' : 'Join'}</Button>

                </Flex>
            </Flex>
        </Flex>
    )
}

export default Header