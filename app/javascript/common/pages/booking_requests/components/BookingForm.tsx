import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useFetch } from '../../../hooks'
import { useAppContext, useUserContext, useFlatsContext } from '../../../contexts'
import { TotalPriceAndDays, DateRangePickerWrapper } from '../../../components'
import {ButtonSlide} from '../../../components/buttons/'
import { differenceInDays } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReceipt } from '@fortawesome/free-solid-svg-icons'
import { IFlat } from '../../../utils/interfaces'

interface ITransactionRequest {
    starting_date: string,
    ending_date: string,
    exchange_price_per_night_in_cents?: number,
    responder_id?: number,
    initiator_id?: number,
    responder_flat_id?: number,
    initiator_flat_id?: number
}

const initFormValues = {
    starting_date: null,
    ending_date: null,
};

const BookingForm: React.FC = () => {
    //* hooks
    const { state } = useLocation()
    const { createBookingRequest } = useFetch()
    const navigate = useNavigate()

    //* context
    const { setFlashMessage } = useAppContext()
    const { user } = useUserContext()
    const { flats } = useFlatsContext()

    //* state
    const [responderFlat, setResponderFlat] = useState(undefined)
    const [currentUserFlats, setCurrentUserFlats] = useState([])
    const [currentUserSelectedFlatId, setCurrentUserSelectedFlatId] = useState(undefined)
    const [pricePerNightInCents, setPricePerNightInCents] = useState(0)
    const [isExchange, setIsExchange] = useState(false)
    const [formValues, setFormValues] = useState(initFormValues)

    // set responderFlat & responder_id, responder_flat_id, exchange_price_per_night_in_cents in form
    useEffect(() => {
        if(!flats || !state?.selectedFlatId) return

        const hostFlatId = parseInt(state.selectedFlatId)

        const hostFlat = flats.find(flat => flat.flatId === hostFlatId)
        if(!hostFlat) return

        const hostFlatOwnerId = hostFlat?.owner?.userId
        const initPricePerNightInCents = hostFlat?.pricePerNightInCents

        setResponderFlat(hostFlat)
        setPricePerNightInCents(initPricePerNightInCents)
        setFormValues((prev) => {
            return {
                ...prev,
                responder_flat_id: hostFlatId,
                responder_id: hostFlatOwnerId,
                exchange_price_per_night_in_cents: initPricePerNightInCents
        }})
    }, [flats, state])
    
    // set currentUserFlats if any
    useEffect(() => {
        if(!user?.userId || !flats) return

        const currentUserFlats = flats?.filter(flat => flat.owner.userId === user?.userId)

        setCurrentUserFlats(currentUserFlats)
    }, [user, flats])
    
    // init exchange scenario: set initiator_flat_id && price_per_night_in_cents
    useEffect(() => {
        if(!responderFlat || !currentUserFlats) return

        const responderFlatPricePerNightInCents = responderFlat?.pricePerNightInCents

        const currentUserSelectedFlat = isExchange ?
            currentUserFlats.find(flat => flat.flatId === currentUserSelectedFlatId) || currentUserFlats[0]
            : undefined

        const currentUserSelectedFlatPricePerNightInCents = isExchange ?
            currentUserSelectedFlat?.pricePerNightInCents
            : 0

        const newPricePerNightInCents = isExchange ?
            responderFlatPricePerNightInCents - currentUserSelectedFlatPricePerNightInCents
            : responderFlatPricePerNightInCents
        
        setPricePerNightInCents(newPricePerNightInCents)
        setFormValues((prev) => {
            return {
                ...prev,
                initiator_flat_id: currentUserSelectedFlatId,
                exchange_price_per_night_in_cents: newPricePerNightInCents,
            }
        })
    }, [responderFlat, currentUserFlats, currentUserSelectedFlatId, isExchange])


    // init exchange scenario: set initiator_flat_id to the first flat of the current user
    useEffect(() => {
        if(isExchange) {
            setCurrentUserSelectedFlatId(currentUserFlats[0]?.flatId)
        } else {
            setCurrentUserSelectedFlatId(undefined)
        }
    }, [isExchange])

    // handlers
    const toggleIsExchange = () => {
        setIsExchange((prev: boolean) => !prev)
    }

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(!formValues?.starting_date || !formValues?.ending_date) {
            setFlashMessage({ message: "Please select a date range", type: "warning" })
            return
        }
        
        // create booking request
        const fetchedNewTransactionRequest = await createBookingRequest(responderFlat.flatId, formValues)
                
        if(fetchedNewTransactionRequest) {
            const data= fetchedNewTransactionRequest[1]
            setFlashMessage({ message: data.message, type: "success" })
        } else {
            setFlashMessage({ message: "Booking request creation went wrong", type: "warning" })
        }
        
        setFormValues((prev) => {
            return {
                ...prev,
                starting_date: initFormValues.starting_date,
                ending_date: initFormValues.ending_date
            }
        })

        // nav to
        navigate("/my-booking-requests")
    }

    let totalDays = 0
    let totalPriceInCents = 0
    let pricePerNight = 0
    if(formValues?.starting_date && formValues?.ending_date) {
        const start = new Date(formValues?.starting_date)
        const end = new Date(formValues?.ending_date)
        totalDays = differenceInDays(end, start)
        totalPriceInCents = Math.abs(totalDays * pricePerNightInCents)
        pricePerNight = Math.abs(pricePerNightInCents/100)
    }

    if(!state?.selectedFlatId) return null

    const renderCurrentUserFlatsList = () => {
        return (
            <select
                id="initiator_flat_id"
                name="initiator_flat_id"
                className="form-control mb-2"
                onChange={(e) => setCurrentUserSelectedFlatId(parseInt(e.target.value))}
            >
                { currentUserFlats.map((flat: IFlat) => {
                    return (
                        <option
                            key={flat?.flatId}
                            value={flat?.flatId}
                        >
                            My property: {flat?.title}, ${flat?.pricePerNightInCents/100} per night
                        </option>
                    )})
                }
            </select>
        )
    }

    return (
        <>
        {/* switch isExchange */}
            { currentUserFlats?.length > 0 && 
                <div className="d-flex-mb-2">
                    <div className="form-check form-switch">
                        <input 
                            id="isExchange" 
                            type="checkbox"
                            role="switch"
                            className="form-check-input"
                            checked={isExchange}
                            onChange={toggleIsExchange}
                            />
                        <label 
                            htmlFor="#isExchange"
                            className={`form-check-label ${isExchange ? "text-success" :  "text-primary"}`}
                            >Exchange
                        </label>
                    </div>
                </div>
            }
            {/* currentUser flats list*/}
            { isExchange && renderCurrentUserFlatsList() }

            {/* DateRange */}
            <form onSubmit={handleSubmit}>
                <DateRangePickerWrapper
                    flat={responderFlat}
                    formValues={formValues}
                    setFormValues={setFormValues}
                />
                <ButtonSlide
                    type="submit"
                    className="btn-slide btn-slide-primary right-slide my-2"
                    >
                        <FontAwesomeIcon icon={faReceipt} />
                        {" "}Send booking request
                </ButtonSlide>
            </form>

            {/* total */}
            { formValues?.starting_date && formValues?.ending_date &&
                <TotalPriceAndDays
                    pricePerNight={pricePerNight}
                    totalPriceInCents={totalPriceInCents}
                    totalDays={totalDays}
                />
            }
        </>
    )
}

export default BookingForm
