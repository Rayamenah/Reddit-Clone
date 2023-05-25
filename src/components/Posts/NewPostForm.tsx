import { Alert, AlertIcon, Flex, Icon, Text } from "@chakra-ui/react"
import { User } from "firebase/auth"
import { Timestamp, addDoc, collection, serverTimestamp, updateDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadString } from "firebase/storage"
import { useRouter } from "next/router"
import { useState } from "react"
import { BiPoll } from "react-icons/bi"
import { BsLink45Deg, BsMic } from "react-icons/bs"
import { IoDocumentText, IoImageOutline } from "react-icons/io5"
import { firestore, storage } from "../../Firebase/clientApp"
import { Post } from "../../atoms/postsAtom"
import useSelectFile from "../../hooks/useSelectFile"
import ImageUpload from "./PostForm/ImageUpload"
import TextInputs from "./PostForm/TextInputs"
import TabItem from "./TabItem"

const formTabs: tabItem[] = [
    {
        title: 'Post',
        icon: IoDocumentText,
    },
    {
        title: 'Images & Video',
        icon: IoImageOutline,
    },
    {
        title: 'Link',
        icon: BsLink45Deg,
    },
    {
        title: 'Poll',
        icon: BiPoll,
    },
    {
        title: 'Talk',
        icon: BsMic,
    },
]
export type tabItem = {
    title: string,
    icon: typeof Icon.arguments
}

type Prop = {
    user: User
}

const NewPostForm = ({ user }: Prop) => {
    const router = useRouter()
    const [selectedTab, setSelectedTab] = useState(formTabs[0].title)
    const [textInputs, setTextInputs] = useState({
        title: '',
        body: ''
    })
    const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    const handleCreatePost = async () => {
        const { communityId } = router.query
        //create a new post object => type post 
        const newPost: Post = {
            communityId: communityId as string,
            creatorId: user.uid,
            creatorDisplayName: user.email!.split('@')[0],
            title: textInputs.title,
            body: textInputs.body,
            numberOfComments: 0,
            voteStatus: 0,
            createdAt: serverTimestamp() as Timestamp
        }
        setLoading(true)
        //store object in db 
        try {
            const postDocRef = await addDoc(collection(firestore, 'posts'), newPost)
            //check for selected file
            if (selectedFile) {
                //store in storage => getDownloadURL (return imageURL)
                const imageRef = ref(storage, `posts/${postDocRef.id}/image`)
                await uploadString(imageRef, selectedFile, 'data_url')
                const downloadURL = await getDownloadURL(imageRef)
                // update post doc by adding imageURL
                await updateDoc(postDocRef, {
                    imageURL: downloadURL
                })
            }
            //redirect the  user back to the communityPage using router 
            router.back()
        } catch (error: any) {
            console.log('handle create post error', error.message)
            setError(true)
        }
        setLoading(false)

    }

    const onTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {
            target: { name, value },
        } = event;
        setTextInputs(prev => ({
            ...prev, [name]: value
        }))
    }

    return (
        <Flex direction='column' bg='white' borderRadius={4} mt={2}>
            <Flex width='100%'  >
                {formTabs.map((item, i) => (
                    <TabItem
                        item={item}
                        key={i}
                        selected={item.title === selectedTab}
                        setSelectedTab={setSelectedTab} />

                ))}
            </Flex>
            <Flex p={6}>
                {selectedTab === 'Post' && (
                    <TextInputs
                        textInputs={textInputs}
                        handleCreatePost={handleCreatePost}
                        onChange={onTextChange}
                        loading={loading} />
                )}
                {selectedTab === 'Images & Video' &&
                    (<ImageUpload
                        selectedFile={selectedFile}
                        onSelectImage={onSelectFile}
                        setSelectedFile={setSelectedFile}
                        setSelectedTabs={setSelectedTab}
                    />)}

            </Flex>
            {error && (
                <Alert status='error'>
                    <AlertIcon />
                    <Text>Error creating post</Text>
                </Alert>
            )
            }
        </Flex >
    )
}

export default NewPostForm