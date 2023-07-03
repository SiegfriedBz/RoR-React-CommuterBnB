import moment from 'moment'

export const formatedDate = (dateStr) => {
    return moment(dateStr).format("MMM Do YY")
}