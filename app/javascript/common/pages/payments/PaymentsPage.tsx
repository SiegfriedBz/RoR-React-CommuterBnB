import React, { useState, useEffect, useRef } from 'react'
import { useFetch } from '../../hooks'
import PaymentCard from './components/PaymentCard'

const PaymentsPage: React.FC = () => {
  //* hooks
  const { getUserPayments } = useFetch()
  const containerRef = useRef(null)

  //* state
  const [payments, setPayments] = useState([])
  const [containerWidth, setContainerWidth] = useState(undefined)

  //* effects
  useEffect(() => {
    (async () => {
      const fetchedData = await getUserPayments()
      if(!fetchedData) return

      const [response, data] = fetchedData
      if(!response.ok) return

      setPayments(data?.payments)

    })()
  }, [])

  useEffect(() => {
    const containerWidth = containerRef?.current?.offsetWidth
    if(!containerWidth) return 
    
    setContainerWidth(containerWidth)
  }, [])

  return (
    <div ref={containerRef}>
      <h3>My payments</h3>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-2 g-md-3">
        { payments && payments?.map(payment => {
          return (
            <div className="col d-flex justify-content-center" key={payment.paymentId} >
              <PaymentCard 
                payment={payment}
                containerWidth={containerWidth}
                />
            </div>
          )
        }) }
       </div>
    </div>
  )
}

export default PaymentsPage
