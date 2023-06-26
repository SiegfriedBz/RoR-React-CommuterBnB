import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReceipt, faEye } from '@fortawesome/free-solid-svg-icons'
import { FlatDescription, FlatCardCarousel } from '../../components/flats'
import { IFlat } from '../../utils/interfaces'

interface IProps {
    selectedMessageFlat?: IFlat,
    selectedTransactionRequestId?: number,
}

const MessagesFlat: React.FC<IProps> = (props) => {
    const {
        selectedMessageFlat,
        selectedTransactionRequestId
    } = props

    return (
        <>
            {selectedMessageFlat && 
          <>
            <FlatDescription flat={selectedMessageFlat}/>

            <div className="my-2">
              <FlatCardCarousel images={selectedMessageFlat?.images} />
            </div>

            <div>
              <Link 
                to={`/properties/${selectedMessageFlat.flatId}`}
                className="btn btn-outline-dark"
              >
                <FontAwesomeIcon icon={faEye} />
                {" "}Visit property
              </Link>
            </div>

            { selectedTransactionRequestId && 
              <div className="my-2">
                <Link 
                  to={`/my-booking-requests`}
                  state={{ selectedBookingRequestId: selectedTransactionRequestId }}
                  className="btn btn-outline-dark"
                ><FontAwesomeIcon icon={faReceipt} />{" "}Check booking request
                </Link>
              </div>
            }
          </>
        }
        </>
    )
}

export default MessagesFlat
