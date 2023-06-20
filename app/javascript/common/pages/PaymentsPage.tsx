import React from 'react'

const PaymentsPage = () => {

  // if(!initiatorAgreed || !responderAgreed) {
  //   setFlashMessage('You must agree to the booking request before making a payment')
  //   return navigate(`/properties/${flatId}/requests`)
  // }

  return (
    <div>
      <h3>PaymentsPage</h3>
      <span>transactionRequestId</span>
      <span>initiatorId</span>
      <span>responderId</span>
      <span>initiatorFlatId</span>
      <span>responderFlatId</span>
      <span>startingDate</span>
      <span>endingDate</span>
      <span>exchangePricePerNightInCents</span>
      <span>initiatorAgreed</span>
      <span>responderAgreed</span>
      <span>initiatorPaid</span>
      <span>responderPaid</span>
      <span>paymentStatus</span>
    </div>
  )
}

export default PaymentsPage