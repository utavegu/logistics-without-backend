import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

/*
ISSUES
  1) Прибраться. Тупо прибраться =)
*/

const Filters = ({claims, onGetFilters: handleGetFilters}) => {

  const INITIAL_DATE = "all"

  const [selectedDate, setSelectedDate] = useState(INITIAL_DATE);

  useEffect(
    () => {
      setSelectedDate(INITIAL_DATE);
    },
    [claims]
  )

  const getUniqueDates = () => {
    const allDates = new Set();
    for (const claim of claims) {
      allDates.add(claim.datetime.slice(0, -7));
    }
    return Array.from(allDates);
  }
  
  

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

export default Filters;

