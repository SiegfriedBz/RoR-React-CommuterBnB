import React from 'react'

const PaymentsPage = () => {

  // if(!initiatorAgreed || !responderAgreed) {
  //   setFlashMessage('You must agree to the booking request before making a payment')
  //   return navigate(`/properties/${flatId}/requests`)
  // }

  return (
    <div>
      <h3>PaymentsPage</h3>
      <span className="d-block">transactionRequestId</span>
      <span className="d-block">initiatorId</span>
      <span className="d-block">responderId</span>
      <span className="d-block">initiatorFlatId</span>
      <span className="d-block">responderFlatId</span>
      <span className="d-block">startingDate</span>
      <span className="d-block">endingDate</span>
      <span className="d-block">exchangePricePerNightInCents</span>
      <span className="d-block">initiatorAgreed</span>
      <span className="d-block">responderAgreed</span>
      <span className="d-block">initiatorPaid</span>
      <span className="d-block">responderPaid</span>
      <span className="d-block">paymentStatus</span>
    </div>
  )
}

export default PaymentsPage