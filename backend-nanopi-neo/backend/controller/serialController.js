const serialController = {
	async sendPower(enabled) {
		console.log('sendPower', enabled);
	},

	async sendVolume(volume) {
		console.log('sendVolume', volume);
	},

	async sendMode(mode) {
		console.log('sendMode', mode);
	},

	async sendVolumeMute(mute) {
		console.log('sendVolumeNute', mute);
	},

	async sendWebRadioItem(item) {
		console.log('sendWebRadioItem', item);
	},

	async sendFmRadioItem(item) {
		console.log('sendFmRadioItem', item);
	},

	async sendAudioPlayerItem(item) {
		console.log('sendAudioPlayerItem', item);
	},

	async sendAudioPlayerElapsedTime(time) {
		console.log('sendAudioPlayerElapsedTime', time);
	},

	async sendSleepTimerTime(time) {
		console.log('sendSleepTimerTime', time);
	},

	async sendSleepTimer(remaining) {
		console.log('sendSleepTimer', remaining);
	}
};

export default serialController;
