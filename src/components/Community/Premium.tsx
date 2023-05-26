import { Button, Flex, Icon, Stack, Text } from "@chakra-ui/react"
import { GiCheckedShield } from "react-icons/gi"

const Premium = () => {
    return (
        <Flex
            direction='column'
            borderRadius={4}
            cursor='pointer'
            p='12px'
            border='1px splid'
            borderColor='gray.300'
        >
            <Flex mb={2}>
                <Icon
                    as={GiCheckedShield}
                    fontSize={20}
                    color='brand'
                    mt={2} />
                <Stack spacing={1} fontSize='9pt' pl={2}>
                    <Text fontWeight={600}>Reddit Premium</Text>
                    <Text>The best Reddit experience, with monthly coins</Text>
                </Stack>
            </Flex>
            <Button height='30px' bg='brand.100'>
                Try Now
            </Button>
        </Flex>
    )
}

export default Premium