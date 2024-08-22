import convertToEmoji from '../helpers/convertToEmoji';

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
    default:
      throw new Error('FormReducer: Unknown action.');
  }
}

export { initialState, reducer };
