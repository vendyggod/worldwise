import { createContext, useEffect, useContext, useReducer } from 'react';
import { initialState, reducer } from '../reducers/CitiesProviderReducer';
import PropTypes from 'prop-types';

const BASE_URL = 'http://localhost:9000';

const CitiesContext = createContext();

CitiesProvider.propTypes = {
  children: PropTypes.any,
};

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, mapPosition }, dispatch] =
    useReducer(reducer, initialState);

  useEffect(() => {
    async function fetchCities() {
      try {
        dispatch({ type: 'loading' });

        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: 'cities/loaded', payload: data });
      } catch (err) {
        console.log(err.message);
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    if (Number(id) === currentCity.id) return;

    try {
      dispatch({ type: 'loading' });

      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();

      dispatch({ type: 'city/loaded', payload: data });
    } catch (err) {
      console.log(err.message);
    }
  }

  async function createCity(newCity) {
    try {
      dispatch({ type: 'loading' });

      const res = await fetch(`${BASE_URL}/cities/`, {
        method: 'POST',
        body: JSON.stringify(newCity),
        headers: {
          'Content-Type': 'application/js',
        },
      });
      const data = await res.json();

      dispatch({ type: 'city/created', payload: data });
    } catch (err) {
      console.log(err.message);
    }
  }

  async function deleteCity(id) {
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: 'DELETE',
      });
      dispatch({
        type: 'city/deleted',
        payload: id,
      });
    } catch (err) {
      console.log(err.message);
    }
  }

  function defaultMapPosition() {
    dispatch({ type: 'defaultMapPosition' });
  }

  function changeMapPosition(coords) {
    dispatch({ type: 'changeMapPosition', payload: coords });
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        mapPosition,
        defaultMapPosition,
        changeMapPosition,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error('CitiesContext was used outside ContextProvider');
  return context;
}

export { CitiesProvider, useCities };
