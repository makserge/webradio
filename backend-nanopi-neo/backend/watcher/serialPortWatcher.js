export default (db, socket, serialController, mqttClient) => {
  serialController.startWatcher(db, socket, mqttClient);
};
