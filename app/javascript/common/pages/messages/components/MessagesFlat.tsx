import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReceipt, faEye } from '@fortawesome/free-solid-svg-icons'
import { FlatDescription, FlatCardCarousel } from '../../../components/flats'
import { ButtonSlide, ButtonScrollToTop } from "../../../components/buttons"
import { IFlat } from '../../../utils/interfaces'

interface IProps {
    selectedMessageFlat?: IFlat,
    selectedTransactionRequestId?: number,
    scrollToTop: () => void
}

const MessagesFlat: React.FC<IProps> = (props) => {
    const {
        selectedMessageFlat,
        selectedTransactionRequestId,
        scrollToTop
    } = props

    return (
        <>
            {selectedMessageFlat && 
          <>
            <FlatDescription flat={selectedMessageFlat}/>

            <div className="my-2">
              <FlatCardCarousel images={selectedMessageFlat?.images} />
            </div>

            <div className='d-flex justify-content-between'>
              <Link 
                to={`/properties/${selectedMessageFlat.flatId}`}
              > 
                <ButtonSlide
                  className="btn-slide btn-slide-primary right-slide"
                >
                  <FontAwesomeIcon icon={faEye} />
                  {" "}Visit property
                </ButtonSlide>
              </Link>
              <div className="d-md-none">
                  <ButtonScrollToTop scrollToTop={scrollToTop} />
              </div>
            </div>

            { selectedTransactionRequestId && 
              <div className="my-2">
                <Link 
                  to={`/my-booking-requests`}
                  state={{ selectedBookingRequestId: selectedTransactionRequestId }}
                  >
                    <ButtonSlide
                      className="btn-slide btn-slide-primary right-slide"
                    >
                      <FontAwesomeIcon icon={faReceipt} />{" "}Check booking request
                    </ButtonSlide>
                </Link>
              </div>
            }
          </>
        }
        </>
    )
}

export default MessagesFlat
