import "./Breadcrumbs.css";

function Breadcrumbs(props) {

    const updateBreadcrumbs = async (crumb) => {
        if (crumb === 'Home') {
            console.log('Crumb is ' + crumb);
            props.selected(crumb, [{ _id: "66a65fac5eddc59b4d8525f6", name: "Home", parentFolder: "", linksNumber: 2, path: "/" }]);
        }
        else {
            chrome.runtime.sendMessage({
                action: "getFolderByName",
                folderName: crumb
            }, (response) => {
                if (response.success) {
                    console.log(`${crumb} folder detailes fetched`, response.success);
                    props.selected(crumb, response.success);
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
                                <button style={{color: '#38B6FF'}} className="btn btn-link p-0" onClick={() => updateBreadcrumbs(crumb)}>{crumb}</button>
                            </li>);

                    })
                }
                <li className="breadcrumb-item active" aria-current="page">
                    <button className="btn btn-link disabled p-0">{props.state.currentFolderToLoad.name}</button>
                </li>
            </ol>
        </nav>
    );
}
export default Breadcrumbs;