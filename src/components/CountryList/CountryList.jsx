import PropTypes from 'prop-types';
import CountryItem from '../CountryItem/CountryItem';
import styles from './CountryList.module.css';
import Spinner from '../Spinner/Spinner';
import Message from '../Message/Message';
import { useCities } from '../../contexts/CitiesContext';

CountryList.propTypes = {
  cities: PropTypes.array,
  isLoading: PropTypes.bool,
};

function CountryList() {
  const { cities, isLoading } = useCities();

  if (isLoading) return <Spinner />;

  const countries = cities.reduce((arr, city) => {
    if (!arr.map((el) => el.country).includes(city.country))
      return [...arr, { country: city.country, emoji: city.emoji }];
    else return arr;
  }, []);

  if (!countries.length)
    return <Message message="There are no countries you have been to :(" />;

  return (
    <ul className={styles.countryList}>
      {countries.map((country, index) => (
        <CountryItem key={index} country={country} />
      ))}
    </ul>
  );
}

export default CountryList;
