import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export const Modal = ({ handleClose, handleConfirm, show, children }) => {
    const showHideClassName = show ? "modal display-block" : "modal display-none";

    return (
        <div className={showHideClassName}>
            <section className="modal-main">
                <div className="top-buttons"><a onClick={handleClose}><FontAwesomeIcon icon={['fas', 'times']}/></a></div>
                {children}
                <div className="bottom-buttons">
                    <button className="btn-confirm" onClick={handleConfirm}>
                        Confirm <FontAwesomeIcon icon={['fas', 'arrow-right']}/>
                    </button>
                </div>
            </section>
        </div>
    );
};
