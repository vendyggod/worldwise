const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  mapPosition: [47, 8],
  error: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'city/loading':
      return { ...state, isLoading: true };
    case 'city/loaded':
      return { ...state, isLoading: false, cities: action.payload };
    case 'currentCity/loaded':
      return { ...state, currentCity: action.payload };
    case 'defaultMapPosition':
      return { ...state, mapPosition: [47, 8] };
    case 'changeMapPosition':
      return { ...state, mapPosition: action.payload };
    case 'rejected':
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error('CitiesPrividerReducer: Unknown action.');
  }
}

export { initialState, reducer };
