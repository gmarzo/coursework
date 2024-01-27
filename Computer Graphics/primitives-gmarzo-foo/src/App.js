/**
 * This React app serves as a very thin “wrapper” around what is otherwise pure canvas code.
 * Each top-level component is a standalone demo with no dependencies on each other.
 */
import { BrowserRouter as Router, NavLink, Route, Routes } from 'react-router-dom'

import './App.css'

import NanoshopDemo from './NanoshopDemo'
import NanoshopNeighborhoodDemo from './NanoshopNeighborhoodDemo'
import PrimitivesDemo from './PrimitivesDemo'

const classNamePicker = ({ isActive }) => (isActive ? 'current' : null)

const App = () => {
  return (
    <article className="App">
      <Router>
        <nav>
          <NavLink className={classNamePicker} to="/primitives">
            Primitives
          </NavLink>

          <NavLink className={classNamePicker} to="/nanoshop">
            Nanoshop
          </NavLink>

          <NavLink className={classNamePicker} to="/nanoshop-neighborhood">
            Nanoshop Neighborhood
          </NavLink>
        </nav>

        <main>
          <Routes>
            <Route path="/primitives" element={<PrimitivesDemo />} />
            <Route path="/nanoshop" element={<NanoshopDemo />} />
            <Route path="/nanoshop-neighborhood" element={<NanoshopNeighborhoodDemo />} />
          </Routes>
        </main>
      </Router>
    </article>
  )
}

export default App
