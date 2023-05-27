import { MenuItem, Flex, Icon, Image, Text } from "@chakra-ui/react";
import { IconType } from "react-icons";
import useDirectory from "../../../hooks/useDirectory";
import Link from "next/link";

type Props = {
    displayText: string;
    link: string;
    icon: IconType;
    iconColor: string;
    imageURL?: string
}
const MenuListItem = ({ displayText, icon, iconColor, imageURL, link }: Props) => {
    const { onSelectedMenuItem } = useDirectory()
    return (
        <MenuItem
            width='100%'
            fontSize='10pt'
            _hover={{ bg: 'gray.100' }}
            onClick={() => { onSelectedMenuItem({ displayText, link, icon, iconColor, imageURL }) }}
        >
            <Flex align='center'>
                {imageURL ? (
                    <Image alt='community icon' src={imageURL} borderRadius='full' boxSize='10px' mr={2} />
                ) : (
                    <Icon as={icon} fontSize={20} color={iconColor} mr={2} />
                )}
                <Link href={link}>
                    <Text
                        fontWeight={700}
                        _hover={{ textDecoration: 'underLine' }}
                    >
                        {displayText}
                    </Text>
                </Link>

            </Flex>

        </MenuItem>
    )
}

export default MenuListItem