import { AbTesting } from "@/dtos";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { AB_TESTING_STORAGE } from "./config";

export const abTestingStorage = {
  save: async (abTesting: AbTesting) => {
    await AsyncStorage.setItem(AB_TESTING_STORAGE, JSON.stringify(abTesting))
  },
  get: async () => {
    const abTesting = await AsyncStorage.getItem(AB_TESTING_STORAGE)
    return abTesting ? JSON.parse(abTesting) : null as AbTesting | null
  },
  delete: async () => {
    await AsyncStorage.removeItem(AB_TESTING_STORAGE)
  }
}