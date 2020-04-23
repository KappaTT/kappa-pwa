export const SHOW_TOAST = 'SHOW_TOAST';
export const HIDE_TOAST = 'HIDE_TOAST';
export const DONE_HIDING_TOAST = 'DONE_HIDING_TOAST';

export interface TToast {
  toastTitle: string;
  toastMessage: string;
  toastAllowClose: boolean;
  toastTimer: number;
  toastIconFamily: string;
  toastIconName: string;
  toastCode: number;
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
  toastAllowClose: false,
  toastTimer: -1,
  toastIconFamily: '',
  toastIconName: '',
  toastCode: -1,
  toastChildren: null
};

export default (state = initialState, action: any): TUIState => {
  switch (action.type) {
    case SHOW_TOAST:
      return {
        ...state,
        isShowingToast: true,
        isHidingToast: false,
        ...action.toast
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
        toastAllowClose: false,
        toastTimer: -1,
        toastIconFamily: '',
        toastIconName: '',
        toastCode: -1,
        toastChildren: null
      };
    default:
      return state;
  }
};
