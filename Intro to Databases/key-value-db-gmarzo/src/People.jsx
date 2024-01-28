/**
 * The People component is the top-level component for listing and showing event details.
 */
import './People.css'

import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom'

import { deletePerson, retrievePeople } from './api'

const People = props => {
  const { personId } = useParams()

  const [people, setPeople] = useState([])
  const [error, setError] = useState()

  const navigate = useNavigate()

  const handleDatabaseUpdate = async () => {
    try {
      setPeople(await retrievePeople())
      navigate('/people')
    } catch (error) {
      setError(error)
    }
  }

  const handleDelete = id => async event => {
    try {
      await deletePerson(id)
      await handleDatabaseUpdate()
    } catch (error) {
      setError(error)
    }
  }

  useEffect(() => {
    let active = true

    const initialize = async () => {
      try {
        const people = await retrievePeople()
        if (!active) {
          return
        }

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
  }, [])

  return (
    <main className="People-main people active">
      <section className="People-list">
        {error && <section className="People-error">{`Sorry, but ${error}`}</section>}

        {people.length > 0 ? (
          <table className="People-table">
            <thead>
              <tr>
                <th className="People-th">Name</th>
                <th className="People-th">Email</th>
                <th>{/* Placeholder for action items. */}</th>
              </tr>
            </thead>

            <tbody>
              {people.map(person => (
                <tr key={person.id}>
                  <td>{person.name}</td>
                  <td>{person.email}</td>
                  <td>
                    <NavLink className="People-edit" to={person.id}>
                      {personId === person.id ? '(editing)' : 'edit'}
                    </NavLink>
                    &nbsp;
                    <button onClick={handleDelete(person.id)}>delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <section className="People-empty">No peeps yet!</section>
        )}
      </section>

      <section className="People-detail">
        <Outlet context={handleDatabaseUpdate} />
      </section>
    </main>
  )
}

export default People
