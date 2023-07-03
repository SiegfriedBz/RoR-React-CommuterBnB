import React from 'react'
import { useAppContext } from '../../contexts'
import { LoadingSpinners } from '../../components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { formatedDate } from '../../utils/helpers/formatedDate'
import { IFlat } from '../../utils/interfaces'
import Avatar from '../user/Avatar'

interface IProps {
  hostFlat?: IFlat
}

const FlatHostedBy: React.FC<IProps> = ({ hostFlat }) => {
  const { isLoading } = useAppContext()

  if(isLoading || !hostFlat) return <LoadingSpinners />

  const { owner: { email, description, image, createdAt } } = hostFlat

  console.log('FlatHostedBy hostFlat.owner', hostFlat.owner)

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
