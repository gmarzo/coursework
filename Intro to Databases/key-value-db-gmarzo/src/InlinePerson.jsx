/**
 * The InlinePerson component displays information about a single person given their ID.
 * The component retrieves the “complete” person from the database then renders that
 * person in a format that is suitable for inline display, like a list.
 */
import './InlinePerson.css'

import { useEffect, useState } from 'react'

import PropTypes from 'prop-types'

import { retrievePerson } from './api'

const InlinePerson = props => {
  const { personId } = props

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState()

  useEffect(() => {
    if (personId) {
      let active = true

      const initialize = async () => {
        try {
          // In genuinely distributed systems, this may take a noticeable amount of time so ideally
          // the component would provide some progress feedback.
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
  }, [personId])

  return (
    <span className="InlinePerson-root">
      {error && (
        <section className="InlinePerson-error" title={`${error}`}>
          ⚠️
        </section>
      )}

      <a href={`mailto:${email}`}>{name}</a>
    </span>
  )
}

InlinePerson.propTypes = {
  personId: PropTypes.string // The ID of the person to load and display.
}

export default InlinePerson
