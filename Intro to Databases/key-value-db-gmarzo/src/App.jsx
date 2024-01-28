import './App.css'

import { Navigate, Route, Routes } from 'react-router-dom'

import EventDetail from './EventDetail'
import Events from './Events'
import Layout from './Layout'
import People from './People'
import PersonDetail from './PersonDetail'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="events" />} />

        <Route path="events" element={<Events />}>
          <Route index element={<Navigate to="new" />} />
          <Route path="new" element={<EventDetail create />} />
          <Route path=":eventId" element={<EventDetail />} />
        </Route>

        <Route path="people" element={<People />}>
          <Route index element={<Navigate to="new" />} />
          <Route path="new" element={<PersonDetail create />} />
          <Route path=":personId" element={<PersonDetail />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
