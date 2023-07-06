import React from 'react'
import { useUserContext } from '../../contexts'
import UserForm from './components/UserForm'
import Avatar from '../../components/user/Avatar'

const UserPage: React.FC = () => {
  const { user, setUser, tokenInStorage, setTokenInStorage } = useUserContext()
  
  return (
    <div>
        <h2>My Profile</h2>
        <div className="row">
          {/* uer form  */}'
          <div className='col col-12 col-md-5'>
              <Avatar image={user?.image} />
              <br />
              <UserForm 
                user={user}
                setUser={setUser}
                tokenInStorage={tokenInStorage}
                setTokenInStorage={setTokenInStorage}
              />
          </div>
          {/* right panel image from md */}
          <div className='col d-none d-md-block ms-md-5 col-md-6 form-image'></div>
        </div>
    </div>
  )
}

export default UserPage
