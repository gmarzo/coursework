/**
 * The api module describes the back-end activities required by the bare-bones-events
 * web app. We define all functions as asynchronous because in general API calls are
 * like that, even if this particular implementation might not be.
 *
 * This API is very bare bones and only scratches the surface of what most API implementations
 * do. But because the focus here is the database, we will leave this be.
 *
 * Events look like this (bare bones remember):
 *
 * {
 *   id: string,
 *   name: string,
 *   date: string in ISO-8601 format,
 *   people: array of strings, where each string is a person id
 * }
 *
 * People look like this:
 *
 * {
 *   id: string,
 *   name: string,
 *   email: string
 * }
 *
 * The email string should be validated against the standard email format, but we will leave
 * that “as an exercise for the reader” (bare bones bare bones).
 */
import { v4 as uuid } from 'uuid'

import * as db from './db'

// Key-value stores just accept strings. It’s up to the application to determine what those
// strings look like.
const PATTERN_EVENT_KEY = /^event-/
const PATTERN_PERSON_KEY = /^person-/

const eventKey = id => `event-${id}`
const personKey = id => `person-${id}`

/**
 * Adds the given event to the database.
 *
 * @param {object} event the event to create, without an id
 * @returns the event that was created, with its assigned id
 */
const createEvent = async event => {
  const id = uuid()
  const newEvent = { ...event, id }
  return JSON.parse(await db.createEntry(eventKey(id), JSON.stringify(newEvent)))
}

/**
 * Returns the events in the database. A fuller implementation likely takes query parameters
 * and supports pagination.
 *
 * @returns the list of events; empty if there are none in the database
 */
const retrieveEvents = async () =>
  (await db.retrieveValuesByMatchingKey(PATTERN_EVENT_KEY)).map(eventString => JSON.parse(eventString))

/**
 * Returns a specific event in the database. Throws an error if it cannot be found.
 *
 * @param {string} id
 * @returns the event with that id
 */
const retrieveEvent = async id => JSON.parse(await db.retrieveValueByKey(eventKey(id)))

/**
 * Modifies the given event in the database. Throws an error if no such event exists.
 *
 * @param {object} event the event to modify
 * @returns the event after modification
 */
const updateEvent = async event => {
  const updatedEventValue = JSON.stringify(event)
  const updateResult = await db.updateEntry(eventKey(event.id), updatedEventValue)
  return JSON.parse(updateResult) // What happens if the result is undefined…?
}

/**
 * Deletes the event with the given id from the database. Throws an error if no such event exists.
 *
 * @param {string} id the id of the event to delete
 * @returns the event that was deleted (convenient if an undo-delete is desired)
 */
const deleteEvent = async id => {
  const deleteResult = await db.deleteEntry(eventKey(id))
  return JSON.parse(deleteResult)
}

/**
 * Adds the given person to the database.
 *
 * @param {object} person the person to create, without an id
 * @returns the person that was created, with their assigned id
 */
const createPerson = async person => {
  const id = uuid()
  const newPerson = { ...person, id }
  return JSON.parse(await db.createEntry(personKey(id), JSON.stringify(newPerson)))
}

/**
 * Returns the people in the database. A fuller implementation likely takes query parameters
 * and supports pagination.
 *
 * @returns the list of people; empty if there are none in the database
 */
const retrievePeople = async () =>
  (await db.retrieveValuesByMatchingKey(PATTERN_PERSON_KEY)).map(personString => JSON.parse(personString))

/**
 * Returns a specific person in the database. Throws an error if they cannot be found.
 *
 * @param {string} id
 * @returns the person with that id
 */
const retrievePerson = async id => JSON.parse(await db.retrieveValueByKey(personKey(id)))

/**
 * Returns people who “match” the given query string, in whatever way the API’s designers feel
 * constitutes a match. In this implementation, a match is a simple substring of either a person’s
 * name or email.
 *
 * Note that this function is “brute-forced” by the API because the underlying database does not
 * support this kind of capability. Real-world databases do.
 *
 * @param {string} q the query string (what we’re looking to match)
 * @returns the list of people that match the query string, in some way
 */
const queryPeople = async q => {
  const allPeople = await retrievePeople()
  return allPeople.filter(person => {
    const { name, email } = person

    const nameLower = (name ?? '').toLowerCase()
    const emailLower = (email ?? '').toLowerCase()
    const qLower = (q ?? '').toLowerCase()

    return nameLower.includes(qLower) || emailLower.includes(qLower)
  })
}

/**
 * Modifies the given person in the database. Throws an error if no such person exists.
 *
 * @param {object} person the person to modify
 * @returns the person after modification
 */
const updatePerson = async person => {
  const updatedPersonValue = JSON.stringify(person)
  const updateResult = await db.updateEntry(personKey(person.id), updatedPersonValue)
  return JSON.parse(updateResult) // What happens if the result is undefined…?
}

/**
 * Deletes the person with the given id from the database. Throws an error if no such person exists.
 *
 * @param {string} id the id of the person to delete
 * @returns the person that was deleted (convenient if an undo-delete is desired)
 */
const deletePerson = async id => {
  const deleteResult = await db.deleteEntry(personKey(id))
  return JSON.parse(deleteResult)
}

export {
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
}
