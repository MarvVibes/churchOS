import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Layout
import Layout from './components/Layout'

// Screens
import Home from './screens/Home'
import Journey from './screens/Journey'
import Profile from './screens/Profile'
import StartSession from './screens/StartSession'
import SetIntention from './screens/SetIntention'
import ServiceMode from './screens/ServiceMode'
import EndService from './screens/EndService'
import AIProcessing from './screens/AIProcessing'
import StudySchedule from './screens/StudySchedule'

// Legacy Phase 7/8 screens (will be cleaned up later)
import SermonReport from './screens/SermonReport'
import RevelationMap from './screens/RevelationMap'
import PersonalConnection from './screens/PersonalConnection'
import ActionCommitment from './screens/ActionCommitment'
import FinalReport from './screens/FinalReport'
import SessionDetails from './screens/SessionDetails'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main tabs (with Bottom Nav) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="journey" element={<Journey />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Full screen routes with NO bottom nav */}
        <Route path="/journey/:id" element={
          <div className="app-shell"><main className="screen"><SessionDetails /></main></div>
        } />

        {/* Full screen flows (no Bottom Nav) */}
        <Route path="/start" element={
          <div className="app-shell"><main className="screen"><StartSession /></main></div>
        } />
        <Route path="/set-intention" element={
          <div className="app-shell"><main className="screen"><SetIntention /></main></div>
        } />
        <Route path="/service" element={
          <div className="app-shell"><main className="screen"><ServiceMode /></main></div>
        } />
        <Route path="/end" element={
          <div className="app-shell"><main className="screen"><EndService /></main></div>
        } />
        <Route path="/processing" element={
          <div className="app-shell"><main className="screen"><AIProcessing /></main></div>
        } />
        <Route path="/schedule" element={
          <div className="app-shell"><main className="screen"><StudySchedule /></main></div>
        } />
        <Route path="/reflection" element={
          <div className="app-shell"><main className="screen"><PersonalReflection /></main></div>
        } />
        <Route path="/report" element={
          <div className="app-shell"><main className="screen"><SermonReport /></main></div>
        } />
        <Route path="/map" element={
          <div className="app-shell"><main className="screen"><RevelationMap /></main></div>
        } />
        <Route path="/connection" element={
          <div className="app-shell"><main className="screen"><PersonalConnection /></main></div>
        } />
        <Route path="/action" element={
          <div className="app-shell"><main className="screen"><ActionCommitment /></main></div>
        } />
        <Route path="/final-report" element={
          <div className="app-shell"><main className="screen"><FinalReport /></main></div>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
