const { createSlice, configureStore } = require("@reduxjs/toolkit");

const initialState = {
  stringValue: "Initial string",
};

const stringSlice = createSlice({
  name: "stringState", // Optional slice name
  initialState,
  reducers: {
    setStringValue(state, action) {
      state.stringValue = action.payload;
    },
  },
});

const store = configureStore({
  reducer: {
    stringState: stringSlice.reducer,
  },
});

module.exports = {
  setStringValue: stringSlice.actions.setStringValue,
  store,
};
