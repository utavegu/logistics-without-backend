import React from 'react';
import PropTypes from 'prop-types';
import s from './Search.module.css';

const Search = ({queryString, setQueryString}) => {
  const handleQuery = ({target}) => {
    setQueryString(target.value);
  }

  return (
    <form className={s.search} onSubmit={evt => evt.preventDefault()}>
      <label htmlFor="search" className="visually-hidden">Поиск</label>
      <input
        value={queryString}
        onChange={handleQuery}
        type="search"
        id="search"
        placeholder="Поиск (комментарии, телефон, ATI)"
      />
    </form>
  )
}

Search.propTypes = {
  queryString: PropTypes.string,
  setQueryString: PropTypes.func,
}

export default Search;

