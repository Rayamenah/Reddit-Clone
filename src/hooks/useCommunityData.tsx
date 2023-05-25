import { collection, doc, getDoc, getDocs, increment, writeBatch } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { useRecoilState, useSetRecoilState } from "recoil"
import { auth, firestore } from "../Firebase/clientApp"
import { authModalState } from "../atoms/authModalAtom"
import { Community, CommunitySnippet, communityState } from "../atoms/communitiesAtom"
import { useRouter } from "next/router"

const useCommunityData = () => {
    const router = useRouter()
    const [user] = useAuthState(auth)
    const [communityStateValue, setCommunityStateValue] = useRecoilState(communityState)
    const setAuthModalState = useSetRecoilState(authModalState)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')


    const onJoinOrLeaveCommunity = (communityData: Community, isJoined: boolean) => {
        //check if user is signed in
        //if not signed in => open authModal
        if (!user) {
            setAuthModalState({ open: true, view: 'login' })
            return
        }

        if (isJoined) {
            leaveCommunity(communityData.id)
            return
        }
        joinCommunity(communityData)
    }

    const joinCommunity = async (communityData: Community) => {

        //batch write    
        // creating a new community snippet 
        setLoading(true)
        try {
            const batch = writeBatch(firestore)

            const newSnippet: CommunitySnippet = {
                communityId: communityData.id,
                imageURL: communityData.imageURL || ''
            }
            //'transactions' are used for read and write purposes but for this situation
            //since we are only writing to the db batch is preferred to update the communitySnippet object on the db
            batch.set(doc(firestore, `users/${user?.uid}/communitySnippets`, communityData.id), newSnippet)

            //updating the number of members on community object in community collection in db
            batch.update(doc(firestore, 'communities', communityData.id), {
                numberOfMembers: increment(1)
            })
            //call batch.commit() to update the change 
            await batch.commit()

            //update recoil state => communityState.mysnippets
            setCommunityStateValue(prev => ({
                prev,
                mySnippets: [...prev.mySnippets, newSnippet]
            }))
        } catch (error: any) {
            console.log('join community error', error)
            setError(error.message)
        }
        setLoading(false)

    }
    const leaveCommunity = (communityId: string) => {
        //batch write    
        // deleting the community snippet 
        try {
            const batch = writeBatch(firestore)
            //delete the community from the "communitySnippet" field in db
            batch.delete(doc(firestore, `users/${user?.uid}/communitySnippets`, communityId))
            //updating the number of members on community object in community collection in db
            batch.update(doc(firestore, 'communities', communityId), {
                numberOfMembers: increment(-1)
            })
            //update recoil state =communityState.mysnippets
            setCommunityStateValue(prev => ({
                prev,
                mySnippets: prev.mySnippets.filter(item => {
                    item.communityId !== communityId
                })
            }))
        } catch (error: any) {
            setError(error.message)
        }
        setLoading(false)

    }
    const getMySnippets = async () => {
        setLoading(true)
        try {
            const snippetDocs = await getDocs(collection(firestore, `users/${user?.uid}/communitySnippets`))
            const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }))
            setCommunityStateValue(prev => ({ ...prev, mySnippets: snippets as CommunitySnippet[] }))

            console.log('here are snippets', snippets)

        } catch (error: any) {
            console.log('getMySnippets error', error)
            setError(error.message)
        }
        setLoading(false)

    }

    const getCommunityData = async (communityId: string) => {
        try {
            const communityDocRef = doc(firestore, 'communities', communityId)
            const communityDoc = await getDoc(communityDocRef)

            setCommunityStateValue(prev => ({
                ...prev,
                currentCommunity: { id: communityDoc.id, ...communityDoc.data() } as Community
            }))
        } catch (error) {
            console.log('getCommunityDataError, error')
        }
    }

    useEffect(() => {
        if (!user) {
            setCommunityStateValue((prev) => ({
                ...prev,
                mySnippets: []
            }))
        }
        getMySnippets();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    useEffect(() => {
        const { communityId } = router.query
        if (communityId && !communityStateValue.currentCommunity) {
            getCommunityData(communityId as string)
        }
    }, [router.query, communityStateValue.currentCommunity])

    return {
        communityStateValue,
        onJoinOrLeaveCommunity,
        loading
    }
}

export default useCommunityData