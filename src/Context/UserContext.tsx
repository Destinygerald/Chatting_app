import { useContext, createContext, useState } from "react";

type UserContextProps = {
	changeChat : (id: string) => string;
	currentId: string;
}

const UserContext = createContext({} as UserContextProps)

export function UserContextFunction(){
	return (
		useContext(UserContext)
	)

}

export function UserContextProvider({children}: ReactNode){
	const [ userId, setUserId ] = useState<string>("0");

	function changeChat(id: string){
		setUserId(id);

		return (id)
	}

	const currentId = userId;

	return (
		<UserContext.Provider value={{currentId, changeChat}}>
			{children}
		</UserContext.Provider>
	)
}