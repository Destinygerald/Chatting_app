import "../App.css";
import { CgMenu } from "react-icons/cg";
import { BsX, BsFillPersonFill } from "react-icons/bs"
import { useState , useEffect, useRef } from "react"

type SliderProps = {
	modal: boolean;
	closeModal: () => void;
	users: string[];
}

const Slider = ({ modal, closeModal, users }) => {

	const sliderRef = useRef()

	useEffect(() => {

		const screen = document.querySelector('.chatbox')

		function handler(e) {

			if (sliderRef.current == null) return;

			if (!sliderRef.current?.contains(e.target)){
				closeModal()
			}
		}

		screen.addEventListener('pointerdown', handler)

		return (() => {
			screen.removeEventListener('pointerdown', handler)
		})

	})

	const name = JSON.parse(localStorage.getItem('Login'))

	return (
		<div className={ modal ? "slider slider-show" : "slider" } ref={sliderRef} >
			<div className="slider-exit" onClick={closeModal}>
				<BsX />
			</div>

			<div className='contact-list'>
				{
					users?.length > 0 
						?

					users?.map((user, idx) => {
						if (user !== name.userName ) {
							return (
								<div className="user" key={idx}>
									<span className="user-icon"><BsFillPersonFill /></span>
									<span>{user}</span>
								</div>
							)
						}
					})

					:

					''

				}
			</div>
		</div>
	)
}

type TopBarProps = {
	usersList: string[];
}

const TopBar = ({ usersList }: TopBarProps) => {
	
	const [ name, setName ] = useState<string>('')
	const [ modal, setModal ] = useState<boolean>(false)

	function fetchName():string {
		const User = JSON.parse(localStorage.getItem('Login'))
		setName(User.username)
	}

	function openModal() {
		setModal(true)
	}

	function closeModal() {
		setModal(false)
	}

	useEffect(() => {
		fetchName()
	}, [])

	return (
		<>
		<Slider modal={modal} closeModal={closeModal} users={usersList} />
		<div className="topbar">
			<CgMenu className="topbar-menu" onClick={openModal} />
			<div className="topbar-name">{name}</div>
			<div/>
		</div>
		</>
	)
}

export default TopBar;
