import { collection, deleteDoc, doc, getDocs, query, where, writeBatch } from 'firebase/firestore'
import { deleteObject, ref } from 'firebase/storage'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { auth, firestore, storage } from '../Firebase/clientApp'
import { authModalState } from '../atoms/authModalAtom'
import { communityState } from '../atoms/communitiesAtom'
import { Post, PostVote, postState } from '../atoms/postsAtom'

type Props = {}

const usePosts = () => {
    const [user] = useAuthState(auth)
    const router = useRouter()
    const [postStateValue, setPostStateValue] = useRecoilState(postState)
    const currentCommunity = useRecoilValue(communityState).currentCommunity
    const setAuthModalState = useSetRecoilState(authModalState)


    const onVote = async (
        event: React.MouseEvent<SVGElement, MouseEvent>,
        post: Post,
        vote: number,
        communityId: string) => {

        event.stopPropagation()
        if (!user) {
            setAuthModalState({ open: true, view: 'login' })
            return
        }
        try {
            const { voteStatus } = post
            const existingVote = postStateValue.postVotes.find(vote => vote.postId === post.id)

            //create copies of state that can be mutated without using useState
            const batch = writeBatch(firestore)
            const updatedPost = { ...post }
            const updatedPosts = [...postStateValue.posts]
            let updatedPostVotes = [...postStateValue.postVotes]
            let voteChange = vote

            //new vote
            if (!existingVote) {
                //create new post dcument
                const postVoteRef = doc(collection(firestore, 'users', `${user?.uid}/postVotes`))
                const newVote: PostVote = {
                    id: postVoteRef.id,
                    postId: post.id!,
                    communityId,
                    voteValue: vote //  +/-1
                }

                batch.set(postVoteRef, newVote)

                //add or subtract 1 to/from post.votestatus
                updatedPost.voteStatus = voteStatus + vote
                updatedPostVotes = [...updatedPostVotes, newVote]

            }
            //existing vote - they have voted before
            else {
                const postVoteRef = doc(
                    firestore,
                    'users',
                    `${user?.uid}/postVotes/${existingVote.id}`
                )

                //removing their vote (up => neutral OR down => neutral)
                if (existingVote.voteValue === vote) {
                    //add/subtract 1 to/from post.voteStatus
                    updatedPost.voteStatus = voteStatus - vote
                    //remove the unvoted post vote from array of voted posts
                    updatedPostVotes = updatedPostVotes.filter(vote => vote.id !== existingVote.id)
                    //delete the postVote document 
                    batch.delete(postVoteRef)
                    voteChange *= -1

                }

                //flipping their vote (up => neutral OR down => up)
                else {

                    // add/subtract 1 to/from post.voteStatus
                    updatedPost.voteStatus = voteStatus + 2 * vote

                    const voteIndex = postStateValue.postVotes.findIndex(vote => vote.id === existingVote.id)

                    updatedPostVotes[voteIndex] = {
                        ...existingVote, voteValue: vote
                    }

                    //updating the existing postVote document 
                    batch.update(postVoteRef, { voteValue: vote })

                    voteChange = 2 * vote
                }
            }

            //update state with updated values
            const postIdx = postStateValue.posts.findIndex(item => item.id === post.id)
            updatedPosts[postIdx] = updatedPost

            setPostStateValue((prev) => ({
                ...prev,
                posts: updatedPosts,
                postVotes: updatedPostVotes
            }))

            if (postStateValue.selectedPost) {
                setPostStateValue(prev => ({
                    ...prev,
                    selectedPost: updatedPost
                }))
            }

            // update our post document 
            const postRef = doc(firestore, 'posts', post.id!)
            batch.update(postRef, { voteStatus: voteStatus + voteChange })

            await batch.commit()
        } catch (error: any) {
            console.log(error.message)
        }

    }
    const onSelectPost = (post: Post) => {
        setPostStateValue((prev) => ({
            ...prev,
            selectedPost: post
        }))
        router.push(`/r/${post.communityId}/comments/${post.id}`)
    }
    const onDeletePost = async (post: Post): Promise<boolean> => {
        try {
            // check if theres an image and delete if it exists 
            if (post.imageURL) {
                const imageRef = ref(storage, `posts/${post.id}/image`)
                await deleteObject(imageRef)
            }
            //delete post document from firebase 
            const postDocRef = doc(firestore, 'posts', post.id!)
            await deleteDoc(postDocRef)
            //update recoil state
            setPostStateValue(prev => ({
                ...prev,
                posts: prev.posts.filter(item => item.id !== post.id)
            }))
            return true
        } catch (error) {
            return false
        }
    }

    const getCommunityPostVotes = async (communityId: string) => {
        const postVoteQuery = query(
            collection(firestore, 'users', `${user?.uid}/postVotes`),
            where('communityId', '==', communityId)
        )

        const postVoteDocs = await getDocs(postVoteQuery)
        const postVotes = postVoteDocs.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }))
        setPostStateValue((prev) => ({
            ...prev,
            postVotes: postVotes as PostVote[]
        }))
    }

    useEffect(() => {
        if (!user || !currentCommunity?.id) return
        getCommunityPostVotes(currentCommunity?.id!)
    }, [user, currentCommunity])


    useEffect(() => {
        //clear post votes 
        if (!user) {
            setPostStateValue((prev) => ({
                ...prev,
                postVotes: []
            }))
        }
    }, [user])

    return {
        postStateValue,
        setPostStateValue,
        onVote,
        onSelectPost,
        onDeletePost
    }
}

export default usePosts