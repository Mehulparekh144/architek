"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type UserSelection = {
	content: string;
	needsAI: boolean;
};

interface UserChangesContext {
	userSelection: UserSelection;
	setUserSelection: (userSelection: UserSelection) => void;
}

const ChangesContext = createContext<UserChangesContext | undefined>(undefined);

export function ChangesProvider({ children }: { children: ReactNode }) {
	const [userSelection, setUserSelection] = useState<UserSelection>({
		content: "",
		needsAI: false,
	});
	return (
		<ChangesContext.Provider value={{ userSelection, setUserSelection }}>
			{children}
		</ChangesContext.Provider>
	);
}

export function useUserSelection() {
	const context = useContext(ChangesContext);
	if (!context) {
		throw new Error("useUserSelection must be used within a ChangesProvider");
	}
	return context;
}
