import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

// Screens
import Home from './screens/Home';
import Journey from './screens/Journey';
import Profile from './screens/Profile';
import StartSession from './screens/StartSession';
import SetIntention from './screens/SetIntention';
import ServiceMode from './screens/ServiceMode';
import EndService from './screens/EndService';
import SermonInput from './screens/SermonInput';
import AIProcessing from './screens/AIProcessing';
import PersonalReflection from './screens/PersonalReflection';
import SermonReport from './screens/SermonReport';
import RevelationMap from './screens/RevelationMap';
import PersonalConnection from './screens/PersonalConnection';
import ActionCommitment from './screens/ActionCommitment';
import FinalReport from './screens/FinalReport';
import SessionDetails from './screens/SessionDetails';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Main Tabs */}
          <Route index element={<Home />} />
          <Route path="journey" element={<Journey />} />
          <Route path="profile" element={<Profile />} />

          {/* Pre-Service Flow */}
          <Route path="start-session" element={<StartSession />} />
          <Route path="set-intention" element={<SetIntention />} />

          {/* Active Service Flow */}
          <Route path="service" element={<ServiceMode />} />
          <Route path="end-service" element={<EndService />} />

          {/* Post-Service Flow */}
          <Route path="sermon-input" element={<SermonInput />} />
          <Route path="processing" element={<AIProcessing />} />
          <Route path="reflection" element={<PersonalReflection />} />
          <Route path="report" element={<SermonReport />} />
          <Route path="revelation-map" element={<RevelationMap />} />
          <Route path="connection" element={<PersonalConnection />} />
          <Route path="commitment" element={<ActionCommitment />} />
          <Route path="final-report" element={<FinalReport />} />
          
          {/* History */}
          <Route path="session/:id" element={<SessionDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
