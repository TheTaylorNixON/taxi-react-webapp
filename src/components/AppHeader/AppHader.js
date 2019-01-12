import React from 'react'

import './AppHeader.scss'

const AppHeader = ({ header }) => {
  return (
    <div className="header-container">
      <h3>{header}</h3>
    </div>
  )
}

export default AppHeader
