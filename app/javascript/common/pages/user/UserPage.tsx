import React from 'react'
import UserForm from './components/UserForm'
import { useUserContext } from '../../contexts'
import Avatar from '../../components/user/Avatar'

  const UserPage = () => {
      const { 
        user,
        setUser,
        tokenInStorage,
        setTokenInStorage 
    } = useUserContext()

    console.log('UserPage user?.image', user?.image)
  

  return (
    <div>
        <h2>My Profile</h2>
        <Avatar image={user?.image} />
        <br />
        <UserForm 
          user={user}
          setUser={setUser}
          tokenInStorage={tokenInStorage}
          setTokenInStorage={setTokenInStorage}
        />
    </div>
  )
}

export default UserPage
