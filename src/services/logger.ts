import {
  init,
  track,
  Identify,
  identify,
} from '@amplitude/analytics-react-native'

class LogProvider {
  constructor() {
    init('55fe855beb49fbf690915ef0fe5de261')
  }

  logEvent(name: string, properties?: object) {
    track(name, properties)

    if (__DEV__) {
      console.log(
        `[SENDING EVENT] ${name} ${
          properties ? JSON.stringify(properties) : ''
        }`,
      )
    }
  }

  setUserProperty(key: string, value: string) {
    if (__DEV__) {
      console.log(`[SETTING USER PROPERTY] ${key} ${value}`)
    }

    const user = new Identify()
    user.set(key, value)
    identify(user)
  }
}

export const logger = new LogProvider()
