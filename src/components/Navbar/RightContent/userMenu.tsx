import { Menu, MenuButton, Button, MenuList, MenuItem, Flex, Icon } from "@chakra-ui/react"
import { signOut, User } from "firebase/auth"
import { FaRedditSquare } from "react-icons/fa"
import { VscAccount } from "react-icons/vsc"
import { CgProfile } from "react-icons/cg"
import { MdOutlineLogin } from "react-icons/md"
import { ChevronDownIcon } from "@chakra-ui/icons"
import { auth } from "../../../Firebase/clientApp"

type UserMenuProps = {
    user?: User | null
}
const UserMenu: React.FC<UserMenuProps> = ({ user }) => {

    return (
        <Menu>
            <MenuButton
                cursor='pointer'
                padding='0px 6px'
                borderRadius={4}
                _hover={{
                    outline: '1px solid',
                    outlineColor: 'gray.200'
                }}>
                <Flex align='center'>
                    <Flex align='center'>
                        {user ? (
                            <>
                                <Icon
                                    as={FaRedditSquare}
                                    mr={1}
                                    color='gray.300'
                                    fontSize={24}
                                />
                            </>

                        ) : (<Icon
                            as={VscAccount}
                            fontSize={24}
                            color='gray.400'
                            mr={1} />)}  </Flex>
                    <ChevronDownIcon />
                </Flex>
            </MenuButton>
            <MenuList>
                <MenuItem
                    fontSize='10pt'
                    fontWeight={700}
                    _hover={{ bg: 'blue.500', color: 'white' }}
                >
                    <Flex align='center'>
                        <Icon as={CgProfile} mr={2} fontSize={20} />
                        Profile
                    </Flex>
                </MenuItem>
                <MenuItem
                    fontSize='10pt'
                    fontWeight={700}
                    _hover={{ bg: 'blue.500', color: 'white' }}
                    onClick={() => signOut(auth)}
                >
                    <Flex align='center'>
                        <Icon as={MdOutlineLogin} mr={2} fontSize={20} />
                        Log out
                    </Flex>
                </MenuItem>

            </MenuList >
        </Menu >
    )
}

export default UserMenu