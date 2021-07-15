import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';


const Filters = ({claims, onGetFilters: handleGetFilters}) => {

  const INITIAL_VALUE = "all";

  const getUniqueData = () => {
    const allDates = new Set();
    const allFirms = new Set();
    const allCarrier = new Set();

    for (const claim of claims) {
      allDates.add(claim.datetime.slice(0, -7));
      allFirms.add(claim.firmName);
      allCarrier.add(claim.fullname);
    }

    return {
      dates: Array.from(allDates),
      firms: Array.from(allFirms),
      carriers: Array.from(allCarrier),
    };
  }

  const {dates, firms, carriers} = getUniqueData();

  const [filters, setFilters] = useState({
    date: INITIAL_VALUE,
    firm: INITIAL_VALUE,
    carrier: INITIAL_VALUE,
  });

  const handleInputChange = ({target}) => {
    setFilters(prevForm => ({...prevForm, [target.name]: target.value}));
  }

  useEffect(
    () => {
      handleGetFilters(filters);
    },
    [filters]
  );

  useEffect(
    () => {
      setFilters({date: INITIAL_VALUE, firm: INITIAL_VALUE, carrier: INITIAL_VALUE});
    },
    [claims]
  );

  
  return (
    <form>
      <select name="date" value={filters.date} onChange={handleInputChange}>
        <option value="all">Все даты</option>
        {dates.map(date => <option key={date} value={date}>{date}</option>)}
      </select>

      <select name="firm" value={filters.firm} onChange={handleInputChange}>
        <option value="all">Все фирмы</option>
        {firms.map(firm => <option key={firm} value={firm}>{firm}</option>)}
      </select>

      <select name="carrier" value={filters.carrier} onChange={handleInputChange}>
        <option value="all">Все перевозчики</option>
        {carriers.map(carrier => <option key={carrier} value={carrier}>{carrier}</option>)}
      </select>
    </form>
  )
}

Filters.propTypes = {
  claims: PropTypes.arrayOf(PropTypes.object),
  handleGetFilters: PropTypes.func,
};

export default Filters;

