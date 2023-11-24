import { BsFillSendFill } from "react-icons/bs";
import { useState, useEffect } from 'react';
import { UserContextFunction } from "../Context/UserContext"
import { socket } from "../socket";
import "../App.css";
import TopBar from "./TopBar";

type InputterProps = {
	message: string;
	send: () => void;
	messageSetter: () => void;
}

type ChatboxProps = {
	usersList: string[];
}

const Inputter = ({ message, send, messageSetter }:InputterProps) => {
	return (
		<div className="inputter">
			<textarea id="my-text" type="text" placeholder="Type message here..." value={message} onChange={(e) => messageSetter(e)} />
			<div className="inputter-button" onClick={send}><BsFillSendFill /></div>
		</div>
	)
}

const Chatview = () => {
	return (
		<div className="chatview">
		</div>
	)
}


const Chatbox = ({ usersList }: ChatboxProps) => {

	const [ message, setMessage ] = useState<string>("");
	const [ newMessage, setNewMessage ] = useState<string>("");
	const UserInfo = JSON.parse(localStorage.getItem('Login'))

	function messageSender(e){
		if (e?.key === "Enter"){
			sendMessage()
		}
	}

	function messageHandler(e){
		setMessage(e.target.value)
	}

	
	function sendMessage(){
		if(message == "" || message == " ") return;
		const view = document.querySelector(".chatview");

		const newSpan = document.createElement("div");

		newSpan.innerText = message;

		newSpan.classList.add("my-message")

		socket.emit('send_message', { roomID: UserInfo.roomID, message: message, userName: UserInfo.userName })

		view.append(newSpan)
		setMessage("");
	}


	function joinedChat(e) {
		if (e.userName === UserInfo.userName) return;

		let addedUser = document.createElement('div');
		addedUser.classList.add('added-user')
		addedUser.textContent = `${e.userName} joined the room`
		document.querySelector('.chatview').append(addedUser)
	}

	function addChat(e) {
		const view = document.querySelector(".chatview");

		const newSpan = document.createElement("div");

		newSpan.textContent = e.message;

		const details = document.createElement('div');

		details.textContent = e.userName;

		details.classList.add('message-details')

		newSpan.append(details)

		view.append(newSpan)
	}

	function leftChat(e) {
		if ( e?.userName === null || e.userName === undefined ) return;
		
		let addedUser = document.createElement('div');
		addedUser.classList.add('added-user')
		addedUser.textContent = `${e.userName} left the room`
		document.querySelector('.chatview').append(addedUser)
	}


	useEffect(() => {
		socket.on('join-room', joinedChat)
		socket.on('send_message', addChat)
		socket.on('disconnect_user', leftChat)

		return () => {
			socket.off('join-room', joinedChat)
			socket.off('send_message', addChat)
			socket.off('disconnect_user', leftChat)
		}
	})

	useEffect(() => {
		const myText = document.querySelector("#my-text");
		const send = document.querySelector(".inputter-button")

		myText.addEventListener("input", () => {
			myText.style.height = "auto";
			myText.style.height = `${myText.scrollHeight}px`;
		})

		send.addEventListener('click', () => {
			myText.style.height = "auto";
		})
	}, [message])


	return (
		<div className="chatbox">
			<TopBar usersList={usersList} />
			<Chatview />
			<Inputter message={message} messageSetter={messageHandler} send={sendMessage} />
		</div>
	)
}

export default Chatbox;