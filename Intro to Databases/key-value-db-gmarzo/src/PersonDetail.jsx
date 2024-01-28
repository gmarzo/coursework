/**
 * The PersonDetail component displays information about a single person.
 */
import './PersonDetail.css'

import { useEffect, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'

import PropTypes from 'prop-types'

import { createPerson, retrievePerson, updatePerson } from './api'

const PersonDetail = props => {
  const { create } = props
  const { personId } = useParams()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState()

  const handleDatabaseUpdate = useOutletContext()

  const canSave = () => Boolean(name) && Boolean(email)
  const handleNameChange = event => setName(event.target.value)
  const handleEmailChange = event => setEmail(event.target.value)

  const handleSubmit = async event => {
    event.preventDefault()

    try {
      if (create) {
        await createPerson({ name, email })
      } else if (personId) {
        await updatePerson({ id: personId, name, email })
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
      setEmail('')
    } else if (personId) {
      let active = true

      const initialize = async () => {
        try {
          const existingPerson = await retrievePerson(personId)
          if (!active) {
            return
          }

          const { name, email } = existingPerson
          setName(name)
          setEmail(email)
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
  }, [create, personId])

  return (
    <form className="PersonDetail-form" onSubmit={handleSubmit}>
      {error && <section className="PersonDetail-error">{`Sorry, but ${error}`}</section>}

      <section className="PersonDetail-field">
        <label className="PersonDetail-label" htmlFor="person-name">
          Name:
        </label>

        <input className="PersonDetail-input" id="person-name" value={name} onChange={handleNameChange} required />
      </section>

      <section className="PersonDetail-field">
        <label className="PersonDetail-label" htmlFor="person-email">
          Email:
        </label>

        <input
          className="PersonDetail-input"
          id="person-email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          required
        />
      </section>

      <section className="PersonDetail-actions">
        <button type="submit" disabled={!canSave()}>
          Save
        </button>
      </section>
    </form>
  )
}

PersonDetail.propTypes = {
  create: PropTypes.bool // Whether the component should be set up for creation rather than editing.
}

export default PersonDetail
