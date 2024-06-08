import "./Breadcrumbs.css";

function Breadcrumbs(props) {

    const updateBreadcrumbs = async (crumb) => {
        if (crumb === 'Home') {
            console.log('Crumb is ' + crumb);
            props.selected(crumb, "/");
        }
        else {
            chrome.runtime.sendMessage({
                action: "getFolderByName",
                folderName: crumb
            }, (response) => {
                if (response.success) {
                    console.log(`${crumb} folder detailes fetched`, response.success);
                    props.selected(crumb, response.success[0].path);
                };
            });
        }
    };


    return (
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 mt-1">
                {
                    props.crumbs.map((crumb, index) => {
                        return (
                            <li className="breadcrumb-item" key={index}>
                                <button className="btn btn-link p-0" onClick={() => updateBreadcrumbs(crumb)}>{crumb}</button>
                            </li>);

                    })
                }
                <li className="breadcrumb-item active" aria-current="page">
                    <button className="btn btn-link disabled p-0">{props.state.currentFolderToLoad}</button>
                </li>
            </ol>
        </nav>
    );
}
export default Breadcrumbs;