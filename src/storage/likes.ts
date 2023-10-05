import AsyncStorage from '@react-native-async-storage/async-storage'

import { LIKES_STORAGE } from './config'
import { ILikes } from '@/store/likes-store'

export const likesStorage = {
  get: async (): Promise<ILikes> => {
    const likes = await AsyncStorage.getItem(LIKES_STORAGE)
    return likes ? JSON.parse(likes) : null
  },
  save: async (likes: ILikes) => {
    await AsyncStorage.setItem(LIKES_STORAGE, JSON.stringify(likes))
  },
  delete: async () => {
    await AsyncStorage.removeItem(LIKES_STORAGE)
  },
}
