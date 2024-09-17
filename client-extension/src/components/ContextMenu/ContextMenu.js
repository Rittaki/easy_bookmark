import "./ContextMenu.css"

function ContextMenu(props) {
    return (
        <menu
            onContextMenu={(e) => e.preventDefault()}
            style={{
                top: props.positionY + 2 + 'px',
                left: props.positionX + 2 + 'px'
            }}
            className={`context-menu ${props.isToggled ? 'active' : ''}`}
            ref={props.contextMenuRef}
        >
            {props.buttons.map((button, index) => {

                function handleClick(e) {
                    e.stopPropagation();
                    button.onClick(e, props.rightClicked);
                }

                return (
                    <button
                        onClick={handleClick}
                        key={index}
                        className="context-menu-button"
                    >
                        <span>{button.text}</span>
                    </button>
                );
            })}
        </menu>
    )
}

export default ContextMenu;