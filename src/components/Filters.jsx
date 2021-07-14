import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/*
ISSUES
  1) Прибраться. Тупо прибраться =)
  2) Что-то не нравится теперь мне этот компонент совсем... галимый DRY
*/

const Filters = ({claims, onGetFilters: handleGetFilters}) => {

  const INITIAL_VALUE = "all"; // лишнее уже

  const [filters, setFilters] = useState({
    date: INITIAL_VALUE,
    firm: INITIAL_VALUE,
    carrier: INITIAL_VALUE,
  });

  const handleInputChange = ({target}) => {
    setFilters(prevForm => ({...prevForm, [target.name]: target.value}));
    handleGetFilters(filters);
  }

  /* Сброс всех фильтров до дефолта, если что-то произошло с заявками - замысел такой был */
  /*
  useEffect(
    () => {
      setFilters(prevForm => ({...prevForm, date: ""}));
      setFilters(prevForm => ({...prevForm, firm: ""}));
      setFilters(prevForm => ({...prevForm, carrier: ""}));
    },
    [claims]
  )
  */

  const getUniqueDates = () => {
    const allDates = new Set();
    const allFirms = new Set();
    const allCarrier = new Set();

    for (const claim of claims) {
      allDates.add(claim.datetime.slice(0, -7));
      allFirms.add(claim.firmName);
      allCarrier.add(claim.fullname);
    }

    const uniqueData = {
      dates: Array.from(allDates),
      firms: Array.from(allFirms),
      carriers: Array.from(allCarrier),
    }

    return uniqueData;
  }


  return (
    <form>
      <select name="date" value={filters.date} onChange={handleInputChange}>
        <option value="all">Все даты</option>
        {getUniqueDates().dates.map(date => <option key={date} value={date}>{date}</option>)}
      </select>

      <select name="firm" value={filters.firm} onChange={handleInputChange}>
        <option value="all">Все фирмы</option>
        {getUniqueDates().firms.map(firm => <option key={firm} value={firm}>{firm}</option>)}
      </select>

      <select name="carrier" value={filters.carrier} onChange={handleInputChange}>
        <option value="all">Все перевозчики</option>
        {getUniqueDates().carriers.map(carrier => <option key={carrier} value={carrier}>{carrier}</option>)}
      </select>
    </form>
  )
}

Filters.propTypes = {
  // УСТАРЕЛИ!!!!
  dates: PropTypes.arrayOf(PropTypes.string),
}

export default Filters;

