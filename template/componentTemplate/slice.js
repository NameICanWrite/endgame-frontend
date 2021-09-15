import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchData } from './API'

//** important:  ALWAYS REINITIALIZE ARRAY 

const initialState = {
//   foo: false,
//   fooData: []
  status: 'idle',
};

// export const fetchFoo = createAsyncThunk('foo/fetchFoo', async () => fetchData())

export const Slice = createSlice({
  name: '',
  initialState,
  reducers: {
    // togglefoo: (state) => {
    //   state.foo = !state.foo;
    // }
  },
  extraReducers: {
    // [fetchFoo.fulfilled]: (state, { payload }) => {
    //   state.fooData = payload
    //   state.status = 'success'
    // },
  }
});

// export const { togglefoo } = Slice.actions;

// export const selectFoo = (state) => state.header.foo;

export default Slice.reducer;