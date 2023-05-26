import { Box, Text } from "@chakra-ui/react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "../../../Firebase/clientApp"
import About from "../../../components/Community/About"
import PageContent from "../../../components/Layout/PageContent"
import NewPostForm from "../../../components/Posts/NewPostForm"
import useCommunityData from "../../../hooks/useCommunityData"

const SubmitPostPage = () => {
    const [user] = useAuthState(auth)
    const { communityStateValue } = useCommunityData()
    return (
        <PageContent>
            <>
                <Box p='14px 0px' borderBottom='1px solid' borderColor='white'>
                    <Text>Create a post</Text>
                </Box>
                {user && (
                    <NewPostForm
                        user={user}
                        communityImageURL={communityStateValue.currentCommunity?.imageURL} />
                )}
            </>
            <>
                {communityStateValue.currentCommunity && <About communityData={communityStateValue.currentCommunity} />}
            </>
        </PageContent>
    )
}

export default SubmitPostPage