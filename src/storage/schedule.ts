import AsyncStorage from '@react-native-async-storage/async-storage'

import { SCHEDULE_STORAGE } from './config'

export const scheduleStorage = {
  get: async () => {
    const schedule = await AsyncStorage.getItem(SCHEDULE_STORAGE)
    return schedule ? JSON.parse(schedule) : null
  },
  save: async (classes: Array<string>) => {
    await AsyncStorage.setItem(SCHEDULE_STORAGE, JSON.stringify(classes))
  },
  delete: async () => {
    await AsyncStorage.removeItem(SCHEDULE_STORAGE)
  },
}
