import React, { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesLeft, faAnglesRight } from '@fortawesome/free-solid-svg-icons'
import { useFlatsContext } from '../contexts'
import LoadingSpinners from './LoadingSpinners'
import FlatsList from '../pages/home/components/FlatsList'
import NewsLetterSuscribe from './NewsLetterSuscribe'

interface IProps {
  flatsPerPage: number
}

const PaginatedWrapper: React.FC<IProps> = ({ flatsPerPage }) => {
  //* hooks & context
  const { flats } = useFlatsContext()

  //* state
  // Here we use item offsets we could also use page offsets following the API or data you're working with.
  const [flatsForThisPage, setFlatsForThisPage] = useState(undefined)
  const [pageCount, setPageCount] = useState()
  const [itemOffset, setItemOffset] = useState(0)

  const endOffset = itemOffset + flatsPerPage

  useEffect(() => {
    if(!flats) return

    const flatsForThisPage = flats.slice(itemOffset, endOffset)
    const pageCount = Math.ceil(flats.length / flatsPerPage)

    setFlatsForThisPage(flatsForThisPage)
    setPageCount(pageCount)
  }, [flats, itemOffset])

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    if(!flats) return

    const newOffset = (event.selected * flatsPerPage) % flats.length
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    )
    setItemOffset(newOffset)
  }

  if(!flats || !flatsForThisPage) return <LoadingSpinners />

  return (
    <>
      <FlatsList flatsForThisPage={flatsForThisPage} />
      <NewsLetterSuscribe />

      <div className="d-flex justify-content-center">
        <ReactPaginate
          previousLabel={<FontAwesomeIcon icon={faAnglesLeft} />}
          nextLabel={<FontAwesomeIcon icon={faAnglesRight} />}
          onPageChange={handlePageClick}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          renderOnZeroPageCount={null}
        />
      </div>
    </>
  )
}

export default PaginatedWrapper
