import { AppRegistry } from 'react-native';

import i18nInit from './src/i18n';
import App from './src/App';

i18nInit();

AppRegistry.registerComponent('WebRadio', () => App);
