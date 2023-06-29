import React from 'react'

interface IProps {
  children: React.ReactNode,
  rest: any
}

const ButtonSlide: React.FC<IProps> = (props) => {
  const { children, ...rest } = props

  return (
    <button { ...rest }>
      { children }
    </button>
  )
}

export default ButtonSlide
