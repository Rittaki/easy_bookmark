import { useState, useEffect } from "react";

function BookmarksContainer(props) {
    return (
        <div className="links-container">
            <div className="list-group list-group-flush">
                <a href="#" className="list-group-item list-group-item-action align-items-center d-flex gap-3" aria-current="true">
                    <img src="https://github.com/twbs.png" alt="twbs" width="32" height="32" className="rounded-circle flex-shrink-0" />
                    <div className="d-flex gap-2 w-100 align-items-center justify-content-between">
                        <div>
                            <h6 className="mb-0">List group item heading</h6>
                            <p className="mb-0 opacity-75">Some placeholder content in a paragraph.</p>
                        </div>
                        <small className="opacity-50 text-nowrap">New</small>
                    </div>
                </a>
                <a href="#" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">A list item
                    <span className="badge text-bg-primary rounded-pill">New</span>
                </a>
                <a href="#" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">A simple list group item
                    <small className="opacity-50 text-nowrap">New</small>
                </a>
                <a href="#" className="list-group-item list-group-item-action">A simple list group item</a>
                <a href="#" className="list-group-item list-group-item-action">A simple list group item</a>
                <a href="#" className="list-group-item list-group-item-action">A simple list group item</a>
            </div>
        </div>
    );
};

export default BookmarksContainer;