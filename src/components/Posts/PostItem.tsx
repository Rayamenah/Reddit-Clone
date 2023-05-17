import { Alert, AlertIcon, Flex, Icon, Image, Skeleton, Spinner, Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsChat } from 'react-icons/bs';
import { IoArrowDownCircleOutline, IoArrowDownCircleSharp, IoArrowRedoOutline, IoArrowUpCircleOutline, IoArrowUpCircleSharp, IoBookmarkOutline } from 'react-icons/io5';
import { Post } from '../../atoms/postsAtom';
import moment from 'moment';

type Props = {
    post: Post;
    userIsCreator: boolean;
    userVoteValue?: number;
    onVote: (post: Post, vote: number, communityId: string) => void;
    onDeletePost: (post: Post) => Promise<boolean>;
    onSelectPost: () => void
}

const PostItem = ({
    post,
    userIsCreator,
    userVoteValue,
    onVote,
    onDeletePost,
    onSelectPost
}: Props) => {
    const [loadingImage, setLoadingImage] = useState(true)
    const [error, setError] = useState('')
    const [loadingDelete, setLoadingDelete] = useState(false)
    const handleDelete = async () => {
        try {
            setLoadingDelete(true)
            const success = await onDeletePost(post)
            if (!success) {
                throw new Error('failed to delete post')
            }
        } catch (error: any) {
            setError(error.message)
        }
        setLoadingDelete(false)
    }
    return (
        <Flex
            border='1px solid'
            bg='white'
            borderColor='gray.300'
            borderRadius={4}
            _hover={{ borderColors: 'gray.500' }}
            cursor='pointer'
            onClick={onSelectPost}
        >
            <Flex direction='column' align='center' bg='gray.100' p={2} borderRadius={4} >
                <Icon
                    as={userVoteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline}
                    color={userVoteValue === 1 ? 'brand.100' : 'gray.400'}
                    fontSize={22}
                    onClick={() => onVote(post, 1, post.communityId)}
                />
                <Text fontSize='9pt'>{post.voteStatus}</Text>
                <Icon
                    as={userVoteValue === -1 ? IoArrowDownCircleSharp : IoArrowDownCircleOutline}
                    color={userVoteValue === -1 ? '#4379ff' : 'gray.400'}
                    fontSize={22}
                    onClick={() => onVote(post, -1, post.communityId)}
                />
            </Flex>
            <Flex direction='column' width='100%'>
                {error && (
                    <Alert status='error'>
                        <AlertIcon />
                        <Text mr={2}>{error}t</Text>
                    </Alert>
                )
                }
                <Stack spacing={1} p='10px'>
                    <Stack
                        direction='row'
                        spacing={0.6}
                        align='center'
                        fontSize='0pt'
                    >
                        <Text>
                            Posted by u/{post.creatorDisplayName}{' '}
                            {moment(new Date(post.createdAt?.seconds * 1000)).fromNow()}
                        </Text>
                    </Stack>
                    <Text fontSize='12pt' fontWeight={600}>{post.title}</Text>
                    <Text fontSize='10pt'>{post.body}</Text>
                    {post.imageURL && (
                        <Flex justify='center' align='center' p={2}>
                            {loadingImage && (
                                <Skeleton height='200px' width='100%' borderRadius={4} />
                            )}
                            <Image
                                src={post.imageURL}
                                alt='post image'
                                onLoad={() => setLoadingImage(false)}
                                display={loadingImage ? 'none' : 'unset'}
                            />
                        </Flex>
                    )}
                </Stack>
                <Flex ml={1} color='gray.500' >
                    <Flex
                        align='center'
                        p='8px 10px'
                        borderRadius={4}
                        _hover={{ bg: 'gray.200' }}
                        cursor='pointer'
                    >
                        <Icon as={BsChat} mr={2} />
                    </Flex>
                    <Flex
                        align='center'
                        p='8px 10px'
                        borderRadius={4}
                        _hover={{ bg: 'gray.200' }}
                        cursor='pointer'                    >
                        <Icon as={IoArrowRedoOutline} mr={2} />
                    </Flex>
                    <Flex
                        align='center'
                        p='8px 10px'
                        borderRadius={4}
                        _hover={{ bg: 'gray.200' }}
                        cursor='pointer'
                    >
                        <Icon as={IoBookmarkOutline} mr={2} />
                    </Flex>
                    {userIsCreator && (<Flex
                        align='center'
                        p='8px 10px'
                        borderRadius={4}
                        _hover={{ bg: 'gray.200' }}
                        cursor='pointer'
                        onClick={handleDelete}
                    >
                        {loadingDelete ? (
                            <Spinner size='sm' />
                        ) : (
                            <>
                                <Icon as={AiOutlineDelete} mr={2} />
                                <Text fontSize='9pt' >Delete</Text>
                            </>
                        )}
                    </Flex>)}

                </Flex>
            </Flex>
        </Flex>
    )
}

export default PostItem