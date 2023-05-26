import { atom } from "recoil";

interface CreateCommunityMenuState {
    isOpen: boolean;

}

export const defaultMenuState: CreateCommunityMenuState = {
    isOpen: false,
}

export const createCommunityMenuState = atom<CreateCommunityMenuState>({
    key: 'createCommunityMenuState',
    default: defaultMenuState
})