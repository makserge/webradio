import WebRadio from './containers/WebRadio';
import FmRadio from './containers/FmRadio';
import AudioPlayer from './containers/AudioPlayer';
import Bluetooth from './containers/Bluetooth';
import AirPlay from './containers/AirPlay';
import LineIn from './containers/LineIn';
import Settings from './containers/Settings';

export default {
    WebRadio: {
        icon: 'router',
        title: 'WebRadio',
        page: WebRadio
    },
    FmRadio: {
        icon: 'radio',
        title: 'FM Radio',
        page: FmRadio
    },
    AudioPlayer: {
        icon: 'audiotrack',
        title: 'Audio Player',
        page: AudioPlayer
    },
    Bluetooth: {
        icon: 'bluetooth',
        title: 'Bluetooth',
        page: Bluetooth
    },
    AirPlay: {
        icon: 'airplay',
        title: 'AirPlay',
        page: AirPlay
    },
    LineIn: {
        icon: 'input',
        title: 'Line In',
        page: LineIn
    },
    Settings: {
        icon: 'settings',
        title: 'Settings',
        page: Settings
    }
};
