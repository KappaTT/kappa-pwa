export interface TKappaState {
  events: [];
  directory: [];
}

const initialState: TKappaState = {
  events: [],
  directory: []
};

export default (state = initialState, action: any): TKappaState => {
  switch (action.type) {
    default:
      return state;
  }
};
