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
    zIndex: 1000
  },
}

interface IProps {
    modalIsOpen: boolean,
    toggleModal: () => void,
    messageRecipientId?: number,
    messageFlatId?: number,
    messageTransactionRequestId?: number
}

const MessageFormModalWrapper: React.FC<IProps> = ({ 
        modalIsOpen,
        toggleModal,
        messageRecipientId,
        messageFlatId,
        messageTransactionRequestId
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
                        <h3 className="text-dark">Send Message</h3>
                        <MessageForm 
                            toggleModal={toggleModal}
                            messageRecipientId={messageRecipientId}
                            messageFlatId={messageFlatId}
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
        </div>
    )
}

export default MessageFormModalWrapper
