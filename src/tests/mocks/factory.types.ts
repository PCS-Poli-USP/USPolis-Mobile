import MockAdapter from 'axios-mock-adapter'
import { P } from 'ts-pattern'
import { ValueOf } from 'ts-pattern/dist/types/helpers'

export const successCasePattern = {
  status: P.number,
  data: P._,
}
export const errorCasePattern = {
  status: P.number,
  error: P._,
}
export const stubCasePattern = {
  default: successCasePattern,
  error: errorCasePattern,
}
export type allMockAdapterHandlers = TypeUtilGetAllValuesThatStartsWithOn<MockAdapter>

export type fnIdentityPattern = (e: StubCasePattern) => ValueOf<StubCasePattern>
export type ReturnTypeSetupUseQuery<
  TGetStubCaseFn = unknown,
  CTStubs extends StubCasePattern = StubCasePattern
> = TGetStubCaseFn extends undefined
  ? CTStubs['default']
  : TGetStubCaseFn extends (...args: any) => infer R
  ? R
  : TGetStubCaseFn extends Record<any, any>
  ? TGetStubCaseFn
  : CTStubs['default']
export type StubCasePattern = P.infer<typeof stubCasePattern>

export type StubCasePatternGeneric<TData, TError> = P.infer<typeof stubCasePattern> &
  Record<string, { status: number; data: TData } | { status: number; error: TError }>

export type IErrorCasePattern = P.infer<typeof stubCasePattern['error']>
export type ISuccessStubCase = P.infer<typeof stubCasePattern['default']>

export type TypeUtilGetAllValuesThatStartsWithOn<T> = {
  [K in keyof T]: K extends `on${string}` ? K : never
}[keyof T]
