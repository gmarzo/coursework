/**
 * The EventDetail component displays information about a single event.
 */
import './EventDetail.css'

import { useEffect, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'

import PropTypes from 'prop-types'
import format from 'date-fns/format'
import isValid from 'date-fns/isValid'

import { createEvent, queryPeople, retrieveEvent, updateEvent } from './api'

import InlinePerson from './InlinePerson'

const EventDetail = props => {
  const { create } = props
  const { eventId } = useParams()

  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  const [people, setPeople] = useState([])
  const [peopleMatches, setPeopleMatches] = useState([])
  const [peopleQuery, setPeopleQuery] = useState('')

  const [error, setError] = useState()

  const handleDatabaseUpdate = useOutletContext()

  const dateValue = new Date(`${date} ${time}`)
  const canSave = () => Boolean(name) && Boolean(date) && Boolean(time) && isValid(dateValue)
  const handleNameChange = event => setName(event.target.value)
  const handleDateChange = event => setDate(event.target.value)
  const handleTimeChange = event => setTime(event.target.value)
  const handlePeopleQueryChange = event => setPeopleQuery(event.target.value)

  const handleAddPerson = id => event => {
    event.preventDefault()

    if (!people.includes(id)) {
      setPeople(people => [...people, id])
    }
  }

  const handleRemovePerson = id => event => {
    event.preventDefault()
    setPeople(people => people.filter(personId => personId !== id))
  }

  const handleSubmit = async event => {
    event.preventDefault()

    try {
      if (create) {
        await createEvent({ name, date: dateValue.toISOString(), people })
      } else if (eventId) {
        await updateEvent({ id: eventId, name, date: dateValue.toISOString(), people })
      }

      if (handleDatabaseUpdate) {
        handleDatabaseUpdate()
      }
    } catch (error) {
      setError(error)
    }
  }

  useEffect(() => {
    if (create) {
      setName('')
      setDate('')
      setTime('')
      setPeople([])
    } else if (eventId) {
      let active = true

      const initialize = async () => {
        try {
          const existingEvent = await retrieveEvent(eventId)
          if (!active) {
            return
          }

          const { name, date, people } = existingEvent
          const dateValue = new Date(date)
          const dateValueIsValid = isValid(dateValue)

          setName(name)
          setDate(dateValueIsValid ? format(dateValue, 'yyyy-MM-dd') : '')
          setTime(dateValueIsValid ? format(dateValue, 'HH:mm') : '')
          setPeople(people)
        } catch (error) {
          if (!active) {
            return
          }

          setError(error)
        }
      }

      initialize()
      return () => {
        active = false
      }
    }
  }, [create, eventId])

  useEffect(() => {
    if (!peopleQuery) {
      return
    }

    let active = true

    // Note: Because this may happen very frequently, debouncing is recommended,
    //       but that is beyond bare-bones…
    const loadMatches = async () => {
      try {
        const matchingPeople = await queryPeople(peopleQuery)
        if (!active) {
          return
        }

        setPeopleMatches(matchingPeople)
      } catch (error) {
        setError(error)
      }
    }

    loadMatches()
    return () => {
      active = false
    }
  }, [peopleQuery])

  return (
    <form className="EventDetail-form" onSubmit={handleSubmit}>
      {error && <section className="EventDetail-error">{`Sorry, but ${error}`}</section>}

      <section className="EventDetail-field">
        <label className="EventDetail-label" htmlFor="event-name">
          Name:
        </label>

        <input className="EventDetail-input" id="event-name" value={name} onChange={handleNameChange} required />
      </section>

      <section className="EventDetail-field">
        <label className="EventDetail-label" htmlFor="event-date">
          Date:
        </label>

        <input
          className="EventDetail-input"
          id="event-date"
          type="date"
          value={date}
          onChange={handleDateChange}
          required
        />
      </section>

      <section className="EventDetail-field">
        <label className="EventDetail-label" htmlFor="event-time">
          Time:
        </label>

        <input
          className="EventDetail-input"
          id="event-time"
          type="time"
          value={time}
          onChange={handleTimeChange}
          required
        />
      </section>

      <section className="EventDetail-field">
        <label className="EventDetail-label">People:</label>

        {people.length > 0 ? (
          <ul className="EventDetail-peopleList">
            {people.map(personId => {
              return (
                <li key={personId}>
                  <InlinePerson personId={personId} /> <button onClick={handleRemovePerson(personId)}>&times;</button>
                </li>
              )
            })}
          </ul>
        ) : (
          <section className="EventDetail-peopleEmpty">(no one yet)</section>
        )}

        <section className="EventDetail-peopleSearch">
          <input
            className="EventDetail-input"
            id="people-search"
            placeholder="Search to add"
            value={peopleQuery}
            onChange={handlePeopleQueryChange}
          />
        </section>

        {peopleQuery &&
          (peopleMatches.length > 0 ? (
            <ul className="EventDetail-peopleList">
              {peopleMatches.map(person => (
                <li key={person.id}>
                  {person.name}
                  <small>({person.email})</small> <button onClick={handleAddPerson(person.id)}>add</button>
                </li>
              ))}
            </ul>
          ) : (
            <section className="EventDetail-peopleEmpty">(no matches, sorry)</section>
          ))}
      </section>

      <section className="EventDetail-actions">
        <button type="submit" disabled={!canSave()}>
          Save
        </button>
      </section>
    </form>
  )
}

EventDetail.propTypes = {
  create: PropTypes.bool // Whether the component should be set up for creation rather than editing.
}

export default EventDetail
