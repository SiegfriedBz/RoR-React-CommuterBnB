import React from 'react'
import Modal from 'react-modal'
import MessageForm from '../messages/MessageForm'
    
const customStyles = {
  content: {
    top: '50%',
    left: '33%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '33%',
  },
};

const MessageFormModalWrapper = ({ 
        modalIsOpen,
        toggleModal,
        messageRecipientId,
        messageRecipientFlatId,
        messageTransactionRequestId
     }) => {
    Modal.setAppElement('#root')
    
    return (
            <Modal
            isOpen={modalIsOpen}
            // onAfterOpen={afterOpenModal}
            onRequestClose={toggleModal}
            style={customStyles}
        >
            <div className="row">
                <div className="col-11">
                    <MessageForm 
                        messageRecipientId={messageRecipientId}
                        messageRecipientFlatId={messageRecipientFlatId}
                        messageTransactionRequestId={messageTransactionRequestId}
                    />
                </div>
                <div className="col-1">
                    <button 
                        className="btn btn-close"
                        onClick={toggleModal}
                    />
                </div>
            </div>
    </Modal>
    )
}

export default MessageFormModalWrapper
