import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { useAppContext } from '../../contexts'
import Avatar from '../user/Avatar'
import { LoadingSpinners } from '../../components'
import { formatedDate } from '../../utils/helpers/formatedDate'
import { IFlat } from '../../utils/interfaces'

interface IProps {
  hostFlat?: IFlat
}

const FlatHostedBy: React.FC<IProps> = ({ hostFlat }) => {
  const { isLoading } = useAppContext()

  if(isLoading || !hostFlat) return <LoadingSpinners />

  const { owner: { email, description, image, createdAt } } = hostFlat

  return (
    <div className="my-3">
       <h2>Host</h2>
        <span className="d-block text-primary">
          <FontAwesomeIcon icon={faUser} />
          {" "}{email.split("@")[0]}
        </span>

        <Avatar image={image} />
        {description && <span className="d-block my-1">{description}</span>}
        <span className="d-block">Member since {formatedDate(createdAt)}</span>
    </div>
  )
}

export default FlatHostedBy
