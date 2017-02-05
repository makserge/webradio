#include "SPI.h"
#include "RF24.h"

#define IN1_PIN 3
#define IN2_PIN 4
#define IN3_PIN 5
#define IN4_PIN 6
#define IN5_PIN 7
#define IN6_PIN 8

#define POWER_PIN 2

#define VOLUME_PIN A3

#define BA_1_CTLA_PIN A5
#define BA_1_CTLB_PIN A4
#define BA_2_CTLA_PIN A1
#define BA_2_CTLB_PIN A0

#define RFM_CE_PIN 9
#define RFM_CSN_PIN 10

RF24 radio(RFM_CE_PIN, RFM_CSN_PIN);

int sendBuffer[6];
int powerStatus = 0;
int lastPowerStatus = powerStatus;
int audioInput = 1;
int lastAudioInput = 0;
int volumeLevel = 0;
int lastVolumeLevel = volumeLevel;

const double VOLUME_DIVIDER = 6.5;

const int POWER_ON = 1;
const int POWER_OFF = 2;

const int AUDIO_IN1 = 1;
const int AUDIO_IN2 = 2;
const int AUDIO_IN3 = 3;
const int AUDIO_IN4 = 4;
const int AUDIO_IN5 = 5;
const int AUDIO_IN6 = 6;

void setupInputs() {
  pinMode(IN1_PIN, INPUT);
  pinMode(IN2_PIN, INPUT);
  pinMode(IN3_PIN, INPUT);
  pinMode(IN4_PIN, INPUT);
  pinMode(IN5_PIN, INPUT);
  pinMode(IN6_PIN, INPUT);
  pinMode(POWER_PIN, INPUT);
  pinMode(VOLUME_PIN, INPUT);
}

void setupAudioSwitch() {
  pinMode(BA_1_CTLA_PIN, OUTPUT);
  pinMode(BA_1_CTLB_PIN, OUTPUT);
  pinMode(BA_2_CTLA_PIN, OUTPUT);
  pinMode(BA_2_CTLB_PIN, OUTPUT);
  digitalWrite(BA_1_CTLA_PIN, HIGH);
  digitalWrite(BA_1_CTLB_PIN, HIGH);
  digitalWrite(BA_2_CTLA_PIN, HIGH);
  digitalWrite(BA_2_CTLB_PIN, HIGH);
}

void setupRfm() {
  radio.begin();
  radio.setRetries(10,15);
  radio.openWritingPipe(0xF0F0F0F0E2LL);
  radio.stopListening();
  radio.powerUp();
}

void setup() {
  setupInputs();
  setupAudioSwitch();
  setupRfm();
}

void checkInputs() {
  powerStatus = readPowerStatus();
  audioInput = readAudioInput(); 
  volumeLevel = readVolumeLevel();
  if (powerStatus != lastPowerStatus || (audioInput !=0 && (audioInput != lastAudioInput)) || volumeLevel != lastVolumeLevel) {
    sendData();
    lastPowerStatus = powerStatus;
    lastAudioInput = audioInput;
    lastVolumeLevel = volumeLevel;
  }
  if (audioInput != lastAudioInput) {
    setAudioOutput();
  }
}

int readPowerStatus() {
  return !digitalRead(POWER_PIN) ? POWER_OFF : POWER_ON;
}

int readAudioInput() {
  if (!digitalRead(IN1_PIN)) {
    return AUDIO_IN1;
  }
  else if (!digitalRead(IN2_PIN)) {
    return AUDIO_IN2;
  }
  else if (!digitalRead(IN3_PIN)) {
    return AUDIO_IN3;
  }
  else if (!digitalRead(IN4_PIN)) {
    return AUDIO_IN4;
  }
  else if (!digitalRead(IN5_PIN)) {
    return AUDIO_IN5;
  }
  else if (!digitalRead(IN6_PIN)) {
    return AUDIO_IN6;
  }
  return 0;
}

int readVolumeLevel() {
  unsigned int adcValue;
  unsigned int adcValue2;
  unsigned int adcValue3;
  double voltage;
  double vcc;

  adcValue = analogRead(VOLUME_PIN);
  adcValue2 = analogRead(VOLUME_PIN);
  adcValue3 = analogRead(VOLUME_PIN);

  if (adcValue == adcValue2 && adcValue2 == adcValue3) {
    vcc = readVcc() / 1000.0;
    voltage = (adcValue / 1024.0) * vcc;
    return voltage * VOLUME_DIVIDER;
  }
  else {
    return lastVolumeLevel;
  }
}

void sendData() {
  sendBuffer[0] = powerStatus;
  sendBuffer[1] = audioInput;
  sendBuffer[2] = volumeLevel;
  radio.write(&sendBuffer, 6);
}

void setAudioOutput() {
  digitalWrite(BA_1_CTLA_PIN, HIGH);
  digitalWrite(BA_1_CTLB_PIN, HIGH);
  digitalWrite(BA_2_CTLA_PIN, HIGH);
  digitalWrite(BA_2_CTLB_PIN, HIGH);

  switch(audioInput) {
    case AUDIO_IN1:
      digitalWrite(BA_1_CTLA_PIN, LOW);
      break;
    case AUDIO_IN2:
      digitalWrite(BA_1_CTLB_PIN, LOW);
      break;
    case AUDIO_IN3:
      digitalWrite(BA_1_CTLA_PIN, LOW);  
      digitalWrite(BA_1_CTLB_PIN, LOW);  
      break;
    case AUDIO_IN4:
      digitalWrite(BA_2_CTLA_PIN, LOW);
      break;
    case AUDIO_IN5:
      digitalWrite(BA_2_CTLB_PIN, LOW);
      break;
    case AUDIO_IN6:
      digitalWrite(BA_2_CTLA_PIN, LOW);  
      digitalWrite(BA_2_CTLB_PIN, LOW);  
      break;         
  }
}

long readVcc() {
  long result;
  ADMUX = _BV(REFS0) | _BV(MUX3) | _BV(MUX2) | _BV(MUX1);
  delay(2);
  ADCSRA |= _BV(ADSC);
  while (bit_is_set(ADCSRA,ADSC));
  result = ADCL;
  result |= ADCH<<8;
  result = 1125300L / result;
  return result;
}

void loop() {
  checkInputs();
}
