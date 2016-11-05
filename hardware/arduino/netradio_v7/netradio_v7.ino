#include <Wire.h>
#include <IRremote.h>
#include <SimpleTimer.h>
#include <RTClib.h>
#include <SPI.h>
#include <OneWire.h>
#include <RF24.h>

#define IR_PIN 2
#define IR_SEND_PIN 3
#define PT_STB_PIN 4
#define DS_PIN 6

const int RDA5807_ADDRESS_SEQ = 0x10;
const int RDA5807_ADDRESS_RANDOM = 0x11;

#define RFM_CE_PIN 9
#define RFM_CSN_PIN 10

#define BA7611_CTLA_PIN 8
#define BA7611_CTLB_PIN 7

#define VFD_SEG_0 0
#define VFD_SEG_1 3
#define VFD_SEG_2 6
#define VFD_SEG_3 9
#define VFD_SEG_4 12
#define VFD_SEG_5 15
#define VFD_SEG_6 18
#define VFD_SEG_7 24
#define VFD_SEG_8 28
#define VFD_SEG_9 27
#define VFD_SEG_10 31
#define VFD_SEG_11 30
#define VFD_SEG_SYMBOL_1 21
#define VFD_SEG_SYMBOL_2 22

#define VFD_SLEEP_SEG 3
#define VFD_ALARM_SEG 4
#define VFD_FM_SEG 0
#define VFD_PAUSE_SEG 4
#define VFD_PLAY_SEG 5
#define VFD_PLAYER_SEG 6

#define AUDIO_SOURCE_NET      0
#define AUDIO_SOURCE_FM       1
#define AUDIO_SOURCE_LINEIN   2

const byte BUTTON_POWER = 10;
const byte BUTTON_DISPLAY = 64;
const byte BUTTON_MODE = 32;
const byte BUTTON_PREV = 4;
const byte BUTTON_STOP = 128;
const byte BUTTON_PLAY = 16;
const byte BUTTON_NEXT = 8;
const byte BUTTON_VOLUME_DOWN = 2;
const byte BUTTON_VOLUME_UP = 1;

const unsigned long IR_MUTE = 0xFF6897;
const unsigned long IR_MODE = 0xFF629D;
const unsigned long IR_DISPLAY = 0xFF906F;
const unsigned long IR_VOL_UP = 0xFFA857;
const unsigned long IR_VOL_DOWN = 0xFFE01F;
const unsigned long IR_PRESET_UP = 0xFFE21D;
const unsigned long IR_PRESET_DOWN = 0xFF22DD;
const unsigned long IR_OK = 0xFFC23D;
const unsigned long IR_LEFT = 0xFFA25D;
const unsigned long IR_RIGHT = 0xFFE21D;
const unsigned long IR_SLEEP = 0xFF4AB5;
const unsigned long IR_POWER = 0xFF52AD;

const unsigned long IR_SEND_POWER = 0xA81;
const unsigned long IR_SEND_VOL_DOWN = 0xC81;
const unsigned long IR_SEND_VOL_UP = 0x481;

const byte MODE_FM = 1;
const byte MODE_NET = 2;
const byte MODE_MP3 = 3;
const byte MODE_LINEIN = 4;
const byte MODE_APLAY = 5;

const byte DISP_MODE_CLOCK = 1;
const byte DISP_MODE_FUNC = 2;
const byte DISP_MODE_ALARM1 = 3;
const byte DISP_MODE_ALARM2 = 4;
const byte DISP_MODE_SLEEP = 5;

const byte SERIAL_MUTE = 1;
const byte SERIAL_MODE = 2;
const byte SERIAL_VOLUME = 3;
const byte SERIAL_PREESET= 4;
const byte SERIAL_SLEEP = 5;
const byte SERIAL_DATE = 6;
const byte SERIAL_ALARM1 = 7;
const byte SERIAL_ALARM2 = 8;
const byte SERIAL_NET_COUNT = 9;
const byte SERIAL_FM_COUNT = 10;
const byte SERIAL_FM_FREQ = 11;
const byte SERIAL_MP3_COUNT = 12;
const byte SERIAL_LOAD_COMPLETE = 13;
const byte SERIAL_POWER = 14;

const byte SERIAL_BUFFER_LENGTH = 40;
char inSerialChar;
char serialBuffer[SERIAL_BUFFER_LENGTH];
byte serialBufferPos;
char *serialToken;
char serialDelim[2];
char *serialLast;

const byte DEFAULT_VOLUME = 15;
const byte MAX_VOLUME = 32;
const byte VOLUME_STEP = 4;
const byte MAX_VOLUME_STEP = 128;

boolean volumeMute = false;
byte currentVolume = DEFAULT_VOLUME;
byte lastVolume = DEFAULT_VOLUME;
byte IR_VOLUME_COMMAND_DELAY = 80;
byte IR_VOLUME_COMMAND_DELAY2 = 80;

byte IR_DELAY = 500;
byte KEY_DELAY = 300;

unsigned int currentFrequency = 875;

const int MAX_MP3_TRACKS = 9999;
const byte MAX_NET_PRESETS = 9999;
const byte MAX_FM_PRESETS = 30;

unsigned int rdaReg[32];

const int VOLUME_TIMEOUT = 2000;
const int TIME_INTERVAL = 1000;
const int KEYS_INTERVAL = 300;

unsigned int volumeTimerId = 0;
unsigned int timeTimerId = 0;

unsigned long vfdDigitMap[10] = { 0x7046, 0x2040, 0x6186, 0x61C2, 0x31C0, 0x51C2, 0x51C6, 0x6040, 0x71C6, 0x71C2 };
unsigned long vfdDigitMap2[10] = { 0x77, 0x22, 0x5B, 0x6B, 0x2E, 0x6D, 0x7D, 0x23, 0x7F, 0x6F };

unsigned long vfdAlphaMap[26] = {
                          0x71C4, 0x64D2, 0x5006, 0x6452, 0x5186, 0x5184, 0x50C6, 0x31C4, 0x4412, 
                          0x2046, 0x1324, 0x1006, 0x3A44, 0x3864, 0x7046, 0x7184, 0x7066, 0x71A4, 
                          0x51C2, 0x4410, 0x3046, 0x120C, 0x306C, 0xA28, 0xA10, 0x420A
};

unsigned long VFD_MINUS = 0x180;

int vfdSymbolRegister = 0x0;
int vfdSymbolRegister2 = 0x0;

byte dispMode = DISP_MODE_FUNC;
byte mode = MODE_NET;
byte lastDispMode = DISP_MODE_FUNC;

byte currentFmPreset = 1;
int currentNetPreset = 1;
int currentMp3Track = 1;

int mp3TracksLen = 1;
int netPresetsLen = 1;
byte fmPresetsLen = 1;

boolean alarmOn1 = false;
byte alarmParams1[6] = {1, 1, 8, 60, 9, 0};  //[mode, preset, vol, timeout, hour, minute]

boolean alarmOn2 = false;
byte alarmParams2[6] = {2, 1, 8, 30, 10, 0};  //[mode, preset, vol, timeout, hour, minute]

const byte SLEEP_TIMER_STEP = 10;
const byte MIN_SLEEP_TIMER = 10;
const byte MAX_SLEEP_TIMER = 90;
const byte SLEEP_TIMER_DEFAULT = 60;

byte sleepTimerTime = SLEEP_TIMER_DEFAULT;
boolean sleepTimerOn = false;
byte currentSleepTimerTime = 0;

boolean isSkipSerialCommand = false;

boolean powerStatus = false;

unsigned long lastIrValue = 0;

int rfmBuffer[3];
int rfmTemp = -99;
int rfmBatteryVoltage;
byte tempThrot = 0;

const byte TEMP_THROTTLING = 60; //one measure in minute

const byte LOW_SENSOR_BATTERY_VOLTAGE = 36;

RF24 rfm(RFM_CE_PIN, RFM_CSN_PIN);

RTC_Millis rtc;

IRrecv irRecv(IR_PIN);
decode_results irDecodeResults;
IRsend irSend;

SPISettings vfdSettings(100000, LSBFIRST, SPI_MODE3);

SimpleTimer timer;
OneWire ds(DS_PIN);

void rdaReset() {
  unsigned int rdaDefReg[7] = {
    0x0758,
    0x0000,
    0xD009,
    0x0000,
    0x1400,
    0x84DF,
    0x4000
  };
  for (int i = 0; i < 7; i++) {
    rdaReg[i] = rdaDefReg[i];
  }
  rdaReg[2] = rdaReg[2] | 0x0002;
  rdaWrite();
  rdaReg[2] = rdaReg[2] & 0xFFFB;
}

void rdaWrite() {
  Wire.beginTransmission(RDA5807_ADDRESS_SEQ);
  for (int i = 2; i < 7; i++) {
    Wire.write(rdaReg[i] >> 8);
    Wire.write(rdaReg[i] & 0xFF);
  }
  Wire.endTransmission();
  delay(10);
}

void setupAudioSelector() {
  pinMode(BA7611_CTLA_PIN, OUTPUT);
  pinMode(BA7611_CTLB_PIN, OUTPUT);
  digitalWrite(BA7611_CTLA_PIN, HIGH);  
  digitalWrite(BA7611_CTLB_PIN, HIGH); 
}

void setupRadio() {
  Wire.begin();
  digitalWrite (A4, LOW);
  digitalWrite (A5, LOW);
  rdaReset();
}

void setupSerialCommand() {
  strncpy(serialDelim, "~", 2);
  clearSerialBuffer();
}

void clearSerialBuffer() {
  for (int i = 0; i < SERIAL_BUFFER_LENGTH; i++) {
    serialBuffer[i] = '\0';
  }
  serialBufferPos = 0;
  delay(5);
}

void setupIr() {
  irRecv.enableIRIn();
}

void setupVfd() {
  pinMode(PT_STB_PIN, OUTPUT);

  ptWriteCommand(0x0D);
  ptWriteCommand(0x88 | 0b100);// 1/16 Dim
  clearVfd();
}

void ptWriteCommand(unsigned char command) {
  SPI.beginTransaction(vfdSettings);
  digitalWrite(PT_STB_PIN, LOW);
  SPI.transfer(command);
  digitalWrite (PT_STB_PIN, HIGH);
  SPI.endTransaction();
}

void clearVfd() {
  unsigned char i;
  for (i = 0; i < 32; i++) {
    ptWriteData(i, 0x0000);
  }
}

void ptWriteData(unsigned char address, unsigned long data) {
  ptWriteCommand(0x40);      //data setting cmd
  SPI.beginTransaction(vfdSettings);
  digitalWrite(PT_STB_PIN, LOW);
  SPI.transfer(0xC0 + address);
  SPI.transfer((unsigned char)(data & 0x00FF));
  SPI.transfer((unsigned char)((data>>8) & 0x00FF));
  SPI.transfer((unsigned char)((data>>16) & 0x00FF));
  digitalWrite(PT_STB_PIN, HIGH);
  SPI.endTransaction();
}

void setupTimers() {
  timeTimerId = timer.setInterval(TIME_INTERVAL, showTime);
  timer.setInterval(KEYS_INTERVAL, readKeys);
}

void showTime() {
  DateTime now = rtc.now();
  byte hour = now.hour();
  byte minute = now.minute();
  clearVfdSegment(VFD_SEG_7);
  writeDigitToVfd(VFD_SEG_9, hour % 10, (now.second() % 10) % 2);
  if (hour > 10) {
    writeDigitToVfd(VFD_SEG_8, hour / 10, false);
  }  
  writeDigitToVfd(VFD_SEG_11, minute % 10, false);
  writeDigitToVfd(VFD_SEG_10, minute / 10, false);

  showTemp();
}

void showTemp() {
  if (tempThrot > TEMP_THROTTLING) {
    tempThrot = 0;
  }
  tempThrot++;
  if (tempThrot != 1) {
    return;
  }
  byte data[2];
  ds.reset(); 
  ds.write(0xCC);
  ds.write(0x44);
  delay(750);
  ds.reset();
  ds.write(0xCC);
  ds.write(0xBE);
  data[0] = ds.read(); 
  data[1] = ds.read();
  int intTemp = (data[1] << 8) + data[0];
  intTemp = intTemp >> 4;

  byte digit = (intTemp / 10) % 10;
  if (digit  > 0) {
    writeDigitToVfd(VFD_SEG_0, digit, false);
  }
  else {
    clearVfdSegment(VFD_SEG_0);
  }
  writeDigitToVfd(VFD_SEG_1, intTemp % 10, false);
  writeCharToVfd(VFD_SEG_2, 'C');

  if (rfmTemp > -99) {
    if (rfmBatteryVoltage < LOW_SENSOR_BATTERY_VOLTAGE) {
      clearVfdSegment(VFD_SEG_3);
      clearVfdSegment(VFD_SEG_4);
      writeCharToVfd(VFD_SEG_5,'L');
      writeCharToVfd(VFD_SEG_6,'B'); 
    }
    else {
      int extTemp = rfmTemp;
      if (extTemp < -10) {
        writeMinusToVfd(VFD_SEG_3);
        extTemp = -extTemp;
      }
      else {
        clearVfdSegment(VFD_SEG_3);
      }
      if (extTemp  < 0) {
        writeMinusToVfd(VFD_SEG_4);
        extTemp = -extTemp;
      }
      else {
        digit = (extTemp / 10) % 10;
        if (digit  > 0) {
          writeDigitToVfd(VFD_SEG_4, digit, false);
        }
        else {
          clearVfdSegment(VFD_SEG_4);
        }
      }
      writeDigitToVfd(VFD_SEG_5, extTemp % 10, true);
      writeCharToVfd(VFD_SEG_6, 'C');
    }
  }    
  else {
    clearVfdSegment(VFD_SEG_3);
    writeCharToVfd(VFD_SEG_4,'S');
    writeCharToVfd(VFD_SEG_5,'Y');
    writeCharToVfd(VFD_SEG_6,'N');
  }
}

void clearVfdSegment(byte segment) {
  ptWriteData(segment, 0x0000);
}

void writeMinusToVfd(byte address) {
  ptWriteData(address, VFD_MINUS);
}

void writeCharToVfd(byte address, byte value) {
  ptWriteData(address, vfdAlphaMap[value - 65]);
}

void writeDigitToVfd(byte address, byte value, boolean decimal) {
  unsigned long data;
  if (address == VFD_SEG_7 || address == VFD_SEG_8 || address == VFD_SEG_9 || address == VFD_SEG_10 || address == VFD_SEG_11) {
    data = vfdDigitMap2[value];
    if (decimal) {
      bitSet(data, 7);
    }
    else {
      bitClear(data, 7);
    }
  }
  else {
    data = vfdDigitMap[value];
    if (decimal) {
      bitSet(data, 16);
    }
    else {
      bitClear(data, 16);
    }
  }
  ptWriteData(address, data);
}

void disableTimers() {
  timer.disable(timeTimerId);
}

void setDisplayMode() {
  disableTimers();
  clearVfd();

  switch (dispMode) {
    case DISP_MODE_CLOCK:
      showTime();
      timer.enable(timeTimerId);
      showSymbolsState();
      break;
    case DISP_MODE_FUNC:
      showModeValue();
      showSymbolsState();
      break;
    case DISP_MODE_ALARM1:
      showAlarm1();
      break;
    case DISP_MODE_ALARM2:
      showAlarm2();
      break;
    case DISP_MODE_SLEEP:
      showSleepTimer();
      break;
  }
}

void showSymbolsState() {
  if (alarmOn1 || alarmOn2) {
    showVfdSymbol(VFD_ALARM_SEG, true);
  }
  else {
    showVfdSymbol(VFD_ALARM_SEG, false);
  }
  if (sleepTimerOn) {
    showVfdSymbol(VFD_SLEEP_SEG, true);
  }
  else {
    showVfdSymbol(VFD_SLEEP_SEG, false);
  }
}

void showModeValue() {
  byte digit;

  clearVfd();
  showVfdSymbol2(VFD_FM_SEG, false);
  showVfdSymbol(VFD_PLAYER_SEG, false);
     
  switch (mode) {
    case MODE_FM:
      writeCharToVfd(VFD_SEG_0, 'F');
      writeCharToVfd(VFD_SEG_1, 'M');
      digit = (currentFrequency / 1000) % 10;
      if (digit  > 0) {
        writeDigitToVfd(VFD_SEG_2, digit, false);
      }
      writeDigitToVfd(VFD_SEG_3, (currentFrequency / 100) % 10, false);
      writeDigitToVfd(VFD_SEG_4, (currentFrequency / 10) % 10, false);
      writeDigitToVfd(VFD_SEG_5, currentFrequency % 10, true);
      writeDigitToVfd(VFD_SEG_6, 0, false);

      setFmPreset(currentFmPreset);
      showVfdSymbol2(VFD_FM_SEG, true);
      break;
    case MODE_NET:
      digit = (currentNetPreset / 100) % 10;
      if (digit  > 0 || currentNetPreset > 99) {
        writeDigitToVfd(VFD_SEG_4, digit, false);
      }
      digit = (currentNetPreset / 10) % 10;
      if (digit  > 0 || currentNetPreset > 99) {
        writeDigitToVfd(VFD_SEG_5, digit, false);
      }
      writeDigitToVfd(VFD_SEG_6, currentNetPreset % 10, false);
      clearVfdSegment(VFD_SEG_3);
      writeCharToVfd(VFD_SEG_2, 'T');      
      writeCharToVfd(VFD_SEG_1, 'E');
      writeCharToVfd(VFD_SEG_0, 'N');
      break;
    case MODE_MP3:
      digit = (currentMp3Track / 1000) % 10;
      if (digit  > 0 || currentMp3Track > 999) {
        writeDigitToVfd(VFD_SEG_3, digit, false);
      }
      digit = (currentMp3Track / 100) % 10;
      if (digit  > 0 || currentMp3Track > 99) {
        writeDigitToVfd(VFD_SEG_4, digit, false);
      }
      digit = (currentMp3Track / 10) % 10;
      if (digit  > 0 || currentMp3Track > 99) {
        writeDigitToVfd(VFD_SEG_5, digit, false);
      }
      writeDigitToVfd(VFD_SEG_6, currentMp3Track % 10, false);
      clearVfdSegment(VFD_SEG_2);
      writeCharToVfd(VFD_SEG_1, 'R');
      writeCharToVfd(VFD_SEG_0, 'T');

      setTrackTime(0);
      showVfdSymbol(VFD_PLAYER_SEG, true);
      break;
    case MODE_LINEIN:
      writeCharToVfd(VFD_SEG_6, 'N');
      writeCharToVfd(VFD_SEG_5, 'I');
      clearVfdSegment(VFD_SEG_4);
      writeCharToVfd(VFD_SEG_3, 'E');
      writeCharToVfd(VFD_SEG_2, 'N');
      writeCharToVfd(VFD_SEG_1, 'I');
      writeCharToVfd(VFD_SEG_0, 'L');

      showTime();
      timer.enable(timeTimerId);
      break;
    case MODE_APLAY:
      writeCharToVfd(VFD_SEG_6, 'Y');
      writeCharToVfd(VFD_SEG_5, 'A');
      writeCharToVfd(VFD_SEG_4, 'L');
      writeCharToVfd(VFD_SEG_3, 'P');
      writeCharToVfd(VFD_SEG_2, 'R');
      writeCharToVfd(VFD_SEG_1, 'I');
      writeCharToVfd(VFD_SEG_0, 'A');

      showTime();
      timer.enable(timeTimerId);
      break;
  }  
}

void setTrackTime(int time) {
  clearVfdSegment(VFD_SEG_7);
  writeDigitToVfd(VFD_SEG_9, (time / 1000) % 10, true);
  writeDigitToVfd(VFD_SEG_8, (time / 100) % 10, false);
  writeDigitToVfd(VFD_SEG_11, (time / 10) % 10, false);
  writeDigitToVfd(VFD_SEG_10, time % 10, true);
}

void setFmPreset(int preset) {
  clearVfdSegment(VFD_SEG_7);
  clearVfdSegment(VFD_SEG_8);
  clearVfdSegment(VFD_SEG_9);
  byte digit = (preset / 10) % 10;
  if (digit > 0) {
    writeDigitToVfd(VFD_SEG_10, digit, false);
  }
  else {
    clearVfdSegment(VFD_SEG_10);
  }  
  writeDigitToVfd(VFD_SEG_11, preset % 10, false);
  rdaSetFrequency(currentFrequency);
}

void showAlarm1() {
  if (alarmOn1) {
    showVfdSymbol(VFD_ALARM_SEG, true);
  }
  else {
    showVfdSymbol(VFD_ALARM_SEG, false);
  }
  writeDigitToVfd(VFD_SEG_6, 1, false);
  clearVfdSegment(VFD_SEG_5);
  writeCharToVfd(VFD_SEG_4, 'M');
  writeCharToVfd(VFD_SEG_3, 'R');
  writeCharToVfd(VFD_SEG_2, 'A');
  writeCharToVfd(VFD_SEG_1, 'L');
  writeCharToVfd(VFD_SEG_0, 'A');

  showAlarmData(alarmParams1);
}

void showAlarm2() {
  if (alarmOn2) {
    showVfdSymbol(VFD_ALARM_SEG, true);
  }
  else {
    showVfdSymbol(VFD_ALARM_SEG, false);
  }
  writeDigitToVfd(VFD_SEG_6, 2, false);
  clearVfdSegment(VFD_SEG_5);
  writeCharToVfd(VFD_SEG_4, 'M');
  writeCharToVfd(VFD_SEG_3, 'R');
  writeCharToVfd(VFD_SEG_2, 'A');
  writeCharToVfd(VFD_SEG_1, 'L');
  writeCharToVfd(VFD_SEG_0, 'A');

  showAlarmData(alarmParams2);
}

void showAlarmData(byte alarmParams[6]) {
  clearVfdSegment(VFD_SEG_7);
  writeDigitToVfd(VFD_SEG_9, alarmParams[4] % 10, true);
  writeDigitToVfd(VFD_SEG_8, alarmParams[4] / 10, false);
  writeDigitToVfd(VFD_SEG_11, alarmParams[5] % 10, false);
  writeDigitToVfd(VFD_SEG_10, alarmParams[5] / 10, false);  
}

void showSleepTimer() {
  clearVfd();

  if (sleepTimerOn) {
    showVfdSymbol(VFD_SLEEP_SEG, true);
  }
  else {
    showVfdSymbol(VFD_SLEEP_SEG, false);
  }

  writeCharToVfd(VFD_SEG_6, 'P');
  writeCharToVfd(VFD_SEG_5, 'E');
  writeCharToVfd(VFD_SEG_4, 'E');
  writeCharToVfd(VFD_SEG_3, 'L');
  writeCharToVfd(VFD_SEG_2, 'S');
  clearVfdSegment(VFD_SEG_1);
  clearVfdSegment(VFD_SEG_0);

  clearVfdSegment(VFD_SEG_7);
  clearVfdSegment(VFD_SEG_8);
  clearVfdSegment(VFD_SEG_9);
  writeDigitToVfd(VFD_SEG_11, sleepTimerTime % 10, false);
  writeDigitToVfd(VFD_SEG_10, sleepTimerTime / 10, false);
}

void showVfdSymbol2(byte regNum, boolean show) {
  if (show) {
    bitSet(vfdSymbolRegister2, regNum);
  }
  else {
    bitClear(vfdSymbolRegister2, regNum);
  }
  ptWriteData(VFD_SEG_SYMBOL_2, vfdSymbolRegister2);
}

void showVfdSymbol(byte regNum, boolean show) {
  if (show) {
    bitSet(vfdSymbolRegister, regNum);
  }
  else {
    bitClear(vfdSymbolRegister, regNum);
  }
  ptWriteData(VFD_SEG_SYMBOL_1, vfdSymbolRegister);
}

void clearVfdSymbols() {
  vfdSymbolRegister = 0x00;
  vfdSymbolRegister2 = 0x00;
}

void setAudioMode() {
  switch (mode) {
    case MODE_FM:
      rdaPowerOn();
      rdaSetFrequency(currentFrequency);
      sendFMPreset();
      setAudioSource(AUDIO_SOURCE_FM);
      break;
    case MODE_NET:
      rdaPowerOff();
      sendNetPreset();
      setAudioSource(AUDIO_SOURCE_NET);
      break;
    case MODE_MP3:
      rdaPowerOff();
      sendMp3Track();
      setAudioSource(AUDIO_SOURCE_NET);
      break;
    case MODE_LINEIN:
      rdaPowerOff();
      setAudioSource(AUDIO_SOURCE_LINEIN);
      break;
    case MODE_APLAY:
      setAudioSource(AUDIO_SOURCE_NET);
      break;
  }
}

void setAudioSource(byte value) {
  digitalWrite(BA7611_CTLA_PIN, HIGH);  
  digitalWrite(BA7611_CTLB_PIN, HIGH);  
  switch (value) {
    case AUDIO_SOURCE_FM:
      digitalWrite(BA7611_CTLA_PIN, LOW);
      break;
    case AUDIO_SOURCE_NET:
      digitalWrite(BA7611_CTLB_PIN, LOW);
      break;
    case AUDIO_SOURCE_LINEIN:
      digitalWrite(BA7611_CTLA_PIN, LOW);  
      digitalWrite(BA7611_CTLB_PIN, LOW);  
      break;
  } 
}

void sendFMPreset() {
  Serial.print("PRESET ");
  Serial.println(currentFmPreset);
}

void sendNetPreset() {
  Serial.print("NPRESET ");
  Serial.println(currentNetPreset);
}

void sendMp3Track() {
  Serial.print("TRACK ");
  Serial.println(currentMp3Track);
}

void sendMode() {
  Serial.print("MODE ");
  switch (mode) {
    case MODE_FM:
      Serial.println("fm");
      break;
    case MODE_NET:
      Serial.println("network");
      break;
    case MODE_MP3:
      Serial.println("mp3track");
      break;
    case MODE_LINEIN:
      Serial.println("linein");
      break;
    case MODE_APLAY:
      Serial.println("aplay");
      break;  
  }
}

void rdaPowerOn() {
  rdaReg[3] = rdaReg[3] | 0x010;   // Enable Tuning
  rdaReg[2] = rdaReg[2] | 0x001;   // Enable PowerOn
  rdaWrite();
  rdaReg[3] = rdaReg[3] & 0xFFEF;  // Disable Tuning
}

void rdaPowerOff() {
  rdaReg[2] = 0x0001;   // all bits off
  rdaWrite();
}

void rdaSetFrequency(int frequency) {
  int minFrequency = 870;
  //int minFrequency = 500;
  //int channelNumber = (frequency - minFrequency) / 0.025;
  int channelNumber = frequency - minFrequency;
  channelNumber = channelNumber & 0x03FF;
  rdaReg[3] = channelNumber * 64 + 0x10;// Channel + TUNE-Bit + Band=00(87-108) + Space=00(100kHz)
  //rdaReg[3] = channelNumber * 64 + 0x1F;
  Wire.beginTransmission(RDA5807_ADDRESS_SEQ);
  Wire.write(0xD009 >> 8);
  Wire.write(0xD009 & 0xFF);
  Wire.write(rdaReg[3] >> 8);
  Wire.write(rdaReg[3] & 0xFF);
  Wire.endTransmission();
}

void readSerial() {
  /*
    processMute: // 1~[0-1] // 1~0
    changeModeToSelected: // 2~[1-5] // 2~1
    processVol: // 3~[1-31] // 3~4
    processPreset: // 4~[1-999] // 4~1
    processSleepTimer: // 5~60~[0-1] // 5~60~0
    processDate: // 6~2016~10~9~0~33~0
    processAlarm1: // 7~1~2~12~60~0~30~1 - mode preset vol timeout hour minute on
    processAlarm2: // 8~1~2~12~60~0~30~1
    processNetCount: // 9~[1-99] // 9~10
    processFMCount: // 10~[1-30] // 10~2
    processFmFrequency: // 11~[875-1080] // 11~989
    processMp3Count: // 12~[1-999] // 12~989
    processLoadComplete: // 13~1
    processPower: 14~[0-1]
  */ 
  while (Serial.available() > 0) {
    byte serialCommand;
    inSerialChar = Serial.read();
    if (inSerialChar == '\n') {
    //Serial.print("Received: ");
    //Serial.println(serialBuffer);
      serialBufferPos = 0;
      serialToken = strtok_r(serialBuffer, serialDelim, &serialLast);
      if (serialToken == NULL) {
        return;
      }
      serialCommand = atoi(serialToken);
    
      switch (serialCommand) {
        case SERIAL_MUTE:
          processMute();
          break;
        case SERIAL_MODE:
          changeModeToSelected();
          break;
        case SERIAL_VOLUME:
          processVol();
          break;
        case SERIAL_PREESET:
          processPreset();
          break;
        case SERIAL_SLEEP:
          processSleepTimer();
          break;
        case SERIAL_DATE:
          processDate();
          break;
        case SERIAL_ALARM1:
          processAlarm1();
          break;
        case SERIAL_ALARM2:
          processAlarm2();
          break;
        case SERIAL_NET_COUNT:
          processNetCount();
          break;
        case SERIAL_FM_COUNT:
          processFMCount();
          break;
        case SERIAL_FM_FREQ:
          processFmFrequency();
          break;
        case SERIAL_MP3_COUNT:
          processMp3Count();
          break;
        case SERIAL_LOAD_COMPLETE:
          processLoadComplete();
          powerOn();
          break;
        case SERIAL_POWER:
          processPower();
          break;
      }
      clearSerialBuffer();
    }
    serialBuffer[serialBufferPos++] = inSerialChar;
    serialBuffer[serialBufferPos] = '\0';
  }
}

void processMute() {
  byte number;
  char *param;

  param = serialNextParam();
  if (param != NULL) {
    number = atol(param);
    volumeMute = (number == 1);

    setAudioVolume();
    showMute();
    sendMute();
  }
}

void showMute() {
  showVolume();
  if (volumeTimerId > 0) {
    timer.restartTimer(volumeTimerId);
  }
  else {
    volumeTimerId = timer.setTimeout(VOLUME_TIMEOUT, hideVolume);
  }
}

void showVolume() {
  backupVfdData();

  if (volumeMute) {
    displayMute();
  }  
  else {  
    displayVolume(volumeMute ? -2 : currentVolume);
  }
}

void displayMute() {
  clearVfdSegment(VFD_SEG_6);
  clearVfdSegment(VFD_SEG_5);
  writeCharToVfd(VFD_SEG_4, 'E');
  writeCharToVfd(VFD_SEG_3, 'T');
  writeCharToVfd(VFD_SEG_2, 'U');
  writeCharToVfd(VFD_SEG_1, 'M');
  clearVfdSegment(VFD_SEG_0);
}

void displayVolume(int value) {
  writeCharToVfd(VFD_SEG_0, 'V');
  writeCharToVfd(VFD_SEG_1, 'O');
  writeCharToVfd(VFD_SEG_2, 'L');
  clearVfdSegment(VFD_SEG_3);
  if (value == MAX_VOLUME) {
    writeCharToVfd(VFD_SEG_4, 'M');
    writeCharToVfd(VFD_SEG_5, 'A');
    writeCharToVfd(VFD_SEG_6, 'X');
  }
  else if (value == 0) {
    writeCharToVfd(VFD_SEG_4, 'M');
    writeCharToVfd(VFD_SEG_5, 'I');
    writeCharToVfd(VFD_SEG_6, 'N');
  }
  else {
    clearVfdSegment(VFD_SEG_4);
    if (value / 10 > 0) {
      writeDigitToVfd(VFD_SEG_5, value / 10, false);
    }
    else {
      clearVfdSegment(VFD_SEG_5);
    }
    writeDigitToVfd(VFD_SEG_6, value % 10, false);
  }
}

void hideVolume() {
  volumeTimerId = 0;
  clearVfd();

  restoreVfdData();
}

void backupVfdData() {
  disableTimers();
}

void restoreVfdData() {
  setDisplayMode();
}

void changeModeToSelected() {
  byte number;
  char *param;

  param = serialNextParam();
  if (param != NULL) {
    number = atol(param);
    if (number > 0 && number < 6) {
      mode = number;

      setAudioMode();
      showFuncMode();
    }
  }
}

void processVol() {
  byte number;
  char *param;

  param = serialNextParam();
  if (param != NULL) {
    number = atol(param);

    if (number > 0 && number <= MAX_VOLUME) {
      currentVolume = number;

      updateVolume();
    }
  }
}

void updateVolume() {
  showVolume();
  setAudioVolume();
  
  if (volumeTimerId > 0) {
    timer.restartTimer(volumeTimerId);
  }
  else {
    volumeTimerId = timer.setTimeout(VOLUME_TIMEOUT, hideVolume);
  }
}

void processMp3Count() {
  int number;
  char *param;

  param = serialNextParam();

  if (param != NULL) {
    number = atol(param);
    if (number > 0 && number <= MAX_MP3_TRACKS) {
      mp3TracksLen = number;
      currentMp3Track = 1;
 
      sendMp3Track();
    }
  }
}

void processLoadComplete() {
  int number;
  char *param;

  param = serialNextParam();

  if (param != NULL) {
    number = atol(param);
    if (number > 0) {
      setDisplayMode();
    }
  }
}

void processPower() {
  int number;
  char *param;

  param = serialNextParam();

  if (param != NULL) {
    number = atol(param);
    if (number == 1) {
      powerOn();
    }
    else {
      resetSleepTimer();
      initSleepTimer();

      powerOff();
    }
  }
}

void resetSleepTimer() {
  sleepTimerOn = false;

  Serial.print("SLEEP ");
  Serial.print(sleepTimerTime);
  Serial.println(" 0");
}

void powerOn() {
  Serial.println("POWER 1");

  powerOnCommon();
}

void powerOnCommon() {
  powerStatus = true;

  volumeMute = false;
  setAudioVolume();
  sendMute();

  clearVfdSegment(VFD_SEG_6);
  writeCharToVfd(VFD_SEG_5, 'O');
  writeCharToVfd(VFD_SEG_4, 'L');
  writeCharToVfd(VFD_SEG_3, 'L');
  writeCharToVfd(VFD_SEG_2, 'E');
  writeCharToVfd(VFD_SEG_1, 'H');
  clearVfdSegment(VFD_SEG_0);
  delay(2000);

  dispMode = lastDispMode;
  setDisplayMode();

  sendIR(IR_SEND_POWER);
  delay(5);
  sendIR(IR_SEND_POWER);
}

void powerOff() {
  Serial.println("POWER 0");

  powerStatus = false;

  volumeMute = true;
  setAudioVolume();
  sendMute();
  rdaPowerOff();

  clearVfdSegment(VFD_SEG_6);
  clearVfdSegment(VFD_SEG_5);
  clearVfdSegment(VFD_SEG_4);
  writeCharToVfd(VFD_SEG_3, 'E');
  writeCharToVfd(VFD_SEG_2, 'Y');
  writeCharToVfd(VFD_SEG_1, 'B');
  clearVfdSegment(VFD_SEG_0);
  delay(2000);

  lastDispMode = dispMode;
  dispMode = DISP_MODE_CLOCK;
  setDisplayMode();

  sendIR(IR_SEND_POWER);
  delay(5);
  sendIR(IR_SEND_POWER);
}

void sendMute() {
  Serial.print("MUTE ");
  Serial.println(volumeMute);
}

void processNetCount() {
  int number;
  char *param;

  param = serialNextParam();

  if (param != NULL) {
    number = atol(param);
    if (number > 0 && number <= MAX_NET_PRESETS) {
      netPresetsLen = number;
      currentNetPreset = 1;

      sendNetPreset();
    }
  }
}

void processFMCount() {
  int number;
  char *param;

  param = serialNextParam();

  if (param != NULL) {
    number = atol(param);
    if (number > 0 && number <= MAX_FM_PRESETS) {
      fmPresetsLen = number;
      currentFmPreset = 1;

      rdaSetFrequency(currentFrequency);
    }
  }
}

void processPreset() {
  byte number;
  char *param;

  param = serialNextParam();

  if (param != NULL) {
    number = atol(param);

    param = serialNextParam();
    if (param != NULL) {
        byte skipSerial = atol(param);
        isSkipSerialCommand = (skipSerial == 1);
    }
    if (mode == MODE_FM) {
      if (number > 0 && number <= fmPresetsLen) {
        currentFmPreset = number;
      }
    }
    else if (mode == MODE_NET) {
      if (number > 0 && number <= netPresetsLen) {
        currentNetPreset = number;
      }
    }
    else if (mode == MODE_MP3) {
      if (number > 0 && number <= mp3TracksLen) {
        currentMp3Track = number;
      }
    }
    showFuncMode();
  }
}

void showFuncMode() {
  if (dispMode == DISP_MODE_FUNC) {
    dispMode = DISP_MODE_FUNC;
    setDisplayMode();
    return;
  }
  lastDispMode = dispMode;
  dispMode = DISP_MODE_FUNC;
  setDisplayMode();
}

void processDate() {
  char *data[6] = {serialNextParam(), serialNextParam(), serialNextParam(), serialNextParam(), serialNextParam(), serialNextParam()};
// 6~2016~10~9~0~33~0
  if ((data[0] != NULL) && (data[1] != NULL) && (data[2] != NULL) && (data[3] != NULL) && (data[4] != NULL) && (data[5] != NULL)) {
    rtc.adjust(DateTime(atol(data[0]), atol(data[1]), atol(data[2]), atol(data[3]), atol(data[4]), atol(data[5])));
  }
}

void processSleepTimer() {
  char *data[2] = {serialNextParam(), serialNextParam()};

  if (data[0] != NULL && data[1] != NULL) {
    sleepTimerTime = atol(data[0]);
    sleepTimerOn = atol(data[1]);

    initSleepTimer();
    showSleepTimer();
  }
}

void initSleepTimer() {
  if (sleepTimerOn) {
    currentSleepTimerTime = sleepTimerTime;
  }
  else {
    currentSleepTimerTime = 0;
  }
}

void processAlarm1() {
  if (getAlarmData(1)) {
    showAlarm1();
  }
}

void processAlarm2() {
  if (getAlarmData(2)) {
    showAlarm2();
  }
}

boolean getAlarmData(byte alarmNum) {
  //7~1~2~12~60~0~30~1 - mode preset vol timeout hour minute on
  char *data[6] = {serialNextParam(), serialNextParam(), serialNextParam(), serialNextParam(), serialNextParam(), serialNextParam()};

  char *on = serialNextParam();
  char *param;

  if ((on != NULL) && (data[0] != NULL) && (data[1] != NULL) && (data[2] != NULL)
    && (data[3] != NULL) && (data[4] != NULL) && (data[0] != NULL))  {

    if (alarmNum == 1) {
      alarmParams1[0] = atol(data[0]);
      alarmParams1[1] = atol(data[1]);
      alarmParams1[2] = atol(data[2]);
      alarmParams1[3] = atol(data[3]);
      alarmParams1[4] = atol(data[4]);
      alarmParams1[5] = atol(data[5]);

      alarmOn1 = atol(on);
    }
    else {
      alarmParams2[0] = atol(data[0]);
      alarmParams2[1] = atol(data[1]);
      alarmParams2[2] = atol(data[2]);
      alarmParams2[3] = atol(data[3]);
      alarmParams2[4] = atol(data[4]);
      alarmParams2[5] = atol(data[5]);

      alarmOn2 = atol(on);
    }
    return true;
  }
  return false;
}

void processFmFrequency() {
  char *param;

  param = serialNextParam();

  if (param != NULL) {
    currentFrequency = atol(param);
  }
  setDisplayMode();
}

char *serialNextParam() {
  char *nextToken;
  nextToken = strtok_r(NULL, serialDelim, &serialLast);
  return nextToken;
}

void processIR() {
  unsigned long irValue;
  
  if (irRecv.decode(&irDecodeResults)) {
    irValue = irDecodeResults.value;
    //Serial.println(irValue, DEC);
  }
  if (lastIrValue !=  irValue) {
    lastIrValue =  irValue;
    switch (lastIrValue) {
      case IR_MUTE:
        toggleMute();
        showMute();
        break;
      case IR_MODE:
        changeMode();
        break;
      case IR_DISPLAY:
        changeDisplayMode();
        break;
      case IR_VOL_UP:
        changeVolumeValue(true);
        break;
      case IR_VOL_DOWN:
        changeVolumeValue(false);
        break;
      case IR_PRESET_DOWN:
        changeItem(false);
        break;
      case IR_PRESET_UP:
        changeItem(true);
        break;
      case IR_OK:
        changeOk();
        break;
      case IR_SLEEP:
        changeSleep();
        break;
      case IR_POWER:
        togglePower();
        break;
    }
    delay(IR_DELAY);
    irRecv.resume();
  }
}

void togglePower() {
  if (powerStatus) {
    resetSleepTimer();
    initSleepTimer();

    powerOff();
  }
  else {
    powerOn();
  }
}

void toggleMute() {
  volumeMute = !volumeMute;
  setAudioVolume();
  sendMute();
}

void changeMode() {
  mode++;
  mode = (mode >= 6) ? 1 : mode;

  setAudioMode();
  showFuncMode();

  sendMode();
}

void changeDisplayMode() {
  dispMode++;
  dispMode = (dispMode >= 6) ? 1 : dispMode;
  setDisplayMode();
}

void changeVolumeValue(boolean isUpDir) {
  if (isUpDir) {
    if (currentVolume < MAX_VOLUME) {
      currentVolume++;
    }
  }
  else {
    if (currentVolume > 0) {
      currentVolume--;
    }
  }
      
  updateVolume();
}

void changeItem(boolean isUpDir) {
  if (mode == MODE_FM) {
    if (isUpDir) {
      currentFmPreset++;
    }
    else {
      currentFmPreset--;
    }
    if (currentFmPreset == fmPresetsLen + 1) {
      currentFmPreset = 1;
    }
    else if (currentFmPreset == 0) {
      currentFmPreset = fmPresetsLen;
    }
    sendFMPreset();
  }
  else if (mode == MODE_NET) {
    if (isUpDir) {
      currentNetPreset++;
    }
    else {
      currentNetPreset--;
    }
    if (currentNetPreset == netPresetsLen + 1) {
      currentNetPreset = 1;
    }
    else if (currentNetPreset == 0) {
      currentNetPreset = netPresetsLen;
    }
    sendNetPreset();
  }
  else if (mode == MODE_MP3) {
    if (isUpDir) {
      currentMp3Track++;
    }
    else {
      currentMp3Track--;
    }
    if (currentMp3Track == mp3TracksLen + 1) {
      currentMp3Track = 1;
    }
    else if (currentMp3Track == 0) {
      currentMp3Track = mp3TracksLen;
    }
    sendMp3Track();
  }
  showFuncMode();
}

void changeOk() {
  switch (dispMode) {
    case DISP_MODE_ALARM1:
      alarmOn1 = !alarmOn1;
      showAlarm1();

      Serial.print("ALARM1 ");
      Serial.print(alarmParams1[0]);
      Serial.print(" ");
      Serial.print(alarmParams1[1]);
      Serial.print(" ");
      Serial.print(alarmParams1[2]);
      Serial.print(" ");
      Serial.print(alarmParams1[3]);
      Serial.print(" ");
      Serial.print(alarmParams1[4]);
      Serial.print(" ");
      Serial.print(alarmParams1[5]);
      Serial.print(alarmOn1 ? " 1 " : " 0 ");

      break;
    case DISP_MODE_ALARM2:
      alarmOn2 = !alarmOn2;
      showAlarm2();

      Serial.print("ALARM2 ");
      Serial.print(alarmParams2[0]);
      Serial.print(" ");
      Serial.print(alarmParams2[1]);
      Serial.print(" ");
      Serial.print(alarmParams2[2]);
      Serial.print(" ");
      Serial.print(alarmParams2[3]);
      Serial.print(" ");
      Serial.print(alarmParams2[4]);
      Serial.print(" ");
      Serial.print(alarmParams2[5]);
      Serial.print(alarmOn2 ? " 1 " : " 0 ");

      break;
    case DISP_MODE_SLEEP:
      sleepTimerOn = !sleepTimerOn;
      initSleepTimer();
      showSleepTimer();

      Serial.print("SLEEP ");
      Serial.print(sleepTimerTime);
      Serial.println(sleepTimerOn ? " 1" : " 0");

      break;
    }
}

void changeSleep() {
  sleepTimerTime = sleepTimerTime + SLEEP_TIMER_STEP;
  sleepTimerTime = (sleepTimerTime > MAX_SLEEP_TIMER) ? MIN_SLEEP_TIMER : sleepTimerTime;

  showSleepTimer();
}

void readKeys() {
  int keypress = 0;
  int data;
  int keyData;

  SPI.beginTransaction(vfdSettings);
  digitalWrite(PT_STB_PIN, LOW);

  SPI.transfer(0x42);
  data = SPI.transfer(0xFF);
  data = data & 0xFF;
  if (data != 0) {
    for (int bit = 0; bit < 8; bit++) {
      if (data & (1 << bit)) {
        keypress++;
      }
    }
    keyData = data;
  }
  digitalWrite(PT_STB_PIN, HIGH);
  SPI.endTransaction();

  ptWriteCommand(0x40);
  
  if (keypress == 1) {
    //Serial.println(keyData, DEC);
    processKeys(keyData);
    delay(KEY_DELAY);
  }
}

void processKeys(byte buttonState) {
  switch (buttonState) {
    //case BUTTON_POWER:
      //togglePower();
    //  break;
    case BUTTON_VOLUME_DOWN:
      changeVolumeValue(false);
      break;
    case BUTTON_VOLUME_UP:
      changeVolumeValue(true);
      break;
    case BUTTON_PREV:
      changeItem(false);
      break;
    case BUTTON_NEXT:
      changeItem(true);
      break;
    case BUTTON_MODE:
      changeMode();
      break;
    case BUTTON_DISPLAY:
      changeDisplayMode();
      break;
  }
}

void showLoad() {
  writeCharToVfd(VFD_SEG_6, 'G');
  writeCharToVfd(VFD_SEG_5, 'N');
  writeCharToVfd(VFD_SEG_4, 'I');
  writeCharToVfd(VFD_SEG_3, 'D');
  writeCharToVfd(VFD_SEG_2, 'A');
  writeCharToVfd(VFD_SEG_1, 'O');
  writeCharToVfd(VFD_SEG_0, 'L');
}

void sendIR(int code) {
  irSend.enableIROut(40);
  irSend.sendSony(code, 12);
  irRecv.enableIRIn();
}

void resetAudioVolume() {
  for (int i = 0; i < MAX_VOLUME_STEP; i++) {
    sendIR(IR_SEND_VOL_DOWN);
    delay(IR_VOLUME_COMMAND_DELAY);
  }  
}

void fadeInAudioVolume(char volume) {
  for (int i = 0; i < volume * VOLUME_STEP; i++) {
    sendIR(IR_SEND_VOL_UP);
    delay(IR_VOLUME_COMMAND_DELAY);
  }
}

void setAudioVolume() {
  Serial.print("VOL ");
  Serial.println(currentVolume);

  int volumeDiff = currentVolume - lastVolume;
  int volumeCommand = IR_SEND_VOL_UP;
  
  lastVolume = currentVolume;

  if (volumeDiff < 0) {
    volumeDiff = -volumeDiff;
    volumeCommand = IR_SEND_VOL_DOWN;
  }
  for (int i = 0; i < volumeDiff * VOLUME_STEP; i++) {
    sendIR(volumeCommand);
    delay(IR_VOLUME_COMMAND_DELAY2);
  }
}

void setupRTC() {
  rtc.begin(rtc.now());
  rtc.adjust(DateTime(2016, 1, 1, 0, 0, 0));
}

void setupRFM() {
  rfm.begin();
  rfm.openReadingPipe(1, 0xF0F0F0F0E1LL);
  rfm.startListening();
}

void rfmReceive() {
  if (rfm.available()){
    rfm.read(rfmBuffer, 6);
    rfmTemp = rfmBuffer[0];
    rfmBatteryVoltage = rfmBuffer[2];
  }
}

void setup() {
  Serial.begin(9600);
  setupRFM();
  setupRTC();
  setupAudioSelector();
  setupRadio();

  setupSerialCommand();
  setupIr();

  setupVfd();
  clearVfd();

  setupTimers();
  
  setAudioMode();
  //resetAudioVolume();
  //fadeInAudioVolume(currentVolume);
  setDisplayMode();
  //showLoad();
  togglePower();
}

void loop() {
  processIR();
  readSerial();
  rfmReceive();
  timer.run();
}
