import { useState } from "react";
import PropTypes from 'prop-types';
import Notiflix from 'notiflix';
import styles from './Searchbar.module.css';

const Searchbar = ({ changeSearch }) => {
  const [input, setInput] = useState('');

  const handleInputChange = (event) => {
      setInput(event.currentTarget.value.toLowerCase());
  };

  const handleSubmit = (event) => {
      event.preventDefault();
      if (input.trim() === "") {
          return Notiflix.Notify.failure(
              `Please enter your search query`
          );
      }
      changeSearch(input);
  };

  return (
      <header className={styles.Searchbar}>
          <form className={styles.Form} onSubmit={handleSubmit}>
              <input
                  className={styles.Input}
                  type="text"
                  autoComplete="off"
                  autoFocus
                  
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Search images and photos"
              />

              <button type="submit" className={styles.Button}>
                  <span className={styles.ButtonLabel}>
                      Search
                  </span>
              </button>
          </form>
      </header>
  )
};

Searchbar.propTypes = {
  changeSearch: PropTypes.func.isRequired,
};

export default Searchbar;