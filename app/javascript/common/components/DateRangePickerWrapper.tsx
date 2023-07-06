import React, { useState } from 'react'
import "react-dates/initialize";
import { DateRangePicker } from "react-dates";
import moment from 'moment'
import { IFlat } from '../utils/interfaces'

interface IProps {
    flat?: IFlat,
    formValues: any,
    setFormValues: any
}

const DateRangePickerWrapper = (props) => {
    const { flat, formValues, setFormValues } = props

    const [focusedInput, setFocusedInput] = useState(() => formValues?.starting_date || null)

    const handleDatesChange = ({ startDate, endDate }) => {
        setFormValues(prev => {
            return  { ...prev, starting_date: startDate, ending_date: endDate }
        })
    }

    const isDayBlocked = (day) => {
        if(!flat?.futureBookedDates) return false

        return flat.futureBookedDates.reduce((acc, bookedDates) => {
            return acc || moment(day).isBetween(bookedDates.starting_date, bookedDates.ending_date)
        }, false)
    }
    
    return (
        <div className="date-range--wrapper">
            <DateRangePicker
                startDate={formValues.starting_date} // momentPropTypes.momentObj or null,
                startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
                endDate={formValues.ending_date} // momentPropTypes.momentObj or null,
                endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
                onDatesChange={({ startDate, endDate }) => handleDatesChange({ startDate, endDate })} // PropTypes.func.isRequired,
                focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                onFocusChange={focusedInput => setFocusedInput(focusedInput)} // PropTypes.func.isRequired,
                numberOfMonths={1}
                isDayBlocked={isDayBlocked}
            />
    </div>
    )
}

export default DateRangePickerWrapper
