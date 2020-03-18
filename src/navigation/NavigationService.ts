import { NavigationActions, NavigationContainerComponent } from 'react-navigation';

let _navigator: NavigationContainerComponent;

export const setTopLevelNavigator = (navigatorRef: NavigationContainerComponent) => {
  _navigator = navigatorRef;
};

export const navigate = (routeName: string, params: any) => {
  _navigator?.dispatch(
    NavigationActions.navigate({
      routeName,
      params
    })
  );
};
