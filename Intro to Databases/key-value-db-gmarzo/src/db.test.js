/**
 * This module is a test suite for our simple key-value database implementation.
 */
import {
  createEntry,
  retrieveValueByKey,
  retrieveValuesByMatchingKey,
  updateEntry,
  deleteEntry,
  ERROR_STRINGS_ONLY,
  ERROR_ENTRY_ALREADY_EXISTS,
  initialize
} from './db'

/**
 * Make sure each test starts with a fresh database.
 */
beforeEach(async () => {
  await initialize() // We’re depending on this in our test code, but we’re also testing it.
})

describe('initialize function', () => {
  it('empties all added keys', async () => {
    await createEntry('hello', 'world')
    await createEntry('java', 'script')
    await createEntry('py', 'thon')
    await initialize()

    expect(await retrieveValueByKey('hello')).toBeUndefined()
    expect(await retrieveValueByKey('java')).toBeUndefined()
    expect(await retrieveValueByKey('py')).toBeUndefined()
  })
})

describe('createEntry function', () => {
  it('works when used correctly', async () => {
    await createEntry('hello', 'world')
    expect(await retrieveValueByKey('hello')).toEqual('world')
  })

  // Thank you: https://stackoverflow.com/questions/47144187/can-you-write-async-tests-that-expect-tothrow
  it('throws an error when given a number', async () => {
    await expect(() => createEntry('hello', 1)).rejects.toThrow(ERROR_STRINGS_ONLY)
  })

  it('throws an error when given an object', async () => {
    await expect(() => createEntry('hello', {})).rejects.toThrow(ERROR_STRINGS_ONLY)
  })

  it('throws an error when given an array', async () => {
    await expect(() => createEntry('hello', [])).rejects.toThrow(ERROR_STRINGS_ONLY)
  })

  it('throws an error when given a boolean', async () => {
    await expect(() => createEntry('hello', false)).rejects.toThrow(ERROR_STRINGS_ONLY)
  })

  it('throws an error when given null', async () => {
    await expect(() => createEntry('hello', null)).rejects.toThrow(ERROR_STRINGS_ONLY)
  })

  it('throws an error when given undefined', async () => {
    await expect(() => createEntry('hello', undefined)).rejects.toThrow(ERROR_STRINGS_ONLY)
  })

  it('throws an error when the key is already present', async () => {
    await createEntry('hello', 'world')
    await expect(() => createEntry('hello', 'goodbye')).rejects.toThrow(ERROR_ENTRY_ALREADY_EXISTS)
  })
})

describe('retrieveValueByKey function', () => {
  it('returns undefined when the key isn’t in the database', async () => {
    expect(await retrieveValueByKey('not there')).toBeUndefined()
  })

  it('returns the correct value', async () => {
    await createEntry('this', 'is')
    await createEntry('that', 'are')
    expect(await retrieveValueByKey('this')).toEqual('is')
    expect(await retrieveValueByKey('that')).toEqual('are')
  })
})

describe('retrieveValuesByMatchingKey function', () => {
  it('returns an empty list when the database is empty', async () => {
    // Fresh database, so no keys will match for sure!
    expect(await retrieveValuesByMatchingKey(/.*/)).toEqual([])
  })

  it('returns an empty list when no keys match', async () => {
    await createEntry('this', 'is')
    await createEntry('that', 'are')

    expect(await retrieveValuesByMatchingKey(/^wh/)).toEqual([])
    expect(await retrieveValuesByMatchingKey(/huh/)).toEqual([])
  })

  it('returns the correct list when keys match', async () => {
    await createEntry('this', 'is')
    await createEntry('that', 'are')

    // We use a set so that we are independent of return order.
    expect(new Set(await retrieveValuesByMatchingKey(/^th/))).toEqual(new Set(['is', 'are']))
    expect(new Set(await retrieveValuesByMatchingKey(/th/))).toEqual(new Set(['is', 'are']))
    expect(new Set(await retrieveValuesByMatchingKey(/.*/))).toEqual(new Set(['is', 'are']))
    expect(await retrieveValuesByMatchingKey(/is/)).toEqual(['is'])
    expect(await retrieveValuesByMatchingKey(/at$/)).toEqual(['are'])
  })
})

describe('updateEntry function', () => {
  it('returns undefined when the key is not already present', async () => {
    expect(await updateEntry('hello', 'goodbye')).toBeUndefined()
  })

  it('works when used correctly', async () => {
    await createEntry('hello', 'there')
    expect(await retrieveValueByKey('hello')).toEqual('there')

    const updatedResult = await updateEntry('hello', 'world')
    expect(updatedResult).toEqual('world')
    expect(await retrieveValueByKey('hello')).toEqual('world')
  })

  it('throws an error when given a number', async () => {
    await createEntry('hello', 'there')
    await expect(() => updateEntry('hello', 1)).rejects.toThrow(ERROR_STRINGS_ONLY)
  })

  it('throws an error when given an object', async () => {
    await createEntry('hello', 'there')
    await expect(() => updateEntry('hello', {})).rejects.toThrow(ERROR_STRINGS_ONLY)
  })

  it('throws an error when given an array', async () => {
    await createEntry('hello', 'there')
    await expect(() => updateEntry('hello', [])).rejects.toThrow(ERROR_STRINGS_ONLY)
  })

  it('throws an error when given a boolean', async () => {
    await createEntry('hello', 'there')
    await expect(() => updateEntry('hello', false)).rejects.toThrow(ERROR_STRINGS_ONLY)
  })

  it('throws an error when given null', async () => {
    await createEntry('hello', 'there')
    await expect(() => updateEntry('hello', null)).rejects.toThrow(ERROR_STRINGS_ONLY)
  })

  it('throws an error when given undefined', async () => {
    await createEntry('hello', 'there')
    await expect(() => updateEntry('hello', undefined)).rejects.toThrow(ERROR_STRINGS_ONLY)
  })
})

describe('deleteEntry function', () => {
  it('returns undefined when the key is not already present', async () => {
    expect(await deleteEntry('hello', 'goodbye')).toBeUndefined()
  })

  it('works when used correctly', async () => {
    await createEntry('hello', 'there')
    expect(await retrieveValueByKey('hello')).toEqual('there')

    expect(await deleteEntry('hello')).toEqual('there')
    expect(await retrieveValueByKey('hello')).toBeUndefined()
  })
})
