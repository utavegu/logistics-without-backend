import React from 'react';
import PropTypes from 'prop-types';

/*
ISSUES
  1) Лэйбл
  2) Стилизация
*/

const Search = ({queryString, setQueryString}) => {

  const handleQuery = ({target}) => {
    setQueryString(target.value);
  }

  return (
    <form onSubmit={evt => evt.preventDefault()}>
      <label className="visually-hidden">Поиск</label>
      <input
        value={queryString}
        onChange={handleQuery}
        type="search"
        placeholder="Поиск (комментарии, телефон, ATI)"
        // ВРЕМЕННО
        style={{width: "100%"}}
      />
    </form>
  )
}

Search.propTypes = {
  queryString: PropTypes.string,
  setQueryString: PropTypes.func,
}

export default Search;

