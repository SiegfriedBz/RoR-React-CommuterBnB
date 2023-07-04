import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faCircleXmark
 } from '@fortawesome/free-regular-svg-icons'
    
const initCustomStyles = {
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
    containerWidth?: number
}

const ModalWrapper: React.FC<IProps> = ({ 
        modalIsOpen,
        toggleModal,
        containerWidth,
        children
     }) => {

    Modal.setAppElement('#root')

    // wrapper styles
    const [customStyles, setCustomStyles] = useState(initCustomStyles)

    useEffect(() => {
        if(!containerWidth) return 

        if(containerWidth < 768) {
            setCustomStyles(prev => {
                return { 
                    content: { 
                        ...prev.content,
                        left: '50%',
                        width: '85%'
                    }
            }})
        }

        return () => {
            setCustomStyles(initCustomStyles)
        }

    }, [])
    
    return (
        <div>
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
                            <FontAwesomeIcon className="text-primary" icon={faCircleXmark} />
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default ModalWrapper
