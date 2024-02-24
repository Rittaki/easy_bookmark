import './PopupStartWindow.css';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ChooseFolderModal from './Modals/ChooseFolderModal';

function PopupStartWindow() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="row">
      <div className="col-4 nav-side">
        <div className="container">
          <div className="row buttons-row">
            <ul className="nav nav-pills">
              <li className="nav-item">
                <button type="button" className="btn btn-primary nav-button" onClick={handleShow}>New Bookmark</button>
                <ChooseFolderModal show={show} onHide={handleClose} />
              </li>
              <li className="nav-item">
                <button type="button" className="btn btn-primary nav-button">Edit</button>
              </li>
              <li className="nav-item">
                <button type="button" className="btn btn-primary nav-button">Delete</button>
              </li>
            </ul>
          </div>
        </div>
        <div className="container">
          <aside id="sidebar" className="sidebar">
            <ul className="list-unstyled ps-0">
              <li className="mb-1">
                <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#home-collapse" aria-expanded="false">
                  Education
                </button>
              </li>
              <li className="mb-1">
                <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#recipes-collapse" aria-expanded="false" aria-controls="collapseExample">
                  Recipes
                </button>
                <ul className="list-unstyled pt-1 ps-3 collapse" id="recipes-collapse">
                  <li className="mb-1">
                    <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#home-collapse" aria-expanded="false">
                      Drinks
                    </button>
                  </li>
                  <li className="mb-1">
                    <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#home-collapse" aria-expanded="false">
                      Patisserie
                    </button>
                  </li>
                </ul>
              </li>
              <li className="mb-1">
                <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#home-collapse" aria-expanded="false">
                  Sports & Fitness
                </button>
              </li>
              <li className="mb-1">
                <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#home-collapse" aria-expanded="false">
                  Beauty
                </button>
              </li>
              <li className="mb-1">
                <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#home-collapse" aria-expanded="false">
                  Travel
                </button>
              </li>
              <li className="mb-1">
                <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#home-collapse" aria-expanded="false">
                  Home Decor
                </button>
              </li>
              <li className="mb-1">
                <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#home-collapse" aria-expanded="false">
                  Business
                </button>
              </li>
              <li className="mb-1">
                <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#home-collapse" aria-expanded="false">
                  Family
                </button>
              </li>
              <li className="mb-1">
                <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#home-collapse" aria-expanded="false">
                  Pets
                </button>
              </li>
              <li className="mb-1">
                <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#home-collapse" aria-expanded="false">
                  Art
                </button>
              </li>
            </ul>
          </aside>
        </div>
      </div>
      <div className="col-8 right-side">
        <div className="container">
          <div className="row search-row">
            <form role="search">
              <input className="form-control" type="search" placeholder="Search" aria-label="Search" />
            </form>
          </div>
          <div className="row mt-2 gap-2">
            <div className="folders-container gap-2">
              <div className="card text-center bookmark-folder">
                <div className="flex flex-col flex-1 justify-between p-4">
                  <img src="resources/folder.png" alt="folder img" loading="lazy" width="100vh" />
                  <section >
                    <h6 >Drinks</h6>
                    <p >10 links</p>
                  </section>
                </div>
              </div>
              <div className="card text-center bookmark-folder">
                <div className="flex flex-col flex-1 justify-between p-4">
                  <img src="resources/folder.png" alt="folder img" loading="lazy" width="100vh" />
                  <section >
                    <h6 >Pattisserie</h6>
                    <p >15 links</p>
                  </section>
                </div>
              </div>
            </div>
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default PopupStartWindow;
