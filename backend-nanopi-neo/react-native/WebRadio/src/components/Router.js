import { DrawerNavigator } from 'react-navigation';
import Routes from '../Routes';
import uiTheme from '../../MaterialUiTheme';

const RouterComponent = DrawerNavigator(Routes, {
  initialRouteName: 'WebRadio',
  contentOptions: {
    activeTintColor: uiTheme.palette.accentColor,
  },
});
export default RouterComponent;
