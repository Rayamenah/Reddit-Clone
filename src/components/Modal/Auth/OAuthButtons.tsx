import { Button, Flex, Image } from "@chakra-ui/react"


const OAuthButtons = () => {
    return (
        <Flex direction='column' width='100%' mb={4}>
            <Button variant='oauth'>
                <Image src='/images/googlelogo.png' alt='' height='20px' mr={4} />
                Continue with Google
            </Button>
        </Flex>
    )
}

export default OAuthButtons