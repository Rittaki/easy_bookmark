import { createContext, useEffect, useState } from 'react';

export const HistoryContext = createContext();

export const HistoryContextProvider = ({ children }) => {
    const [backStack, setBackStack] = useState([{_id: "66a65fac5eddc59b4d8525f6", name: "Home", parentFolder: "", linksNumber: 2, path: "/"}]);
    const [forwardStack, setForwardStack] = useState([]);

    const handleFolderClick = (folder) => {
        const newFolder = folder;
        // Add folder to back stack
        setBackStack((prevBackStack) => [...prevBackStack, newFolder]);
        // Clear forward stack
        setForwardStack([]);
    };

    console.log('HistoryContext state: 1) Back stack:', backStack, '2) Forward stack:', forwardStack);

    const handleBack = () => {
        if (backStack.length > 1) {
            const poppedFolder = backStack.pop();
            // Move popped folder to forward stack
            setForwardStack((prevForwardStack) => [poppedFolder, ...prevForwardStack]);
            setBackStack([...backStack]);
            console.log('BACKSTACK[-1] IS: ' + backStack[backStack.length - 1]);
            return backStack[backStack.length - 1]; // poppedFolder;
        }
    };

    const handleForward = () => {
        if (forwardStack.length > 0) {
            const poppedFolder = forwardStack.shift();
            // Move popped folder to back stack
            setBackStack((prevBackStack) => [...prevBackStack, poppedFolder]);
            setForwardStack([...forwardStack]);
            return poppedFolder;
        }
    };

    return (
        <HistoryContext.Provider value={{ backStack, forwardStack, handleFolderClick, handleBack, handleForward }}>
            {children}
        </HistoryContext.Provider>
    );
};