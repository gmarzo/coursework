/**
 * Layout represents the top-level universal aspects of the app’s user interface.
 */
import './Layout.css'

import { NavLink, Outlet } from 'react-router-dom'

const Layout = props => {
  return (
    <article className="Layout">
      <nav className="Layout-nav">
        <h2 className="Layout-title">Bare Bones Events! 🦴</h2>

        <NavLink className="Layout-link events" to="events">
          Deets
        </NavLink>

        <NavLink className="Layout-link people" to="people">
          Peeps
        </NavLink>
      </nav>

      <main className="Layout-main">
        <Outlet />
      </main>
    </article>
  )
}

export default Layout
