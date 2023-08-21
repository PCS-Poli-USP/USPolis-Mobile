type TestType = boolean

export type AbTesting = {
  EXAMPLE_TEST: TestType
}

export const DEFAULT_AB_TESTING: AbTesting = {
  EXAMPLE_TEST: false,
}

export const generateAbTesting = (): AbTesting => {
  return {
    EXAMPLE_TEST: Math.random() > 0.5,
  }
}
