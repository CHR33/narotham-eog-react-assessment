import { createSlice, PayloadAction } from 'redux-starter-kit';

export type MetricData = {
  waterTemp: Measurement[],
  flareTemp: Measurement[],
  casingPressure: Measurement[],
  oilTemp: Measurement[],
  turbinePressure: Measurement[],
  injValveOpen: Measurement[],
};

export type Measurement = {
  metric: string;
  at: number,
  value: number,
  unit: string;
};

export type ApiErrorAction = {
  error: string;
};

const initialState: MetricData = {
  waterTemp: [],
  flareTemp: [],
  casingPressure: [],
  oilTemp: [],
  turbinePressure: [],
  injValveOpen: [],
};

const slice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    metricDataRecevied: (state, action: PayloadAction<Measurement[]>) => {
      state = {
        ...state,
      };

      console.log('payload', action);
    }
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
