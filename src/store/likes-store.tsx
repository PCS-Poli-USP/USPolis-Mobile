import { likesStorage } from '@/storage/likes'
import { create } from 'zustand'

export type ILikes = Record<string, boolean>

interface TabStoreTypes {
  likes: ILikes

  populateLikes: () => Promise<void>
  like: (id: string) => Promise<void>
  removeLike: (id: string) => Promise<void>
}

export const useLikeStore = create<TabStoreTypes>((set, get) => {
  return {
    likes: {},
    populateLikes: async () => {
      const likesFromStorage = await likesStorage.get()
      set({ likes: likesFromStorage })
    },
    like: async (id: string) => {
      const { likes } = get()
      const newLikes: ILikes = { ...likes, [id]: true }
      await likesStorage.save(newLikes)
      set({ likes: newLikes })
    },
    removeLike: async (id: string) => {
      const { likes } = get()
      const newLikes: ILikes = { ...likes, [id]: false }
      await likesStorage.save(newLikes)
      set({ likes: newLikes })
    },
  }
})
