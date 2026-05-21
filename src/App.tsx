import { HashRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/layouts/AppLayout'
import { Landing } from '@/pages/Landing'
import { Dashboard } from '@/pages/Dashboard'
import { ConflictMap } from '@/pages/ConflictMap'
import { ConflictDetail } from '@/pages/ConflictDetail'
import { Countries } from '@/pages/Countries'
import { CountryDetail } from '@/pages/CountryDetail'
import { ArmsFlow } from '@/pages/ArmsFlow'
import { AIConsole } from '@/pages/AIConsole'
import { Simulator } from '@/pages/Simulator'
import { Nuclear } from '@/pages/Nuclear'
import { Alliances } from '@/pages/Alliances'
import { OSINT } from '@/pages/OSINT'
import { Alerts } from '@/pages/Alerts'
import { ArmsRace } from '@/pages/ArmsRace'
import { SearchPage } from '@/pages/SearchPage'
import { KnowledgeGraph } from '@/pages/KnowledgeGraph'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/conflicts" element={<ConflictMap />} />
          <Route path="/conflicts/:conflictId" element={<ConflictDetail />} />
          <Route path="/countries" element={<Countries />} />
          <Route path="/countries/:countryCode" element={<CountryDetail />} />
          <Route path="/arms-flow" element={<ArmsFlow />} />
          <Route path="/ai" element={<AIConsole />} />
          <Route path="/ai/chat" element={<AIConsole />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/nuclear" element={<Nuclear />} />
          <Route path="/alliances" element={<Alliances />} />
          <Route path="/osint" element={<OSINT />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/arms-race" element={<ArmsRace />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/graph" element={<KnowledgeGraph />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
