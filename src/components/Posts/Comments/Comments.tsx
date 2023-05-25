import { Box, Flex, SkeletonCircle, SkeletonText, Stack, Text } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Post, postState } from '../../../atoms/postsAtom';
import CommentInput from './commentInput';
import { Timestamp, collection, doc, getDocs, increment, orderBy, query, serverTimestamp, where, writeBatch } from 'firebase/firestore';
import { firestore } from '../../../Firebase/clientApp';
import { useSetRecoilState } from 'recoil';
import CommentItem, { Comment } from './CommentItem'

type Props = {
    user: User;
    selectedPost: Post | null;
    communityId: string
}



const Comments = ({ user, selectedPost, communityId }: Props) => {

    const [commentText, setCommentText] = useState('')
    const [comments, setComments] = useState<Comment[]>([])
    const [fetchLoading, setFetchLoading] = useState(true)
    const [createLoading, setCreateLoading] = useState(false)
    const setPostState = useSetRecoilState(postState)
    const [loadingDeleteId, setLoadingDeleteId] = useState('')
    const onCreateComment = async () => {
        setCreateLoading(true)
        try {
            const batch = writeBatch(firestore)
            //create comment document in firestore
            const commentDocRef = doc(collection(firestore, 'comments'))
            const newComment: Comment = {
                id: commentDocRef.id,
                creatorId: user.uid,
                creatorDisplayText: user.email!.split('0')[0],
                communityId,
                postId: selectedPost?.id!,
                postTitle: selectedPost?.title!,
                text: commentText,
                createdAt: serverTimestamp() as Timestamp
            }

            batch.set(commentDocRef, newComment)

            //serverTimeStamp is only callable on the datbase not on the client side 
            //so we need to manually create a timestamp since we are calling this post from the client state 
            //
            newComment.createdAt = { seconds: Date.now() / 1000 } as Timestamp

            //update post number of comment 
            const postDocRef = doc(firestore, 'posts', selectedPost?.id!)

            batch.update(postDocRef, { numberOfComment: increment(1) })
            await batch.commit()

            //update client recoil state
            setCommentText('')
            setComments(prev => [newComment, ...prev])
            setPostState(prev => ({
                ...prev,
                selectedPost: {
                    ...prev.selectedPost,
                    numberOfComments: prev.selectedPost?.numberOfComments! + 1
                } as Post
            }))
        } catch (error) {

        }
        setCreateLoading(false)

    }
    const onDeleteComment = async (comment: any) => {
        setLoadingDeleteId(comment.id)
        try {
            const batch = writeBatch(firestore)
            //delete commment document
            const commentDocRef = doc(firestore, 'comments', comment.id)
            batch.delete(commentDocRef)

            //update post number of document 
            const postDocRef = doc(firestore, 'posts', selectedPost?.id!)
            batch.update(postDocRef, { numberOfComment: increment(-1) })
            await batch.commit()

            //update client recoil state 
            setPostState(prev => ({
                ...prev,
                selectedPost: {
                    ...prev.selectedPost,
                    numberOfComments: prev.selectedPost?.numberOfComments! - 1
                } as Post
            }))
            setComments((prev) => prev.filter((item) => item.id !== comment.id))

        } catch (error) {
            console.log('delete post error', error)
        }
        setLoadingDeleteId('')
    }
    const getPostcomments = async () => {
        try {
            const commentQuery = query(
                collection(firestore, 'comments'),
                where('postId', '==', selectedPost?.id),
                orderBy('createdAt', 'desc')
            )
            const commentDocs = await getDocs(commentQuery)
            const comments = commentDocs.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            setComments(comments as Comment[])

        } catch (error) {
            console.log('getPostComment error', error)
        }
        setFetchLoading(false)
    }

    useEffect(() => {
        if (!selectedPost) return
        getPostcomments()

    }, [selectedPost])


    return (
        <Box
            bg='white'
            borderRadius='0px 0px 4px 4px'
            p={2}
        >
            <Flex
                direction='column'
                pt={10}
                pr={4}
                mb={6}
                fontSize='10pt'
                width='100p%'>
                {!fetchLoading && <CommentInput
                    commentText={commentText}
                    user={user}
                    setCommentText={setCommentText}
                    createLoading={createLoading}
                    onCreateComment={onCreateComment}
                />}
            </Flex>
            <Stack p={2}>
                {fetchLoading ? (
                    [0, 1, 2].map(item => (
                        <Box
                            key={item}
                            padding='6'
                            bg='white'
                        >
                            <SkeletonCircle size='10' />
                            <SkeletonText mt='4' noOfLines={2} spacing='4' />
                        </Box>
                    ))
                ) : (
                    <>
                        {comments.length === 0 ?
                            (
                                <Flex
                                    direction='column'
                                    justify='center'
                                    align='center'
                                    borderTop='1px solid'
                                    borderColor='gray.100'
                                    p={20}
                                >
                                    <Text fontWeight={700} opacity={0.3}>
                                        No Comments Yet
                                    </Text>
                                </Flex>
                            ) : (
                                <>
                                    {comments.map(comment => (
                                        <CommentItem
                                            key={comment.id}
                                            comment={comment}
                                            onDeleteComment={onDeleteComment}
                                            loadingDelete={loadingDeleteId === comment.id}
                                            userId={user.uid} />
                                    ))}
                                </>
                            )
                        }
                    </>
                )}

            </Stack>

        </Box>
    )
}

export default Comments