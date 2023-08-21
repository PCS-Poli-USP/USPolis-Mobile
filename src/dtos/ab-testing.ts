type TestType = boolean

export type AbTesting = {
  FULL_SEARCH: TestType
}

export const DEFAULT_AB_TESTING: AbTesting = {
  FULL_SEARCH: false,
}

export const generateAbTesting = (): AbTesting => {
  return {
    FULL_SEARCH: Math.random() > 0.5,
  }
}
