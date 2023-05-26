import { Stack } from '@chakra-ui/react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../../Firebase/clientApp';
import { Community } from '../../atoms/communitiesAtom';
import { Post } from '../../atoms/postsAtom';
import usePosts from '../../hooks/usePosts';
import PostItem from './PostItem';
import PostLoader from './PostLoader';

type Props = {
    communityData: Community;
}

const Posts = ({ communityData }: Props) => {
    const [user] = useAuthState(auth)
    const [loading, setLoading] = useState(false)
    const { postStateValue, setPostStateValue, onVote, onDeletePost, onSelectPost } = usePosts()

    const getPosts = async () => {
        try {
            setLoading(true)
            //get post for this community 
            const postQuery = query(
                collection(firestore, 'posts'),
                where('communityId', '==', communityData.id),
                orderBy('createdAt', 'desc')
            );
            const postDocs = await getDocs(postQuery)

            //enable indexing in firebase console 6:15:42
            const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            setPostStateValue((prev: any) => ({
                ...prev, posts: posts as Post[]
            }))

        } catch (error: any) {
            console.log('get post error', error.message)
        }
        setLoading(false)
    }

    useEffect(() => {
        getPosts()
    }, [communityData])
    return (
        <>
            {loading ? (<PostLoader />) : (
                <Stack>
                    {postStateValue.posts.map((item) => (
                        <PostItem
                            key={item.id}
                            post={item}
                            userIsCreator={user?.uid === item.creatorId}
                            userVoteValue={
                                postStateValue.postVotes.find((vote) => vote.postId === item.id)?.voteValue
                            }
                            onVote={onVote}
                            onDeletePost={onDeletePost}
                            onSelectPost={onSelectPost}
                        />))}
                </Stack>
            )}

        </>
    )
}

export default Posts