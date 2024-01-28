/**
 * This module is a test suite for our simple events API implementation.
 */
import {
  createEvent,
  retrieveEvents,
  retrieveEvent,
  updateEvent,
  deleteEvent,
  createPerson,
  retrievePeople,
  retrievePerson,
  queryPeople,
  updatePerson,
  deletePerson
} from './api'

import { initialize } from './db'

/**
 * Make sure each test starts with a fresh database.
 */
beforeEach(async () => {
  await initialize()
})

describe('createEvent function', () => {
  it('works as expected when used correctly', async () => {
    const name = 'Testy McTestFace'
    const date = '3520-04-05T08:09:54+00:00'
    const people = ['bill', 'ted']
    // 👆🏽 Note we don’t enforce that there _are_ people with these IDs.
    // If the API were less bare-bones, we can potentially enforce this.

    const createdEvent = await createEvent({ name, date, people })
    expect(createdEvent.id).toBeTruthy()

    const createdEventFromApi = await retrieveEvent(createdEvent.id)
    expect(createdEventFromApi.name).toEqual(name)
    expect(createdEventFromApi.date).toEqual(date)
    expect(createdEventFromApi.people).toEqual(people)
  })
})

describe('retrieveEvent function', () => {
  it('works as expected when used correctly', async () => {
    const name = 'Testy McTestFace'
    const date = '3520-04-05T08:09:54+00:00'
    const people = ['bill', 'ted']

    const createdEvent = await createEvent({ name, date, people })
    expect(await retrieveEvent(createdEvent.id)).toEqual(createdEvent)
  })

  // Thank you: https://stackoverflow.com/questions/47144187/can-you-write-async-tests-that-expect-tothrow
  it('throws an error when given a non-existent event ID', async () => {
    await expect(() => retrieveEvent('not there for sure')).rejects.toThrowError()
  })
})

describe('retrieveEvents function', () => {
  it('works as expected when used correctly', async () => {
    const name = 'Testy McTestFace'
    const date = '3520-04-05T08:09:54+00:00'
    const people = ['bill', 'ted']

    const anotherName = 'Eventy McEventFace'
    const anotherDate = '486-01-02T10:11:12+00:00'
    const anotherPeople = ['thelma', 'louise']

    const createdEvents = await Promise.all([
      createEvent({ name, date, people }),
      createEvent({ name: anotherName, date: anotherDate, people: anotherPeople })
    ])

    // To make sure that only events are returned, we create a person too.
    await createPerson({ name: 'McGuffiny McGuffinFace', email: 'mc@guffin.com' })

    const retrievedEvents = await retrieveEvents()
    expect(retrievedEvents.length).toEqual(2)

    expect(
      retrievedEvents.find(
        event =>
          event.id === createdEvents[0].id &&
          event.name === createdEvents[0].name &&
          event.date === createdEvents[0].date &&
          event.people.length === 2 &&
          event.people.includes('bill') &&
          event.people.includes('ted')
      )
    ).toBeTruthy()

    expect(
      retrievedEvents.find(
        event =>
          event.id === createdEvents[1].id &&
          event.name === createdEvents[1].name &&
          event.date === createdEvents[1].date &&
          event.people.length === 2 &&
          event.people.includes('thelma') &&
          event.people.includes('louise')
      )
    ).toBeTruthy()
  })

  it('returns an empty array when there are no events in the database', async () => {
    expect(await retrieveEvents()).toEqual([])
  })
})

describe('updateEvent function', () => {
  it('works as expected when used correctly', async () => {
    const name = 'Testy McTestFace'
    const date = '3520-04-05T08:09:54+00:00'
    const people = ['bill', 'ted']

    const anotherName = 'Eventy McEventFace'
    const anotherDate = '486-01-02T10:11:12+00:00'
    const anotherPeople = ['thelma', 'louise']

    const originalEvent = await createEvent({ name, date, people })

    const updatedEvent = await updateEvent({
      id: originalEvent.id,
      name: anotherName,
      date: anotherDate,
      people: anotherPeople
    })

    expect(updatedEvent.id).toEqual(originalEvent.id)
    expect(updatedEvent.name).toEqual(anotherName)
    expect(updatedEvent.date).toEqual(anotherDate)
    expect(updatedEvent.people).toEqual(anotherPeople)

    const updatedEventFromApi = await retrieveEvent(originalEvent.id)
    expect(updatedEventFromApi.id).toEqual(originalEvent.id)
    expect(updatedEventFromApi.name).toEqual(anotherName)
    expect(updatedEventFromApi.date).toEqual(anotherDate)
    expect(updatedEventFromApi.people).toEqual(anotherPeople)
  })

  it('throws an error when updating a non-existent event', async () => {
    const name = 'Testy McTestFace'
    const date = '3520-04-05T08:09:54+00:00'
    const people = ['bill', 'ted']

    await expect(() => updateEvent({ id: 'nope not here', name, date, people })).rejects.toThrowError()
  })
})

describe('deleteEvent function', () => {
  it('works as expected when used correctly', async () => {
    const name = 'Testy McTestFace'
    const date = '3520-04-05T08:09:54+00:00'
    const people = ['bill', 'ted']

    const originalEvent = await createEvent({ name, date, people })
    const retrievedEvent = await retrieveEvent(originalEvent.id)
    expect(originalEvent).toEqual(retrievedEvent)

    const deletedEvent = await deleteEvent(originalEvent.id)
    expect(originalEvent).toEqual(deletedEvent)

    await expect(() => retrieveEvent(originalEvent.id)).rejects.toThrowError()
  })

  it('throws an error when deleting a non-existent event', async () => {
    await expect(() => deleteEvent('what are you thinking')).rejects.toThrowError()
  })
})

describe('createPerson function', () => {
  it('works as expected when used correctly', async () => {
    const name = 'Testy McTestFace'
    const email = 'testy@mctestf.ace'

    const createdPerson = await createPerson({ name, email })
    expect(createdPerson.id).toBeTruthy()

    const createdPersonFromApi = await retrievePerson(createdPerson.id)
    expect(createdPersonFromApi.name).toEqual(name)
    expect(createdPersonFromApi.email).toEqual(email)
  })
})

describe('retrievePerson function', () => {
  it('works as expected when used correctly', async () => {
    const name = 'Testy McTestFace'
    const email = 'testy@mctestf.ace'

    const createdPerson = await createPerson({ name, email })
    expect(await retrievePerson(createdPerson.id)).toEqual(createdPerson)
  })

  it('throws an error when given a non-existent person ID', async () => {
    await expect(() => retrievePerson('not there for sure')).rejects.toThrowError()
  })
})

describe('retrievePeople function', () => {
  it('works as expected when used correctly', async () => {
    const name = 'Testy McTestFace'
    const email = 'testy@mctestf.ace'

    const anotherName = 'Peoply McPeopleFace'
    const anotherEmail = 'peoply@mcpeoplef.ace'

    const createdPeople = await Promise.all([
      createPerson({ name, email }),
      createPerson({ name: anotherName, email: anotherEmail })
    ])

    // To make sure that only people are returned, we create an event too.
    await createEvent({
      name: 'McGuffiny McGuffinFace',
      date: '3520-04-05T08:09:54+00:00',
      people: [createdPeople[0].id, createdPeople[1].id]
    })

    const retrievedPeople = await retrievePeople()
    expect(retrievedPeople.length).toEqual(2)

    expect(
      retrievedPeople.find(
        person =>
          person.id === createdPeople[0].id &&
          person.name === createdPeople[0].name &&
          person.email === createdPeople[0].email
      )
    ).toBeTruthy()

    expect(
      retrievedPeople.find(
        person =>
          person.id === createdPeople[1].id &&
          person.name === createdPeople[1].name &&
          person.email === createdPeople[1].email
      )
    ).toBeTruthy()
  })

  it('returns an empty array when there are no people in the database', async () => {
    expect(await retrievePeople()).toEqual([])
  })
})

describe('queryPeople function', () => {
  it('returns an empty array when there are no people in the database', async () => {
    expect(await queryPeople('')).toEqual([])
    expect(await queryPeople('resistance')).toEqual([])
    expect(await queryPeople('is')).toEqual([])
    expect(await queryPeople('futile')).toEqual([])
  })

  it('returns an empty array when the query does not match', async () => {
    const name = 'Testy McTestFace'
    const email = 'testy@mctestf.ace'

    const anotherName = 'Peoply McPeopleFace'
    const anotherEmail = 'peoply@mcpeoplef.ace'

    await Promise.all([createPerson({ name, email }), createPerson({ name: anotherName, email: anotherEmail })])

    expect(await queryPeople('rando query')).toEqual([])
    expect(await queryPeople('resistance')).toEqual([])
    expect(await queryPeople('is')).toEqual([])
    expect(await queryPeople('futile')).toEqual([])
  })

  it('works as expected when used correctly', async () => {
    const name = 'Testy McTestFace'
    const email = 'testy@mctestf.ace'

    const anotherName = 'Peoply McPeopleFace'
    const anotherEmail = 'peoply@mcpeoplef.ace'

    const createdPerson = await createPerson({ name, email })
    const anotherPerson = await createPerson({ name: anotherName, email: anotherEmail })

    expect(await queryPeople('test')).toEqual([createdPerson])
    expect(await queryPeople('peop')).toEqual([anotherPerson])
    expect(await queryPeople('nobody')).toEqual([])

    const retrievedPeople = await queryPeople('face')
    expect(retrievedPeople.length).toEqual(2)

    expect(
      retrievedPeople.find(
        person =>
          person.id === createdPerson.id && person.name === createdPerson.name && person.email === createdPerson.email
      )
    ).toBeTruthy()

    expect(
      retrievedPeople.find(
        person =>
          person.id === anotherPerson.id && person.name === anotherPerson.name && person.email === anotherPerson.email
      )
    ).toBeTruthy()
  })

  it('works as expected for people with no name', async () => {
    const name = 'Testy McTestFace'
    const email = 'testy@mctestf.ace'

    const anotherEmail = 'peoply@mcpeoplef.ace'

    const createdPerson = await createPerson({ name, email })
    const anotherPerson = await createPerson({ email: anotherEmail })

    expect(await queryPeople('test')).toEqual([createdPerson])
    expect(await queryPeople('ply@m')).toEqual([anotherPerson])
    expect(await queryPeople('nobody')).toEqual([])
  })

  it('works as expected for people with no email', async () => {
    const name = 'Testy McTestFace'
    const email = 'testy@mctestf.ace'

    const anotherName = 'Peoply McPeopleFace'

    const createdPerson = await createPerson({ name, email })
    const anotherPerson = await createPerson({ name: anotherName })

    expect(await queryPeople('test')).toEqual([createdPerson])
    expect(await queryPeople('ly McP')).toEqual([anotherPerson])
    expect(await queryPeople('nobody')).toEqual([])
  })

  it('works as expected for…no query!', async () => {
    const name = 'Testy McTestFace'
    const email = 'testy@mctestf.ace'

    const anotherName = 'Peoply McPeopleFace'
    const anotherEmail = 'peoply@mcpeoplef.ace'

    const createdPerson = await createPerson({ name, email })
    const anotherPerson = await createPerson({ name: anotherName, email: anotherEmail })

    const retrievedPeople = await queryPeople()
    expect(retrievedPeople.length).toEqual(2)

    expect(
      retrievedPeople.find(
        person =>
          person.id === createdPerson.id && person.name === createdPerson.name && person.email === createdPerson.email
      )
    ).toBeTruthy()

    expect(
      retrievedPeople.find(
        person =>
          person.id === anotherPerson.id && person.name === anotherPerson.name && person.email === anotherPerson.email
      )
    ).toBeTruthy()
  })
})

describe('updatePerson function', () => {
  it('works as expected when used correctly', async () => {
    const name = 'Testy McTestFace'
    const email = 'testy@mctestf.ace'

    const anotherName = 'Peoply McPeopleFace'
    const anotherEmail = 'peoply@mcpeoplef.ace'

    const originalPerson = await createPerson({ name, email })

    const updatedPerson = await updatePerson({
      id: originalPerson.id,
      name: anotherName,
      email: anotherEmail
    })

    expect(updatedPerson.id).toEqual(originalPerson.id)
    expect(updatedPerson.name).toEqual(anotherName)
    expect(updatedPerson.email).toEqual(anotherEmail)

    const updatedPersonFromApi = await retrievePerson(originalPerson.id)
    expect(updatedPersonFromApi.id).toEqual(originalPerson.id)
    expect(updatedPersonFromApi.name).toEqual(anotherName)
    expect(updatedPersonFromApi.email).toEqual(anotherEmail)
  })

  it('throws an error when updating a non-existent person', async () => {
    const name = 'Testy McTestFace'
    const email = 'testy@mctestf.ace'

    await expect(() => updatePerson({ id: 'nope not here', name, email })).rejects.toThrowError()
  })
})

describe('deletePerson function', () => {
  it('works as expected when used correctly', async () => {
    const name = 'Testy McTestFace'
    const email = 'testy@mctestf.ace'

    const originalPerson = await createPerson({ name, email })
    const retrievedPerson = await retrievePerson(originalPerson.id)
    expect(originalPerson).toEqual(retrievedPerson)

    const deletedPerson = await deletePerson(originalPerson.id)
    expect(originalPerson).toEqual(deletedPerson)

    await expect(() => retrievePerson(originalPerson.id)).rejects.toThrowError()
  })

  it('throws an error when deleting a non-existent person', async () => {
    await expect(() => deletePerson('what are you thinking')).rejects.toThrowError()
  })
})
