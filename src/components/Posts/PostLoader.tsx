import { Box, Stack, SkeletonText, Skeleton } from "@chakra-ui/react"

const PostLoader = () => {
    return (
        <Stack spacing={6}>
            <Box padding='10px 10px' boxShadow='lg' bg='white' borderRadius={4}>
                <SkeletonText mt='4' noOfLines={2} width='40%' spacing='4' />
                <SkeletonText mt='4' noOfLines={6} spacing='4' />
                <Skeleton mt='4' height='20px' />
            </Box>
            <Box padding='10px 10px' boxShadow='lg' bg='white' borderRadius={4}>
                <SkeletonText mt='4' noOfLines={1} width='40%' spacing='4' />
                <SkeletonText mt='4' noOfLines={4} spacing='4' />
                <Skeleton mt='4' height='200px' />
            </Box>
        </Stack>
    )
}
export default PostLoader 