import { HistoryContext } from "../contexts/HistoryContext"
import { useContext } from "react"

export const useHistoryContext = () => {
  const context = useContext(HistoryContext);

  if (!context) {
    throw Error('useHistoryContext must be used inside of HistoryContextProvider');
  }

  return context;
};