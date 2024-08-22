// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useReducer } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { initialState, reducer } from '../../reducers/FormReducer';
import { useCities } from '../../contexts/CitiesProvider';
import Button from '../Button/Button';
import styles from './Form.module.css';
import Message from '../Message/Message';
import Spinner from '../Spinner/Spinner';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const BASE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

function Form() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [
    { cityName, countryName, date, notes, isLoadingGeo, emoji, error },
    dispatch,
  ] = useReducer(reducer, initialState);
  const { defaultMapPosition, createCity, isLoading } = useCities();

  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  useEffect(() => {
    async function fetchCity() {
      if (!lat || !lng) return;
      try {
        dispatch({ type: 'startFetching' });

        const res = await fetch(
          `${BASE_URL}/?latitude=${lat}&longitude=${lng}`
        );
        const data = await res.json();

        if (!data.countryCode)
          throw new Error(
            `This doesn's seem to be a city. Please, click somewhere else.`
          );

        dispatch({
          type: 'fetchData',
          payload: {
            cityName: data.city || data.locality || '',
            countryName: data.countryName,
            countryCode: data.countryCode,
          },
        });
      } catch (err) {
        dispatch({ type: 'error', payload: err.message });
      } finally {
        dispatch({ type: 'clearLoading' });
      }
    }

    fetchCity();
  }, [lat, lng]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!cityName || !date) return;

    const newCity = {
      cityName,
      countryName,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };

    await createCity(newCity);
    navigate('/app/cities');
  }

  if (isLoadingGeo) return <Spinner />;

  if (!lng || !lat)
    return <Message message="Start by clicking somewhere on the map." />;

  if (error) return <Message message={error} />;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ''}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) =>
            dispatch({ type: 'changeCityName', payload: e.target.value })
          }
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          onChange={(date) => dispatch({ type: 'changeDate', payload: date })}
          selected={date}
          dateFormat={'dd/MM/yyyy'}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) =>
            dispatch({ type: 'addNotes', payload: e.target.value })
          }
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <Button
          type="back"
          onClick={(e) => {
            e.preventDefault();
            navigate('/app');
            defaultMapPosition();
          }}
        >
          &larr; Back
        </Button>
      </div>
    </form>
  );
}

export default Form;
