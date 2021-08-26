import React from 'react';
import NavBar from './NavBar';
import Notify from './Notify';
import Modal from './Modal';

function Layout({ children }) {
    return (
        <div className="container-fluid">
            <NavBar />
            <Notify />
            <Modal />
            <div className="container">
                {children}
            </div>
        </div>
    )
}

export default Layout
