
import { Route, Routes } from "react-router-dom"
import ViewTaskList from "./pages/ViewTaskList"
import AddTask from "./pages/AddTask"
import ViewTask from "./pages/ViewTask"

function App() {

  return (
      <Routes>
        <Route path='/' index element={<ViewTaskList/>} />
        <Route path='add' element={<AddTask />} />
        <Route path='view/:id' element={<ViewTask/>} />
    </Routes>
  )
}

export default App