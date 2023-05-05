import { Box, Button, Checkbox, Divider, Flex, Icon, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text } from "@chakra-ui/react"
import { doc, runTransaction, serverTimestamp } from "firebase/firestore"
import { useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { BsFillEyeFill, BsFillPersonFill } from "react-icons/bs"
import { HiLockClosed } from "react-icons/hi"
import { auth, firestore } from "../../../Firebase/clientApp"

type modalProps = {
    open: boolean
    handleClose: () => void
}
const CreateCommunityModal: React.FC<modalProps> = ({ open, handleClose }) => {
    const [user] = useAuthState(auth)
    const [communityName, setCommunityName] = useState('')
    const [charsRemaining, setCharsRemaining] = useState(21)
    const [communityType, setCommunityType] = useState('public')
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length > 21) return
        setCommunityName(event.target.value)
        setCharsRemaining(21 - event.target.value.length)
    }

    const onCommunityTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCommunityType(event.target.name)
    }

    const handleCreateCommunity = async () => {
        if (error) setError("")
        //validate community name
        const format = /[ `!@#$%^&*()_+\[\]{};':"\\\|,.<>\/?~]/
        if (format.test(communityName) || communityName.length < 3) {
            setError("community names must be between 3-21 characters and can only contain letters, numbers and underscores"
            )
            return
        }

        setLoading(true)

        try {
            //create community in firestore 
            const communityDocRef = doc(firestore, 'communities', communityName)
            //runTransaction() is used to make sure that the community name is not taken by another user while the current user is creating the community and is used for communicating between collections in db
            await runTransaction(firestore, async (transaction) => {
                //check if community exists
                const communityDoc = await transaction.get(communityDocRef)
                if (communityDoc.exists()) {
                    throw new Error(`Sorry r/${communityName} is taken, try another`)
                }

                //create 'communities' collection in firestore. 
                transaction.set(communityDocRef, {
                    creatorId: user?.uid,
                    createdAt: serverTimestamp(),
                    numberOfMembers: 1,
                    privacyType: communityType
                })

                //create 'communitySnippet' subcollection (selected community name) in user credentials, the path is the directory where 'communitySnippet' field will be created which is the current user doc

                //transaction.set() will create a new document if it does not exist or update an existing document if it does exist 
                transaction.set(doc(firestore, `users/${user?.uid}/communitySnippets`, communityName), {
                    communityId: communityName,
                    //creating a community automatically makes you the moderator
                    isModerator: true
                })
            })

        } catch (error: any) {
            console.log('handleCreateCommunity error', error)
            setError(error.message)
        }
        setLoading(false)
    }
    return (
        <>

            <Modal isOpen={open} onClose={handleClose} size='lg'>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader display='flex' flexDirection='column' fontSize={15} padding={3}>
                        Create a Community
                    </ModalHeader>
                    <Box pl={3} pr={3}>
                        <Divider />
                        <ModalCloseButton />
                        <ModalBody
                            display='flex'
                            flexDirection='column'
                            padding='10px 0px'
                        >
                            <Text fontSize={15} fontWeight={400}>
                                Community names including capitalization cannot be changed
                            </Text>
                            <Text
                                position='relative'
                                top='28px'
                                left='10px'
                                width='20px'
                                color='gray.400'>r/</Text>
                            <Input
                                value={communityName}
                                size='sm'
                                pl='22px'
                                onChange={handleChange}
                                position='relative'
                            />
                            <Text
                                color={charsRemaining == 0 ? 'red' : 'gray.500'} fontSize='9pt'
                            >
                                {charsRemaining} characters remaining
                            </Text>
                            <Text fontSize='9pt' color='red'>{error}</Text>
                            <Box>
                                <Text fontWeight={600} fontSize='15' >
                                    Community type
                                </Text>
                                {/* CheckBox */}
                                <Stack spacing={2}>
                                    <Checkbox
                                        name='public'
                                        isChecked={communityType === 'public'}
                                        onChange={onCommunityTypeChange}
                                    >
                                        <Flex align='center'>
                                            <Icon as={BsFillPersonFill} color='gray.500' mr={2} />
                                            <Text fontSize='10pt' mr={2}>
                                                Public
                                            </Text>
                                            <Text fontSize='8pt' color='gray.500' pt={1}>
                                                Anyone can view, post, and comment to this community
                                            </Text>
                                        </Flex>
                                    </Checkbox>
                                    <Checkbox
                                        name='restricted'
                                        isChecked={communityType === 'restricted'} onChange={onCommunityTypeChange}
                                    >
                                        <Flex align='center'>
                                            <Icon as={BsFillEyeFill} color='gray.500' mr={2} />
                                            <Text fontSize='10pt' mr={2}>
                                                Restricted
                                            </Text>
                                            <Text fontSize='8pt' color='gray.500' pt={1}>
                                                Anyone can view this community but only approved users can post
                                            </Text>
                                        </Flex>
                                    </Checkbox>
                                    <Checkbox
                                        name='private'
                                        isChecked={communityType === 'private'}
                                        onChange={onCommunityTypeChange}
                                    >
                                        <Flex align='center'>
                                            <Icon as={HiLockClosed} color='gray.500' mr={2} />
                                            <Text fontSize='10pt' mr={2}>
                                                Private
                                            </Text>
                                            <Text fontSize='8pt' color='gray.500' pt={1}>
                                                only approved users can view and submit to this community
                                            </Text>
                                        </Flex>
                                    </Checkbox>
                                </Stack>
                            </Box>
                        </ModalBody>
                    </Box>


                    <ModalFooter bg='gray.100' borderRadius='0px 0px 10px 10px'>
                        <Button variant='outline' mr={3} onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            height='30px'
                            onClick={handleCreateCommunity}
                            isLoading={loading}>
                            Create Community
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default CreateCommunityModal


