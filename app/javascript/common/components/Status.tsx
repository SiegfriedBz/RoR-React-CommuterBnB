import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHourglassEnd, faBan, faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { BookingRequestStatusType } from '../utils/interfaces'

const Status: React.FC<BookingRequestStatusType> = ({ status }) => {
    return (
        <>
        { status === "pending" ?
        <span className="text-primary">
          <FontAwesomeIcon icon={faHourglassEnd} />
        </span>
          : status === "rejected" ?
            <span className="text-danger">
              <FontAwesomeIcon icon={faBan} />
            </span>
            : status === "completed" ?
              <span className="text-success">
                <FontAwesomeIcon icon={faCircleCheck} />
              </span>
              : null
        }
        {" "}{status}
      </>
    )
}

export default Status
