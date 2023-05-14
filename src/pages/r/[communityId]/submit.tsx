import { Box, Text } from "@chakra-ui/react"
import PageContent from "../../../components/Layout/PageContent"
import NewPostForm from "../../../components/Posts/NewPostForm"

const SubmitPostPage = () => {
    return (
        <PageContent>
            <>
                <Box p='14px 0px' borderBottom='1px solid' borderColor='white'>
                    <Text>Create a post</Text>
                </Box>
                <NewPostForm />
            </>
            <></>
        </PageContent>
    )
}

export default SubmitPostPage