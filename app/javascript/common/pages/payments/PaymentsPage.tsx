import React, { useState, useEffect} from 'react'
import { useFetch } from '../../hooks'
import PaymentCard from './PaymentCard'

const PaymentsPage: React.FC = () => {
  //* hooks
  const { getUserPayments } = useFetch()

  //* state
  const [payments, setPayments] = useState([])

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

  return (
    <>
      <h3>PaymentsPage</h3>
      <div className="row row-cols-2 row-cols-lg-3 row-cols-xl-4 g-1 g-md-2">
        { payments && payments?.map(payment => {
          return (
            <div className="col" key={payment.paymentId} >
              <PaymentCard payment={payment} />
            </div>
          )
          
        }) }
       </div>
    </>
  )
}

export default PaymentsPage
