import { User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, firestore } from '../../../../Firebase/clientApp'
import { Post } from '../../../../atoms/postsAtom'
import About from '../../../../components/Community/About'
import PageContent from '../../../../components/Layout/PageContent'
import Comments from '../../../../components/Posts/Comments/Comments'
import PostItem from '../../../../components/Posts/PostItem'
import useCommunityData from '../../../../hooks/useCommunityData'
import usePosts from '../../../../hooks/usePosts'

type Props = {}

const PostPage = (props: Props) => {
    const [user] = useAuthState(auth)
    const router = useRouter()
    const { communityStateValue } = useCommunityData()
    const { postStateValue, setPostStateValue, onDeletePost, onVote } = usePosts()

    const fetchPost = async (postId: string) => {
        try {
            const postDocRef = doc(firestore, 'posts', postId)
            const postDoc = await getDoc(postDocRef)
            setPostStateValue(prev => ({
                ...prev,
                selectedPost: { id: postDoc.id, ...postDoc.data() } as Post
            }))
        } catch (error) {
            console.log('fetchPost error', error)
        }
    }

    useEffect(() => {
        const { pid } = router.query
        // if the post is not selected from the community but is instead loaded
        //from a link then fetch the post from the firestore db
        if (pid && !postStateValue.selectedPost) {
            fetchPost(pid as string)
        }
    }, [])
    return (
        <PageContent>
            <>
                {postStateValue.selectedPost &&
                    <PostItem
                        post={postStateValue.selectedPost}
                        onVote={onVote}
                        onDeletePost={onDeletePost}
                        userVoteValue={postStateValue.postVotes.find((item) => item.postId === postStateValue.selectedPost?.id)?.voteValue
                        }
                        userIsCreator={user?.uid === postStateValue.selectedPost?.creatorId}
                    />}
                <Comments user={user as User} selectedPost={postStateValue.selectedPost} communityId={postStateValue.selectedPost?.communityId as string} />
            </>

            <>
                {communityStateValue.currentCommunity && <About communityData={communityStateValue.currentCommunity} />}
            </>
        </PageContent>)
}

export default PostPage