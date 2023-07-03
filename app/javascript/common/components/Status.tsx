import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHourglassEnd, faBan, faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { BookingRequestStatusType } from '../utils/interfaces'

const Status: React.FC<BookingRequestStatusType> = ({ status }) => {
    return (
        <>
        { status === "pending" ?
          <FontAwesomeIcon className="text-info" icon={faHourglassEnd} />
          : status === "rejected" ?
              <FontAwesomeIcon className="text-danger" icon={faBan} />
            : status === "completed" ?
                <FontAwesomeIcon className="text-success" icon={faCircleCheck} />
              : null
        }
        {" "}{status}
      </>
    )
}

export default Status
