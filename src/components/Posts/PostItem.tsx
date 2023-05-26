import { Alert, AlertIcon, Flex, Icon, Image, Link, Skeleton, Spinner, Stack, Text } from '@chakra-ui/react';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsChat, BsDot } from 'react-icons/bs';
import { FaReddit } from 'react-icons/fa';
import { IoArrowDownCircleOutline, IoArrowDownCircleSharp, IoArrowRedoOutline, IoArrowUpCircleOutline, IoArrowUpCircleSharp, IoBookmarkOutline } from 'react-icons/io5';
import { Post } from '../../atoms/postsAtom';

type Props = {
    post: Post;
    userIsCreator: boolean;
    userVoteValue?: number;
    onVote: (
        //event propagation 
        event: React.MouseEvent<SVGElement, MouseEvent>,
        post: Post,
        vote: number,
        communityId: string) => void;
    onDeletePost: (post: Post) => Promise<boolean>;
    onSelectPost?: (post: Post) => void
    HomePage?: boolean
}

const PostItem = ({
    post,
    userIsCreator,
    userVoteValue,
    onVote,
    onDeletePost,
    onSelectPost,
    HomePage
}: Props) => {
    const [loadingImage, setLoadingImage] = useState(true)
    const [error, setError] = useState('')
    const [loadingDelete, setLoadingDelete] = useState(false)
    const router = useRouter()

    //singlePostPage is a conditional for reusing this component without onSelectPost function
    const singlePostPage = !onSelectPost

    const handleDelete = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => {
        //event.stopPropagation is used here to prevent the function from being called twice
        event.stopPropagation()
        try {
            setLoadingDelete(true)
            const success = await onDeletePost(post)
            if (!success) {
                throw new Error('failed to delete post')
            }

            if (singlePostPage) {
                router.push(`/r/${post.communityId}`)
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
            borderColor={singlePostPage ? 'white' : 'gray.300'}
            borderRadius={singlePostPage ? '4px 4px 0px 0px' : '4px'}
            _hover={{ borderColors: singlePostPage ? 'none' : 'gray.500' }}
            cursor={singlePostPage ? 'unset' : 'pointer'}
            onClick={() => onSelectPost && onSelectPost(post)}
        >
            <Flex
                direction='column'
                align='center'
                bg={singlePostPage ? 'none' : 'gray.100'}
                p={2}
                borderRadius={singlePostPage ? '0' : '3px 0px 0px 3px'}
            >
                <Icon
                    as={userVoteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline}
                    color={userVoteValue === 1 ? 'brand.100' : 'gray.400'}
                    fontSize={22}
                    onClick={(event) => onVote(event, post, 1, post.communityId)}
                />
                <Text fontSize='9pt'>{post.voteStatus}</Text>
                <Icon
                    as={userVoteValue === -1 ? IoArrowDownCircleSharp : IoArrowDownCircleOutline}
                    color={userVoteValue === -1 ? '#4379ff' : 'gray.400'}
                    fontSize={22}
                    onClick={(event) => onVote(event, post, -1, post.communityId)}
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
                        {HomePage && (
                            <>
                                {post.communityImageURL ? (
                                    <Image
                                        alt='community image'
                                        src={post.communityImageURL}
                                        borderRadius='full'
                                        boxSize='10px'
                                        mr={2}
                                    />) : (
                                    <Icon as={FaReddit} fontSize='10pt' mr={1} color='blue.500' />
                                )}
                                <Link href={`/r/${post.communityId}`}>
                                    <Text
                                        fontWeight={700}
                                        _hover={{ textDecoration: 'underLine' }}
                                        onClick={event => event.stopPropagation()}
                                    >
                                        {`r/${post.communityId}`}
                                    </Text>

                                </Link>
                                <Icon as={BsDot} color='gray.500' fontSize={8} />
                            </>
                        )}
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
        </Flex >
    )
}

export default PostItem