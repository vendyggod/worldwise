const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  mapPosition: [47, 8],
  error: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'loading':
      return { ...state, isLoading: true };
    case 'cities/loaded':
      return { ...state, isLoading: false, cities: action.payload };
    case 'city/loaded':
      return { ...state, isLoading: false, currentCity: action.payload };
    case 'city/created':
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case 'city/deleted':
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case 'defaultMapPosition':
      return { ...state, mapPosition: [47, 8] };
    case 'changeMapPosition':
      return { ...state, mapPosition: action.payload };
    case 'rejected':
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error('CitiesProviderReducer: Unknown action.');
  }
}

export { initialState, reducer };
