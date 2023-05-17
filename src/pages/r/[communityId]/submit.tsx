import { Box, Text } from "@chakra-ui/react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "../../../Firebase/clientApp"
import PageContent from "../../../components/Layout/PageContent"
import NewPostForm from "../../../components/Posts/NewPostForm"
import { useRecoilValue } from "recoil"
import { communityState } from "../../../atoms/communitiesAtom"

const SubmitPostPage = () => {
    const [user] = useAuthState(auth)
    const communitystateValue = useRecoilValue(communityState)
    return (
        <PageContent>
            <>
                <Box p='14px 0px' borderBottom='1px solid' borderColor='white'>
                    <Text>Create a post</Text>
                </Box>
                {user && <NewPostForm user={user} />}
            </>
            <></>
        </PageContent>
    )
}

export default SubmitPostPage