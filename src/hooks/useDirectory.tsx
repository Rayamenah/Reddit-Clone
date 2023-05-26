import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { FaReddit } from 'react-icons/fa'
import { useRecoilState, useRecoilValue } from 'recoil'
import { communityState } from '../atoms/communitiesAtom'
import { DirectoryMenuItem, directoryMenuState } from '../atoms/directoryAtom'

type Props = {}

const useDirectory = () => {
    const [directoryState, setDirectoryState] = useRecoilState(directoryMenuState)
    const communityStateValue = useRecoilValue(communityState)
    const router = useRouter()

    const toggleMenuOpen = () => {
        setDirectoryState(prev => ({
            ...prev,
            isOpen: !directoryState.isOpen
        }))
    }

    const onSelectedMenuItem = (menuItem: DirectoryMenuItem) => {
        setDirectoryState(prev => ({
            ...prev,
            selectedMenuItem: menuItem
        }))
        router.push(menuItem.link)
        if (directoryState.isOpen) {
            toggleMenuOpen()
        }

    }

    useEffect(() => {
        const { currentCommunity } = communityStateValue
        if (currentCommunity) {
            setDirectoryState(prev => ({
                ...prev,
                selectedMenuItem: {
                    displayText: `r/${currentCommunity.id}`,
                    link: `/r/${currentCommunity.id}`,
                    imageURL: currentCommunity.imageURL,
                    icon: FaReddit,
                    iconColor: 'blue.500'
                }
            }))
        }
    }, [communityStateValue.currentCommunity])
    return {
        directoryState, toggleMenuOpen, onSelectedMenuItem
    }

}

export default useDirectory