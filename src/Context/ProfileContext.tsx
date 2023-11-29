import { useContext, createContext, useState } from "react";

type ProfileContextProps = {
	username: string;
	handleUsername: (name: string) => void;
}

const ProfileContext = createContext({} as ProfileContextProps)

export function ProfileContextFunction() {
	return (
		useContext(ProfileContext)
	)	
}

export function ProfileContextProvider({children}: ReactNode) {
	
	const [ username, setUsername ] = useState<string>('');

	function handleUsername(name: string) {
		setUsername(name)
	}

	return(
		<ProfileContext.Provider value={{username, handleUsername}}>
			{children}
		</ProfileContext.Provider>
	)
}
