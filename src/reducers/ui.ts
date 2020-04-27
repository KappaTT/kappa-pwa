export const SHOW_TOAST = 'SHOW_TOAST';
export const HIDE_TOAST = 'HIDE_TOAST';
export const DONE_HIDING_TOAST = 'DONE_HIDING_TOAST';

export interface TToast {
  toastTitle: string;
  toastMessage: string;
  toastAllowClose: boolean;
  toastTimer: number;
  toastCode: number;
  toastTitleColor: string;
  toastChildren: React.ReactNode;
}

export interface TUIState extends TToast {
  isShowingToast: boolean;
  isHidingToast: boolean;
}

const initialState: TUIState = {
  isShowingToast: false,
  isHidingToast: false,
  toastTitle: '',
  toastMessage: '',
  toastAllowClose: true,
  toastTimer: -1,
  toastCode: -1,
  toastTitleColor: 'black',
  toastChildren: null
};

export default (state = initialState, action: any): TUIState => {
  switch (action.type) {
    case SHOW_TOAST:
      if (state.toastAllowClose === false && state.toastTitle !== '') {
        return {
          ...state
        };
      }

      return {
        ...state,
        isShowingToast: true,
        isHidingToast: false,
        toastTitle: action.toast.toastTitle || '',
        toastMessage: action.toast.toastMessage || '',
        toastAllowClose: action.toast.toastAllowClose !== false,
        toastTimer: action.toast.toastTimer !== undefined ? action.toast.toastTimer : -1,
        toastCode: action.toast.toastCode !== undefined ? action.toast.toastCode : -1,
        toastTitleColor: action.toast.toastTitleColor || 'black',
        toastChildren: action.toast.toastChildren !== null ? action.toast.toastChildren : null
      };
    case HIDE_TOAST:
      return {
        ...state,
        isHidingToast: true
      };
    case DONE_HIDING_TOAST:
      return {
        ...state,
        isShowingToast: false,
        isHidingToast: false,
        toastTitle: '',
        toastMessage: '',
        toastAllowClose: true,
        toastTimer: -1,
        toastCode: -1,
        toastTitleColor: 'black',
        toastChildren: null
      };
    default:
      return state;
  }
};
