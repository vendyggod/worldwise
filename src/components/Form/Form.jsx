// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useReducer } from 'react';
import Button from '../Button/Button';
import styles from './Form.module.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Message from '../Message/Message';
import Spinner from '../Spinner/Spinner';

const BASE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const initialState = {
  cityName: '',
  countryName: '',
  date: new Date(),
  notes: '',
  isLoadingGeo: false,
  emoji: '',
  error: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'loading':
      return { ...state, isLoadingGeo: true };
    case 'clearLoading':
      return { ...state, isLoadingGeo: false };
    case 'error':
      return { ...state, error: action.payload };
    case 'fetchData':
      return {
        ...state,
        cityName: action.payload.cityName,
        countryName: action.payload.countryName,
        emoji: convertToEmoji(action.payload.countryCode),
      };
    case 'startFetching':
      return { ...state, isLoadingGeo: true, error: '' };
    case 'changeCityName':
      return { ...state, cityName: action.payload };
    case 'changeDate':
      return { ...state, date: action.payload };
    case 'addNotes':
      return { ...state, notes: action.payload };
  }
}

function Form() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [state, dispatch] = useReducer(reducer, initialState);

  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  useEffect(() => {
    async function fetchCity() {
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

  if (state.isLoadingGeo) return <Spinner />;

  if (state.error) return <Message message={state.error} />;

  return (
    <form className={styles.form}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) =>
            dispatch({ type: 'changeCityName', payload: e.target.value })
          }
          value={state.cityName}
        />
        <span className={styles.flag}>{state.emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {state.cityName}?</label>
        <input
          id="date"
          onChange={(e) =>
            dispatch({ type: 'changeDate', payload: e.target.value })
          }
          value={state.date}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {state.cityName}</label>
        <textarea
          id="notes"
          onChange={(e) =>
            dispatch({ type: 'addNotes', payload: e.target.value })
          }
          value={state.notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <Button
          type="back"
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
        >
          &larr; Back
        </Button>
      </div>
    </form>
  );
}

export default Form;
