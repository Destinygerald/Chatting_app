import "../App.css";
import { UserContextFunction } from "../Context/UserContext"
import { useState, useEffect } from "react";
import { BsX, BsFillPersonFill } from "react-icons/bs"
import { socket } from "../socket"

const AllUsers = [
]


type UserProps = {
	name: string;
	id: string;
}

const User = ({name, id}: UserProps) => {

	const { currentId, changeChat } = UserContextFunction();



function changeUser(id: number){
	const Users = document.querySelectorAll(".user")
	Users?.forEach(user => {
	
		if (parseInt(user?.id) == id)
		{	
			changeChat(user.id)
			Users.forEach(user => {
				user.classList.remove('active')
			})

			user.classList.add('active')
		}
	})
}



	return (
		<div onClick={() => {changeUser(parseInt(id))}} className="user" id={id}>
			<span className="user-icon"><BsFillPersonFill /></span>
			<span>{name}</span>
			{/*<div className="online" />*/}
		</div>
	)
}

type userInfoProp = {
	userName: string,
	roomID: number
}

type SidebarProps = {
	users: userInfoProp[];
}

const Sidebar = ({users}: SidebarProps) => {
	const [ opened, setOpened ] = useState<boolean>(false);
	const [ tick, setTick ] = useState<boolean>(false);
	const [ name, setName ] = useState<string>('');
	const [ roomID, setRoomID ] = useState<string>('');
	const UserInfo = JSON.parse(localStorage.getItem('Login'))

	function fetchName() {
		const User = JSON.parse(localStorage.getItem('Login'))
		setName(User?.userName)
	}

	function changeHandler(e) {
		setRoomID(e.target.value)
	}

	function handleClick() { 

		if (roomID == '' || roomID == ' ') return;

		document.querySelector('.chatview').innerHTML = ""
		
    	
    	socket.emit('another-room', { previousID: UserInfo.roomID, roomID: roomID })

    	
    	setTimeout(() => {
    		localStorage.setItem('Login', JSON.stringify({ roomID: roomID, userName: UserInfo.userName }))
    		setOpened(false);
    	}, 1500)

	}

	useEffect(() => {
		fetchName()
	}, [])

	// function handleJoin(e) {
	// 	const newUserInfo = JSON.parse(localStorage.getItem('Login'))

	// 	const find_room = e.ROOMSINFO.find(obj => (obj.roomID === roomID))

	// 	if (!find_room) return;

	// 	users = find_room.users

	// 	setRoomID('')

	// 	setOpened(false)
	// }


	return (
		<div className="sidebar">
			<div className="add-chat">
				<button className="sidebar-button" onClick={() => {setOpened(!opened)}}>
					<span>+</span>
					<span>New Room</span>
				</button>

				<div className={opened ? "add-chat-options" : "add-chat-options-hidden"}>
					{/*<input placeholder="User Name" />*/}
					<input placeholder="Room Id" value={roomID} onChange={changeHandler} />
					<div className="add-chat-options-buttons">
						<button onClick={() => {setOpened(false)}}>Cancel</button>
						<button onClick={() => {handleClick()}}>Join</button>
					</div>
				</div>
			</div>

			<div className="sidebar-list">
				{
					users?.length > 0 
						?

					users?.map((user, idx) => {
					
						if (user?.userName !== name ) {
							return (
								<User name={user.userName} id={idx.toString()} key={idx} />
							)
						}
					})

					:

					''

				}
			</div>

			<div className="sidebar-bottom">
				<span>{name}</span>
			</div>
		</div>
	)
}

export default Sidebar;

