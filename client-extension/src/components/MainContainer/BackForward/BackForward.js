import { useEffect, useState } from "react";
import "./BackForward.css"
import { useHistoryContext } from "../../hooks/useHistoryContext";

function BackForward(props) {
    const [backButton, setBackButton] = useState(false);
    const [forwardButton, setForwardButton] = useState(false);

    const { backStack, forwardStack, handleBack, handleForward } = useHistoryContext();

    const updateCrumbs = (newCrumbs) => {
        const crumbs = newCrumbs.split('/').filter((crumb) => crumb !== '');
        console.log('Crumbs:', crumbs);
        props.setCrumbs(crumbs);
    }

    useEffect(() => {
        // console.log("I'M INSIDE THE BACK USE EFFECT");
        if (backStack.length > 1) {
            setBackButton(true);
        }
        else {
            setBackButton(false);
        }
    }, [backStack]);

    useEffect(() => {
        // console.log("I'M INSIDE THE FORWARD USE EFFECT");
        if (forwardStack.length > 0) {
            setForwardButton(true);
        }
        else {
            setForwardButton(false);
        }
    }, [forwardStack]);

    const handleClickBack = (e) => {
        const folderToLoad = handleBack();
        updateCrumbs(folderToLoad.path);
        props.setState((prevState) => ({ ...prevState, currentFolderToLoad: folderToLoad }));
    };

    const handleClickForward = (e) => {
        const folderToLoad = handleForward();
        updateCrumbs(folderToLoad.path);
        props.setState((prevState) => ({ ...prevState, currentFolderToLoad: folderToLoad }));
    };

    return (
        <li className="nav-item">
            <nav aria-label="Back-Forward Folders Navigation">
                <ul className="pagination">
                    <li className={`page-item ${backButton ? '' : 'disabled'}`}>
                        <button className="page-link py-0 px-1" onClick={handleClickBack}>
                            <i className="bi bi-arrow-left-circle" style={{ fontSize: '25px', color: 'cornflowerblue' }}></i>
                        </button>
                    </li>

                    <li className={`page-item ${forwardButton ? '' : 'disabled'}`}>
                        <button className="page-link py-0 px-1" onClick={handleClickForward}>
                            <i className="bi bi-arrow-right-circle" style={{ fontSize: '25px', color: 'cornflowerblue' }}></i>
                        </button>
                    </li>
                </ul>
            </nav>
        </li>
    );
};

export default BackForward;