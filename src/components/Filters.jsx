import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Filters = ({claims, onGetFilters: handleGetFilters}) => {

  const getUniqueDates = () => {
    const allDates = new Set();
    for (const claim of claims) {
      allDates.add(claim.datetime.slice(0, -7));
    }
    return Array.from(allDates);
  }
  
  const [selectedDate, setSelectedDate] = useState("all");

  const handleInputChange = ({target}) => {
    setSelectedDate(target.value);
    handleGetFilters(target.value);
  }

  return (
    <form>
      <select value={selectedDate} onChange={handleInputChange}>
        <option value="all">Все даты</option>
        {getUniqueDates().map(date => <option key={date} value={date}>{date}</option>)}
      </select>
    </form>
  )
}

Filters.propTypes = {
  dates: PropTypes.arrayOf(PropTypes.string),
}

export default Filters

