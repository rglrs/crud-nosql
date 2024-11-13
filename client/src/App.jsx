import { useState } from 'react'
import { DoctorList } from './pages/DoctorList'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <DoctorList />
    </>
  )
}

export default App
