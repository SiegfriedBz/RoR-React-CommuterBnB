import React, { useState } from 'react'
import { useFetch } from '../../hooks'

const initUser = {
    email: "",
    description: "",
    password: ""
}

const UserForm = () => {
    const { updateUser } = useFetch()

    const [user, setUser] = useState(initUser)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setUser({ ...user, [name]: value })
    }

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const data = await updateUser(user)
        
    }

    return (
        <>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="email">email</label>
                <input  
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                />

                <label htmlFor="description">description</label>
                <textarea 
                    className="form-control"
                    id="description"
                    name="description"
                    value={user.description}
                    onChange={handleChange}
                />

                <label htmlFor="password">password</label>
                <input  type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={user.password}
                        onChange={handleChange}
                />
            </div>
            <button type="submit" className="btn btn-outline-primary">Submit</button>
        </form>
        </>
    )
}

export default UserForm