import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useFetch } from '../hooks'
import { useAppContext, useFlatsContext } from '../contexts'
import { LoadingSpinners } from '../components'

const HostedBy: React.FC = () => {
  const { id: hostFlatId } = useParams()
  const { getFlatDetails } = useFetch()
  const { isLoading } = useAppContext()
  const { updateFlatInContext } = useFlatsContext()

  const [hostFlat, setHostFlat] = useState(null)

  useEffect(() => {
    if(!hostFlatId) return

    (async () => {
      const fetchedData = await getFlatDetails(hostFlatId)
      if (!fetchedData) return
  
      const [response, data] = fetchedData
      if(!data) return

      const hostFlat = data?.flat
      if(!hostFlat) return

      setHostFlat(hostFlat)
      updateFlatInContext(hostFlat)
    })()

  }, [hostFlatId])

  if(isLoading) return <LoadingSpinners />

  if(!hostFlat || !hostFlat?.owner) return null

  const { owner: { email, description, createdAt } } = hostFlat

  const formatedDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  return (
    <div>
       <h2 className="text-info">Host</h2>
        <span className="d-block">{email.split("@")[0]}</span>
        {description && <span className="d-block">{description}</span>}
        <span>Member since {formatedDate(createdAt)}</span>
    </div>
  )
}

export default HostedBy
