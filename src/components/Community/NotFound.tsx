import { Button, Flex } from "@chakra-ui/react"
import Link from "next/link"

const CommunityNotFound = () => {
    return (
        <Flex
            direction='column'
            justifyContent='center'
            alignItems='center'
            minHeight='60vh'
        >
            sorry, that community does not exist or has been banned
            <Link href='/'>
                <Button mt={4}>GO HOME</Button>
            </Link>
        </Flex>
    )
}
export default CommunityNotFound