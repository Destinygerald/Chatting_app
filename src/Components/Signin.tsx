import "../App.css";
import { Link } from "react-router-dom"
import { AiOutlineEye } from "react-icons/ai"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";
import { ProfileContextFunction } from "../Context/ProfileContext"

type SigninProps = {
  onInput: (username:string) => void;
}

type userInfoProp = {
	userName: string,
	roomID: number
}

const Signin = () => {
  const [ visible, setVisible ] = useState<boolean>(false);
  const [ userInfo, setUserInfo ] = useState<userInfoProp>({
    userName: '',
	//@ts-ignore
    roomID: ''
  });

  const navigate = useNavigate();
  const { handleUsername } = ProfileContextFunction()

  function handleIConVisiblity(){
    setVisible(true);

    return(
      setTimeout(() => {
        setVisible(false)
        }, 1000)
      )
  }

  function handleClear() {
    setUserInfo({
      userName: '',
//@ts-ignore
      roomID: ''
    });
  }

  function handleChange(e) {
    setUserInfo({...userInfo, [e.target.name] : e.target.value});
  }


  //@ts-ignore
  function submitHandler(e){
    e.preventDefault();
    //@ts-ignore
    if (!userInfo?.userName) {
      console.log("No username")
      return
    };

    //@ts-ignore
    let username = userInfo?.userName

    //@ts-igonre
    handleUsername(username);

    localStorage.setItem('Login', JSON.stringify(userInfo))

    socket.emit('join-room', userInfo)
    
    handleClear();
    
    navigate('/dashboard', {replace: false})
  }


  return (
    <div className="app logger">
      <form className="logger-container" onSubmit={submitHandler}>
        
        <span className="logger-header">Join Room</span>

        <div className="logger-input-container">
          <input type="text" placeholder="User Name" name="userName" className="logger-input" onChange={handleChange} value={userInfo?.userName} />
          <input type="text" placeholder="Room Id" className="logger-input" value={userInfo?.roomID} name="roomID" onChange={handleChange}/>
        </div>

        <div className="logger-button-container">
        <button className="logger-button" onClick={handleClear}>Clear</button>
        <button className="logger-button" type="submit">Join-Room</button>
        </div>

      </form>
    </div>
  )
}

export default Signin;
