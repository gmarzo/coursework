/**
 * This React app serves as a very thin “wrapper” around what is otherwise pure WebGL code.
 * With the exception of a couple of reusable modules, the BareBonesWebGL and LessBareBonesWebGL
 * components are devoid of design---they are meant to introduce you to WebGL but are not meant
 * to be models to emulate. In other words, focus on the functionality and not the form. Once you
 * feel you’ve gotten into a groove with WebGL yourself, feel free to delete these components and
 * underlying modules so you can go with your own approach for a high-level 3D graphics library.
 */
import { NavLink, Route, Routes } from 'react-router-dom'

import './App.css'

import BareBonesWebGL from './BareBonesWebGL'
import LessBareBonesWebGL from './LessBareBonesWebGL'

const classNamePicker = ({ isActive }) => (isActive ? 'current' : null)

const Greeting = () => (
  <article>
    <h1>This is starter code only!</h1>
    <p>
      Make sure to take this apart and put it back with a better design once you’ve gotten the hang of WebGL and GLSL.
    </p>
  </article>
)

const App = () => {
  return (
    <article className="App">
      <nav>
        <NavLink className={classNamePicker} to="/bare-bones-webgl">
          Bare Bones WebGL
        </NavLink>

        <NavLink className={classNamePicker} to="/less-bare-bones-webgl">
          Less Bare Bones WebGL
        </NavLink>
      </nav>

      <main>
        <Routes>
          <Route path="" element={<Greeting />} />
          <Route path="bare-bones-webgl" element={<BareBonesWebGL />} />
          <Route path="less-bare-bones-webgl" element={<LessBareBonesWebGL />} />
        </Routes>
      </main>
    </article>
  )
}

export default App
