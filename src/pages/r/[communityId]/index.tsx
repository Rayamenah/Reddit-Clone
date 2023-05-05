import { doc, getDoc } from "firebase/firestore"
import { GetServerSidePropsContext } from "next"
import safeJsonStringify from "safe-json-stringify"
import { firestore } from "../../../Firebase/clientApp"
import { Community } from "../../../atoms/communitiesAtom"


type CommunityPageProps = {
    communityData: Community;
}
const CommunityPage = ({ communityData }: CommunityPageProps) => {
    // console.log(communityData)
    if (!communityData) {
        return <div> community does not exist </div>
    }

    return (
        <div>welcome to r/{communityData.id}</div>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    //get community data
    try {
        const communityDocRef = doc(firestore, 'communities', context.query.communityId as string)

        const communityDoc = await getDoc(communityDocRef)

        // console.log(communityDoc.data())

        return {
            props: {
                // returning communityDoc.data() creates a serialization error because of next not recognizing the type of firebase 'Timestamp' so a package 'safeJsonStringify' is used to completely convert our data to a string 
                communityData: communityDoc.exists() ? JSON.parse(safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() })) : ""
            }
        }
    } catch (error) {
        //could add error page here

        console.log('getServerSideProps error', error)
        //return empty props if community does not exist or there is an error getting the data from firestore 
        return {
            props: {
                communityData: ''
            }
        }
    }
}
export default CommunityPage