import MockAdapter from 'axios-mock-adapter'
import { isMatching } from 'ts-pattern'
import { Function } from 'ts-toolbelt'
import {
  allMockAdapterHandlers,
  errorCasePattern,
  IErrorCasePattern,
  ISuccessStubCase,
  ReturnTypeSetupUseQuery,
  StubCasePattern,
  stubCasePattern,
  successCasePattern,
} from './factory.types'

const isErrorStubCase = <T>(value: any): value is IErrorCasePattern => {
  return _isErrorStubCase(value)
}
const isSuccessStubCase = (value: any): value is ISuccessStubCase => {
  return _isSuccessStubCase(value)
}

export const isStubCase = isMatching(stubCasePattern)
const _isErrorStubCase = isMatching(errorCasePattern)
const _isSuccessStubCase = isMatching(successCasePattern)

const assertsFunctionSetupUseQuery = <T, R>(
  v: any,
): v is Function.Function<[T], R> => {
  const isUndefined = v === undefined
  const isFunction = typeof v === 'function'
  return isUndefined || isFunction
}
const assertsObjectSetupUseQuery = <T>(v: any): v is T => {
  const isObject = typeof v === 'object'
  const isArray = Array.isArray(v)
  return isObject || isArray
}
export const setupUseQueryFactory = <CTStubs extends StubCasePattern>(
  axiosInstance: MockAdapter,
  urlRegex: RegExp | string,
  handler: allMockAdapterHandlers,
  stubCases: CTStubs,
) => {
  if (!isStubCase(stubCases)) {
    throw new Error('stubCases must have at least one default and one error')
  }
  function setupUseQuery<
    Fn extends
      | Record<any, any>
      | any[]
      | Function.Function<
          [CTStubs],
          ReturnTypeSetupUseQuery<Fn>
        > = Function.Function<
      [CTStubs],
      ReturnTypeSetupUseQuery<Function.Function<[], CTStubs>>
    >,
  >(getStub?: Fn): ReturnTypeSetupUseQuery<Fn> {
    if (
      assertsFunctionSetupUseQuery<CTStubs, ReturnTypeSetupUseQuery<Fn>>(
        getStub,
      )
    ) {
      const safeGetStub =
        getStub ?? ((e) => e.default as ReturnTypeSetupUseQuery<Fn>)
      const stubCase = safeGetStub(stubCases)

      if (isSuccessStubCase(stubCase)) {
        axiosInstance[handler](urlRegex).reply(stubCase.status, stubCase.data)
        return safeGetStub(stubCases)
      }
      if (isErrorStubCase(stubCase)) {
        axiosInstance[handler](urlRegex).reply(stubCase.status, stubCase.error)
        return safeGetStub(stubCases)
      }
      throw new Error(`
      stubCase is not a valid stubCase
      stubCase should follow the pattern:
      - Success cases: { status: number, data: unknown }
      - Error cases: { status: number, error: unknown }
      `)
    }
    if (assertsObjectSetupUseQuery<ReturnTypeSetupUseQuery<Fn>>(getStub)) {
      // TODO: achar alguma forma de passar esse status depois
      axiosInstance[handler](urlRegex).reply(200, getStub)
      return getStub
    }
    throw new Error('get Stub invalid, it should be a function or a object')
  }

  return setupUseQuery
}

type StubCaseGenerator<TData, TError> = Record<
  string,
  { status: number; data: TData } | { status: number; error: TError }
>
export const stubCaseGenerator =
  <TData, TError = string>() =>
  <T extends StubCaseGenerator<TData, TError>>(data: T): T => {
    return data
  }
