import './App.css';
import { useEffect, useState } from "react";
import Sidebar from "./Components/Sidebar";
import Chatbox from "./Components/Chatbox";
import Signin from "./Components/Signin"
import { socket } from "./socket";
import { ProfileContextProvider, ProfileContextFunction } from "./Context/ProfileContext"
import { Routes, Route, Link } from "react-router-dom"

function AppView() {

  const [ UsernameAlreadySelected, setUsernameAlreadySelected ] = useState<bool>(false);
  
  const [ userList, setUserList ] = useState(); 
  
  const { username } = ProfileContextFunction();

  const userInfo = JSON.parse(localStorage.getItem('Login'))

  function updateUserList(e) {
  
    const roomInfo = e.ROOMSINFO.find(obj => (obj?.roomID === userInfo?.roomID))

    if (!roomInfo) return;

    setUserList(roomInfo.users)
  }

  function updateNewUserList(e) {
    console.log(e)
    const USERINFO = JSON.parse(localStorage.getItem('Login'))

    const roomInfo = e.ROOMSINFO.find(obj => (obj?.roomID === USERINFO?.roomID))

    if (!roomInfo) return;

    setUserList(roomInfo.users)
  }

  useEffect(() => {
    socket.on('join-room', updateUserList)

    return () => {
      socket.off('join-room', updateUserList)
    }
  })

  useEffect(() => {
    socket.on('disconnect_user', updateNewUserList)

    return () => {
      socket.off('disconnect_user', updateNewUserList)
    }
  })

  useEffect(() => {
    socket.on('another-room', updateNewUserList)

    return () => {
      socket.off('another-room', updateNewUserList)
    }
  })

  return (
    <div className="app">
      <Sidebar users={userList} />
      <Chatbox usersList={userList} />
    </div>
  )
}

const App = () => {

  type onUserSelectionProps = {
    username: string
  }

  return (
    <ProfileContextProvider>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/dashboard" element={<AppView />} />
        <Route path="*" element={<Signin />} />
      </Routes>
    </ProfileContextProvider>
  )
}

export default App
