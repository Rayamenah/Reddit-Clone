
import { Button, Flex, Image, Stack } from '@chakra-ui/react';
import { useRef } from 'react';

type Props = {
    selectedFile?: string;
    onSelectImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
    setSelectedTabs: (value: string) => void;
    setSelectedFile: (value: string) => void;

}

const ImageUpload = ({ setSelectedTabs, selectedFile, onSelectImage, setSelectedFile }: Props) => {
    const selectedFileRef = useRef<HTMLInputElement>(null)
    return (
        <Flex direction='column' justify='center' align='center' width='100%' >
            {selectedFile ?
                <>
                    <Image
                        src={selectedFile}
                        alt='upload image'
                        maxWidth='400px'
                        maxHeight='400px'
                    />
                    <Stack direction='row' mt={4}>
                        <Button height='20px' onClick={() => setSelectedTabs('Post')} >Back to post</Button>
                        <Button variant='outline' height='20px' onClick={() => setSelectedFile('')}>Remove</Button>
                    </Stack>
                </> : (
                    <Flex
                        justify='center'
                        align='center'
                        p={20}
                        border='1px dashed'
                        borderColor='gray.200'
                        width='100%'
                        borderRadius={4}>
                        <Button variant='outline' height='20px' onClick={() => selectedFileRef.current?.click()}>
                            Upload
                        </Button>
                        <input ref={selectedFileRef} type='file' hidden onChange={onSelectImage}
                        />
                    </Flex>
                )}
        </Flex>)
}

export default ImageUpload