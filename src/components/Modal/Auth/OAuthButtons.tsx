import { Button, Flex, Image, Text } from "@chakra-ui/react"
import { User } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { useEffect } from "react"
import { useSignInWithGoogle } from "react-firebase-hooks/auth"
import { auth, firestore } from "../../../Firebase/clientApp"

const OAuthButtons: React.FC = () => {
    const [signInWithGoogle, userCred, loading, error] = useSignInWithGoogle(auth)

    const createUserDocument = async (user: User) => {
        const userDocRef = doc(firestore, 'users', user.uid)

        // use setDoc because google sign in doesnt know if you are a new user, so update the user credentials instead of adding a new one every time you sign in 
        await setDoc(userDocRef, JSON.parse(JSON.stringify(user)))
    }

    useEffect(() => {
        if (userCred) {
            createUserDocument(userCred.user)
        }
    }, [userCred])

    return (
        <>
            <Flex direction='column' width='100%' mb={4}>
                <Button variant='oauth'
                    mb={2}
                    isLoading={loading}
                    onClick={() => signInWithGoogle()}
                >
                    <Image src='/images/googlelogo.png' alt='' height='20px' mr={4} />
                    Continue with Google
                </Button>
                {error && <Text>{error.message}</Text>}
            </Flex>
            <Text color='gray.500'>OR</Text>
        </>
    )
}

export default OAuthButtons