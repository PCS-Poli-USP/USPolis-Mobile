import { User } from "@/dtos";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { USER_STORAGE } from "./config";

export const userStorage = {
  save: async (user: User) => {
    await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user))
  },
  get: async () => {
    const user = await AsyncStorage.getItem(USER_STORAGE)
    return user ? JSON.parse(user) : null
  },
  delete: async () => {
    await AsyncStorage.removeItem(USER_STORAGE)
  }
}