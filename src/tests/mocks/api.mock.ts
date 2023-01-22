import api from '@/services/api'
import MockAdapter from 'axios-mock-adapter'

const __TEST__ = process.env.NODE_ENV === 'test'

export const apiMockAdapter = new MockAdapter(api, {
  onNoMatch: __TEST__ ? 'throwException' : 'passthrough',
})
