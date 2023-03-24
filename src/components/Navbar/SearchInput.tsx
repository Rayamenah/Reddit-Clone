import { Flex, Input, InputGroup, InputLeftElement, } from '@chakra-ui/react'


const SearchInput = () => {
    return (
        <Flex>
           <InputGroup>
    <InputLeftElement
      pointerEvents='none'
      children={<PhoneIcon color='gray.300' />}
    />
    <Input type='tel' placeholder='Phone number' />
  </InputGroup>

  <InputGroup>
    <InputLeftElement
      pointerEvents='none'
      color='gray.300'
      fontSize='1.2em'
      children='$'
    />
    <Input placeholder='Enter amount' />
    <InputRightElement children={<CheckIcon color='green.500' />} />
  </InputGroup>
        </Flex>
    )
}
export default SearchInput