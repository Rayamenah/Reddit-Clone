/* eslint-disable react-hooks/exhaustive-deps */
import { Stack } from '@chakra-ui/react'
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, firestore } from '../Firebase/clientApp'
import { Post, PostVote } from '../atoms/postsAtom'
import CreatePostLink from '../components/Community/CreatePostLink'
import PersonalHome from '../components/Community/PersonalHome'
import Premium from '../components/Community/Premium'
import Recommendations from '../components/Community/Recommendations'
import PageContent from '../components/Layout/PageContent'
import PostItem from '../components/Posts/PostItem'
import PostLoader from '../components/Posts/PostLoader'
import useCommunityData from '../hooks/useCommunityData'
import usePosts from '../hooks/usePosts'

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false)
  const [user, loadingUser] = useAuthState(auth)
  const { postStateValue, setPostStateValue, onSelectPost, onDeletePost, onVote } = usePosts()
  const { communityStateValue } = useCommunityData()
  const buildUserHomeFeed = async () => {
    setLoading(true)
    try {
      //get post from user communities 
      if (communityStateValue.mySnippets.length) {
        //get an array of all the communityids in the mySnippet state value
        const myCommunityIds = communityStateValue.mySnippets.map(snippet => snippet.communityId)
        // query the posts collection on firebase and filter all the communityids that match myCommunityIds
        const postQuery = query(
          collection(firestore, 'posts'),
          where('communityId', 'in', myCommunityIds),
          limit(10))

        const postDocs = await getDocs(postQuery)
        const posts = postDocs.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setPostStateValue(prev => ({
          ...prev,
          posts: posts as Post[]
        }))
      } else {
        buildNoUserHomeFeed()
      }
    } catch (error) {
      console.log('buildUserHomePage error', error)
    }
    setLoading(false)
  }

  const buildNoUserHomeFeed = async () => {
    setLoading(true)
    try {
      const postQuery = query(collection(firestore, 'posts'), orderBy('voteStatus', 'desc'), limit(10))

      const postDocs = await getDocs(postQuery)

      const posts = postDocs.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setPostStateValue(prev => ({
        ...prev,
        posts: posts as Post[]
      }))
    } catch (error) {
      console.log('buildNoUserHomeFeed error', error)
    }
    setLoading(false)
  }

  const getUserPostVotes = async () => {
    try {
      const postIds = postStateValue.posts.map(post => post.id)
      const postVoteQuery = query(
        collection(firestore, `users/${user?.uid}/postVotes`),
        where('postId', 'in', postIds)
      )
      const postVoteDocs = await getDocs(postVoteQuery)
      const postVotes = postVoteDocs.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      setPostStateValue(prev => ({
        ...prev,
        postVotes: postVotes as PostVote[]
      }))
    } catch (error) {
      console.log('getpostVotes error', error)
    }
  }

  //useEffect
  useEffect(() => {
    if (!user && !loadingUser) buildNoUserHomeFeed()
  }, [user, loadingUser])

  useEffect(() => {
    if (communityStateValue.snippetsFetched) buildUserHomeFeed()
  }, [communityStateValue.snippetsFetched])

  useEffect(() => {
    if (user && postStateValue.posts.length) getUserPostVotes()

    // below is a cleanup function to prevent postvotes state from duplicating its value
    // for example if we fetch posts in the home page when logged in and do the same when 
    // signed out we dont want the postvotes value from appearaing twice, 
    // therefore we use a cleanup function to clear out the postvote state when the function is called.
    return () => {
      setPostStateValue(prev => ({
        ...prev,
        postVotes: []
      }))
    }
  }, [postStateValue.posts, user])
  return (
    <>
      <Head>
        <title>Reddit Clone</title>
        <meta name="Reddit Clone" content="A clone of the reddit app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageContent>
        <>
          <CreatePostLink />
          {loading ? (<PostLoader />) : (
            <Stack>
              {postStateValue.posts.map(post => (
                <PostItem
                  key={post.creatorId}
                  post={post}
                  onSelectPost={onSelectPost}
                  onVote={onVote}
                  onDeletePost={onDeletePost}
                  userVoteValue={postStateValue.postVotes.find(item => item.postId === post.id)?.voteValue}
                  userIsCreator={user?.uid === post.creatorId}
                  HomePage
                />
              ))}
            </Stack>
          )}
        </>

        <Stack spacing={5}>
          <Recommendations />
          <Premium />
          <PersonalHome />
        </Stack>

      </PageContent>

    </>


  )
}

export default Home


