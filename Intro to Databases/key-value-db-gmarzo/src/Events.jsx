/**
 * The Events component is the top-level component for listing and showing event details.
 */
import './Events.css'

import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom'

import format from 'date-fns/format'
import isValid from 'date-fns/isValid'

import { deleteEvent, retrieveEvents } from './api'

import InlinePerson from './InlinePerson'

const Events = props => {
  const { eventId } = useParams()

  const [events, setEvents] = useState([])
  const [error, setError] = useState()

  const navigate = useNavigate()

  const handleDatabaseUpdate = async () => {
    try {
      setEvents(await retrieveEvents())
      navigate('/events')
    } catch (error) {
      setError(error)
    }
  }

  const handleDelete = id => async event => {
    try {
      await deleteEvent(id)
      await handleDatabaseUpdate()
    } catch (error) {
      setError(error)
    }
  }

  useEffect(() => {
    let active = true

    const initialize = async () => {
      try {
        const events = await retrieveEvents()
        if (!active) {
          return
        }

        setEvents(events)
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
  }, [])

  return (
    <main className="Events-main events active">
      <section className="Events-list">
        {error && <section className="Events-error">{`Sorry, but ${error}`}</section>}

        {events.length > 0 ? (
          <table className="Events-table">
            <thead>
              <tr>
                <th className="Events-th">Name</th>
                <th className="Events-th">Date/Time</th>
                <th className="Events-th">Who’s Going</th>
                <th>{/* Placeholder for action items. */}</th>
              </tr>
            </thead>

            <tbody>
              {events.map(event => {
                const { id, name, date, people } = event
                const dateValue = new Date(date)
                return (
                  <tr key={id}>
                    <td>{name}</td>

                    <td>{isValid(dateValue) ? format(dateValue, 'MMM d, yyyy   h:mm a') : '(bad date)'}</td>

                    <td>
                      {people?.length > 0 ? (
                        <ul className="Events-peopleList">
                          {people.map(personId => (
                            <li key={personId}>
                              <InlinePerson personId={personId} />
                            </li>
                          ))}
                        </ul>
                      ) : (
                        'No one’s going, bummer 😭'
                      )}
                    </td>

                    <td>
                      <NavLink className="Events-edit" to={id}>
                        {eventId === id ? '(editing)' : 'edit'}
                      </NavLink>
                      &nbsp;
                      <button onClick={handleDelete(id)}>delete</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <section className="Events-empty">No deets yet!</section>
        )}
      </section>

      <section className="Events-detail">
        <Outlet context={handleDatabaseUpdate} />
      </section>
    </main>
  )
}

export default Events
