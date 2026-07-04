import { Routes, Route } from 'react-router-dom'
import SmoothScroll from './components/SmoothScroll'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import QrGenerator from './pages/tools/QrGenerator'
import PasswordVault from './pages/tools/PasswordVault'
import UnitConverter from './pages/tools/UnitConverter'
import JsonToolkit from './pages/tools/JsonToolkit'
import HashGenerator from './pages/tools/HashGenerator'
import CvMaker from './pages/tools/CvMaker'

function App() {
  return (
    <SmoothScroll>
      <Cursor />
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tools/qr-generator" element={<QrGenerator />} />
          <Route path="/tools/password-vault" element={<PasswordVault />} />
          <Route path="/tools/unit-converter" element={<UnitConverter />} />
          <Route path="/tools/json-toolkit" element={<JsonToolkit />} />
          <Route path="/tools/hash-generator" element={<HashGenerator />} />
          <Route path="/tools/cv-maker" element={<CvMaker />} />
        </Routes>
      </main>
      <Footer />
    </SmoothScroll>
  )
}

export default App
