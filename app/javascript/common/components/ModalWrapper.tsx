import React from 'react'
import Modal from 'react-modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faCircleXmark
 } from '@fortawesome/free-regular-svg-icons'
    
const customStyles = {
  content: {
    top: '50%',
    left: '33%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '33%',
    zIndex: 1000
  },
}

interface IProps {
    modalIsOpen: boolean,
    toggleModal: () => void,
}

const ModalWrapper: React.FC<IProps> = ({ 
        modalIsOpen,
        toggleModal,
        children
     }) => {

    Modal.setAppElement('#root')
    
    return (
        <div className='modal--wrapper'>
            <Modal
                isOpen={modalIsOpen}
                // onAfterOpen={afterOpenModal}
                onRequestClose={toggleModal}
                style={customStyles}
            >
                <div className="row">
                    <div className="col-11">
                        { children }
                    </div>
                    <div className="col-1">
                        <button 
                            onClick={toggleModal}
                            className="bg-transparent border-0"
                        >
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default ModalWrapper
