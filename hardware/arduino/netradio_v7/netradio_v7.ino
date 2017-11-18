#include <Wire.h>
#include <IRremote.h>
#include <SimpleTimer.h>
#include <TimeLib.h>
#include <SPI.h>
#include <OneWire.h>
#include <RF24.h>

#define IR_PIN 2
#define PT_STB_PIN 9
#define DS_PIN A0

const int RDA5807_ADDRESS_SEQ = 0x10;
const int RDA5807_ADDRESS_RANDOM = 0x11;

#define RFM_CE_PIN 7
#define RFM_CSN_PIN 8

#define BA7611_CTLA_PIN 5
#define BA7611_CTLB_PIN 6

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

#define AUDIO_SOURCE_NET 0
#define AUDIO_SOURCE_BT  1
#define AUDIO_SOURCE_FM  2

const byte BUTTON_POWER = 10;
const byte BUTTON_DISPLAY = 64;
const byte BUTTON_MODE = 32;
const byte BUTTON_PREV = 4;
const byte BUTTON_STOP = 128;
const byte BUTTON_PLAY = 16;
const byte BUTTON_NEXT = 8;
const byte BUTTON_VOLUME_DOWN = 2;
const byte BUTTON_VOLUME_UP = 1;

const unsigned long IR_MUTE_ON = 3190304459;
const unsigned long IR_MUTE_OFF = 480179375;
const unsigned long IR_MODE = 667934610;
const unsigned long IR_MODE2 = 324005198;
const unsigned long IR_POWER_OFF = 2851064952;
const unsigned long IR_POWER_ON = 1266222740;
const unsigned long IR_DISPLAY = 463401754;
const unsigned long IR_DISPLAY2 = 3173526838;
const unsigned long IR_VOL_UP = 1463772700;
const unsigned long IR_VOL_UP2 = 4173897784;
const unsigned long IR_VOL_DOWN = 188078261;
const unsigned long IR_VOL_DOWN2 = 532007673;
const unsigned long IR_PRESET_UP = 2461875145;
const unsigned long IR_PRESET_UP2 = 2117945733;
const unsigned long IR_PRESET_DOWN = 2411542288;
const unsigned long IR_PRESET_DOWN2 = 2067612876;
const unsigned long IR_UP = 31889539;
const unsigned long IR_UP2 = 2742014623;
const unsigned long IR_DOWN = 15111918;
const unsigned long IR_DOWN2 = 2725237002;
const unsigned long IR_OK = 18594425;
const unsigned long IR_OK2 = 3969632309;
const unsigned long IR_LEFT = 3250666572;
const unsigned long IR_LEFT2 = 2148467744;
const unsigned long IR_RIGHT = 2383694249;
const unsigned long IR_RIGHT2 = 2039764837;
const unsigned long IR_SLEEP = 2788583822;
const unsigned long IR_SLEEP2 = 2444654410;

const unsigned long IR_SEND_POWER = 0xA81;
const unsigned long IR_SEND_VOL_DOWN = 0xC81;
const unsigned long IR_SEND_VOL_UP = 0x481;

const byte MODE_NET = 0;
const byte MODE_FM = 1;
const byte MODE_MP3 = 2;
const byte MODE_BT = 3;
const byte MODE_APLAY = 4;
const byte MODE_LINEIN = 5;

const byte DISP_MODE_CLOCK = 1;
const byte DISP_MODE_FUNC = 2;
const byte DISP_MODE_ALARM1 = 3;
const byte DISP_MODE_ALARM2 = 4;
const byte DISP_MODE_SLEEP = 5;

const byte SERIAL_MUTE = 1;
const byte SERIAL_MODE = 2;
const byte SERIAL_VOLUME = 3;
const byte SERIAL_PRESET= 4;
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
const byte SERIAL_TRACK_TIME = 15;
const byte SERIAL_SLEEP_ON = 16;

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

byte IR_DELAY = 300;
byte KEY_DELAY = 300;

const int RFM_POWER_ON = 1;
const int RFM_POWER_OFF = 2;

unsigned int currentFrequency = 875;

unsigned long MAX_MP3_TRACKS = 99999;
const byte MAX_NET_PRESETS = 9999;
const byte MAX_FM_PRESETS = 30;

unsigned int rdaReg[32];

const int VOLUME_TIMEOUT = 2000;
const int SLEEP_TIMEOUT = 2000;
const int TIME_INTERVAL = 1000;
const int KEYS_INTERVAL = 300;

unsigned int volumeTimerId = 0;
unsigned int timeTimerId = 0;
unsigned int sleepTimerId = 0;

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
unsigned long currentMp3Track = 1;

unsigned long mp3TracksLen = 1;
int netPresetsLen = 1;
byte fmPresetsLen = 1;

boolean alarmOn1 = false;
byte alarmParams1[2] = {8, 30};  //[hour, minute]

boolean alarmOn2 = false;
byte alarmParams2[2] = {9, 30};  //[hour, minute]

const byte SLEEP_TIMER_STEP = 15;
const byte MIN_SLEEP_TIMER = 15;
const byte MAX_SLEEP_TIMER = 90;
const byte SLEEP_TIMER_DEFAULT = 60;

byte sleepTimerTime = SLEEP_TIMER_DEFAULT;
boolean sleepTimerOn = false;
byte currentSleepTimerTime = SLEEP_TIMER_DEFAULT;

boolean isSkipSerialCommand = false;

boolean powerStatus = false;

unsigned long lastIrValue = 0;

int rfmBuffer[6];
int rfmTemp = -99;
int rfmBatteryVoltage;
byte tempThrot = 0;

const byte TEMP_THROTTLING = 60; //one measure in minute

const byte LOW_SENSOR_BATTERY_VOLTAGE = 30;

RF24 rfm(RFM_CE_PIN, RFM_CSN_PIN);

IRrecv irRecv(IR_PIN);
decode_results irDecodeResults;
IRsend irSend;

SPISettings vfdSettings(500000, LSBFIRST, SPI_MODE3);

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
  resetVfd();
  ptWriteCommand(0x0A);
  ptWriteCommand(0x88 | 0b100);// 1/16 Dim
  clearVfd();
}

void ptWriteCommand(unsigned char command) {
  SPI.beginTransaction(vfdSettings);
  digitalWrite(PT_STB_PIN, LOW);
  SPI.transfer(command);
  digitalWrite(PT_STB_PIN, HIGH);
  SPI.endTransaction();
}

void resetVfd() {
  unsigned char i;
  for (i = 0; i < 20; i++) {
    ptWriteData(i, 0x0000);
  }
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
  byte hours = hour();
  byte minutes = minute();
  clearVfdSegment(VFD_SEG_7);
  writeDigitToVfd(VFD_SEG_9, hours % 10, (second() % 10) % 2);
  if (hours > 9) {
    writeDigitToVfd(VFD_SEG_8, hours / 10, false);
  }  
  writeDigitToVfd(VFD_SEG_11, minutes % 10, false);
  writeDigitToVfd(VFD_SEG_10, minutes / 10, false);

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
  showExtTemp();
  showIntTemp();
}

void showIntTemp() {
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
    writeDigitToVfd(VFD_SEG_4, digit, false);
  }
  else {
    clearVfdSegment(VFD_SEG_4);
  }
  writeDigitToVfd(VFD_SEG_5, intTemp % 10, false);
  writeCharToVfd(VFD_SEG_6, 'C');
}

void showExtTemp() {
  /*
  if (rfmTemp > -99) {
    if (rfmBatteryVoltage < LOW_SENSOR_BATTERY_VOLTAGE) {
      writeCharToVfd(VFD_SEG_6, 'B'); 
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
        int digit = (extTemp / 10) % 10;
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
    writeCharToVfd(VFD_SEG_4, 'S');
    writeCharToVfd(VFD_SEG_5, 'Y');
    writeCharToVfd(VFD_SEG_6, 'N');
  }
  */
  clearVfdSegment(VFD_SEG_3);
  clearVfdSegment(VFD_SEG_4);
  clearVfdSegment(VFD_SEG_5);
  clearVfdSegment(VFD_SEG_6);
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
      tempThrot = 0;
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
      writeCharToVfd(VFD_SEG_2, 'B');      
      writeCharToVfd(VFD_SEG_1, 'E');
      writeCharToVfd(VFD_SEG_0, 'W');
      break;
    case MODE_MP3:
      digit = (currentMp3Track / 10000) % 10;
      if (digit  > 0 || currentMp3Track > 9999) {
        writeDigitToVfd(VFD_SEG_2, digit, false);
      }
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
      writeCharToVfd(VFD_SEG_1, 'R');
      writeCharToVfd(VFD_SEG_0, 'T');

      setTrackTime(0);
      showVfdSymbol(VFD_PLAYER_SEG, true);
      break;
    case MODE_BT:
      writeCharToVfd(VFD_SEG_6, 'O');
      writeCharToVfd(VFD_SEG_5, 'O');
      writeCharToVfd(VFD_SEG_4, 'T');
      writeCharToVfd(VFD_SEG_3, 'E');
      writeCharToVfd(VFD_SEG_2, 'U');
      writeCharToVfd(VFD_SEG_1, 'L');
      writeCharToVfd(VFD_SEG_0, 'B');

      showTime();
      timer.enable(timeTimerId);
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

void setTrackTime(unsigned int time) {
  byte hours = time / 3600;
  byte minutes = (time % 3600) / 60;
  byte seconds = (time % 3600) % 60;

  if (hours) {
    writeDigitToVfd(VFD_SEG_7, hours, true);
  }
  else {
    clearVfdSegment(VFD_SEG_7);
  }  
  writeDigitToVfd(VFD_SEG_9, minutes % 10, true);
  writeDigitToVfd(VFD_SEG_8, minutes / 10, false);
  writeDigitToVfd(VFD_SEG_11, seconds % 10, false);
  writeDigitToVfd(VFD_SEG_10, seconds / 10, false);
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

void showAlarmData(byte alarmParams[2]) {
  clearVfdSegment(VFD_SEG_7);
  writeDigitToVfd(VFD_SEG_9, alarmParams[0] % 10, true);
  writeDigitToVfd(VFD_SEG_8, alarmParams[0] / 10, false);
  writeDigitToVfd(VFD_SEG_11, alarmParams[1] % 10, false);
  writeDigitToVfd(VFD_SEG_10, alarmParams[1] / 10, false);  
}

void showSleepTimer() {
  clearVfd();

  if (sleepTimerOn) {
    showVfdSymbol(VFD_SLEEP_SEG, true);
  }
  else {
    showVfdSymbol(VFD_SLEEP_SEG, false);
  }

  writeDigitToVfd(VFD_SEG_5, (sleepTimerTime / 10) % 10, false);
  writeDigitToVfd(VFD_SEG_6, sleepTimerTime % 10, false);
  writeCharToVfd(VFD_SEG_4, 'P');
  writeCharToVfd(VFD_SEG_3, 'E');
  writeCharToVfd(VFD_SEG_2, 'E');
  writeCharToVfd(VFD_SEG_1, 'L');
  writeCharToVfd(VFD_SEG_0, 'S');

  clearVfdSegment(VFD_SEG_7);
  clearVfdSegment(VFD_SEG_8);
  clearVfdSegment(VFD_SEG_9);
  writeDigitToVfd(VFD_SEG_11, currentSleepTimerTime % 10, false);
  writeDigitToVfd(VFD_SEG_10, currentSleepTimerTime / 10, false);
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
      setAudioSource(AUDIO_SOURCE_FM);
      break;
    case MODE_NET:
      rdaPowerOff();
      setAudioSource(AUDIO_SOURCE_NET);
      break;
    case MODE_MP3:
      rdaPowerOff();
      setAudioSource(AUDIO_SOURCE_NET);
      break;
    case MODE_BT:
      rdaPowerOff();
      setAudioSource(AUDIO_SOURCE_BT);
      break;
    case MODE_LINEIN:
      rdaPowerOff();
      setAudioSource(AUDIO_SOURCE_BT);
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
    case AUDIO_SOURCE_BT:
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
  Serial.print("WPRESET ");
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
      Serial.println("web");
      break;
    case MODE_MP3:
      Serial.println("player");
      break;
    case MODE_BT:
      Serial.println("bt");
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
Send data

MUTE 0|1
MODE web|fm|player|bt|aplay|linein
VOL 1-32
WPRESET 1-9999
PRESET 1-30
TRACK 1-99999
SLEEP 15-90 0|1
ALARM1 0|1
ALARM2 0|1
POWER 0|1
*/
  /*
    processMute: // 1~[0-1] // 1~0
    changeModeToSelected: // 2~[0-5] // 2~1
    processVol: // 3~[1-31] // 3~4
    processPreset: // 4~[1-999] // 4~1
    processSleepTimer: // 5~60 // 5~60
    processDate: // 6~2017~10~29~20~03~0
    processAlarm1: // 7~8~30~1 - hour minute on
    processAlarm2: // 8~9~30~1
    processNetCount: // 9~[1-9999] // 9~10
    processFMCount: // 10~[1-30] // 10~2
    processFmFrequency: // 11~[875-1080] // 11~989
    processMp3Count: // 12~[1-99999] // 12~989
    processLoadComplete: // 13~1
    processPower: 14~[0-1]
    processTrackTime: 15~[0-36000] // 15~10
    processSleepTimerOn: 16~[15-180]~[0-1] // 16~30~1
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
        case SERIAL_PRESET:
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
        case SERIAL_TRACK_TIME:
          processTrackTime();
          break;
        case SERIAL_SLEEP_ON:
          processSleepTimerOn();
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
  }
}

void processTrackTime() {
  unsigned int number;
  char *param;

  param = serialNextParam();
  if (param != NULL) {
    number = atol(param);
    if (dispMode == DISP_MODE_FUNC && (mode == MODE_NET || mode == MODE_MP3)
      && number >= 0 && number < 36000) {
      setTrackTime(number);
    }  
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
    if (number >= 0 && number < 6) {
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
  unsigned long number;
  char *param;

  param = serialNextParam();

  if (param != NULL) {
    number = atol(param);
    if (number > 0 && number <= MAX_MP3_TRACKS) {
      mp3TracksLen = number;
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
      powerOff();
    }
  }
}

void powerOn() {
  powerOnCommon();
}

void powerOnCommon() {
  powerStatus = true;

  volumeMute = false;
  setAudioVolume();

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
  powerStatus = false;

  volumeMute = true;
  setAudioVolume();
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

  tempThrot = 0;
}

void sendMute() {
  Serial.print("MUTE ");
  Serial.println(volumeMute);
}

void sendVolume() {
  Serial.print("VOL ");
  Serial.println(currentVolume);
}

void processNetCount() {
  int number;
  char *param;

  param = serialNextParam();

  if (param != NULL) {
    number = atol(param);
    if (number > 0 && number <= MAX_NET_PRESETS) {
      netPresetsLen = number;
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

      rdaSetFrequency(currentFrequency);
    }
  }
}

void processPreset() {
  unsigned long number;
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
    setTime(atol(data[3]), atol(data[4]), atol(data[5]), atol(data[2]), atol(data[1]), atol(data[0]));
  }
}

void processSleepTimer() {
  char *param;

  param = serialNextParam();

  if (param != NULL) {
    currentSleepTimerTime = atol(param);

    showSleepTimer();

    if (sleepTimerId > 0) {
      timer.restartTimer(sleepTimerId);
    }
    else {
      sleepTimerId = timer.setTimeout(SLEEP_TIMEOUT, hideSleepTimer);
    }
  }
}

void hideSleepTimer() {
  clearVfd();
  restoreVfdData();
}

void processSleepTimerOn() {
  char *param;
  char *param2;

  param = serialNextParam();
  param2 = serialNextParam();
  if ((param != NULL) && (param2 != NULL)) {
    sleepTimerTime = atol(param);
    currentSleepTimerTime = sleepTimerTime;
    sleepTimerOn = atol(param2);

    showSleepTimer();
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
  //7~8~30~1 - hour minute on
  byte *data[2] = {
                   atol(serialNextParam()),
                   atol(serialNextParam())
                  };

  byte *on = atol(serialNextParam());
  
  if (alarmNum == 1 && (on != alarmOn1 || data[0] != alarmParams1[0] || data[1] != alarmParams1[1]))  {
    alarmParams1[0] = data[0];
    alarmParams1[1] = data[1];
    alarmOn1 = on;
 
    return true;
  }
  else if (alarmNum == 2 && (on != alarmOn2 || data[0] != alarmParams2[0] || data[1] != alarmParams2[1]))  {
    alarmParams2[0] = data[0];
    alarmParams2[1] = data[1];
    alarmOn2 = on;
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
      case IR_MUTE_ON:
      case IR_MUTE_OFF:
        toggleMute();
        showMute();
        break;
      case IR_MODE:
      case IR_MODE2:
        changeMode();
        break;
      case IR_DISPLAY:
      case IR_DISPLAY2:
        changeDisplayMode();
        break;
      case IR_VOL_UP:
      case IR_VOL_UP2:
      case IR_UP:
      case IR_UP2:
        changeVolumeValue(true);
        break;
      case IR_VOL_DOWN:
      case IR_VOL_DOWN2:
      case IR_DOWN:
      case IR_DOWN2:
        changeVolumeValue(false);
        break;
      case IR_PRESET_DOWN:
      case IR_PRESET_DOWN2:
      case IR_LEFT:
      case IR_LEFT2:
        changeItem(false);
        break;
      case IR_PRESET_UP:
      case IR_PRESET_UP2:
      case IR_RIGHT:
      case IR_RIGHT2:
        changeItem(true);
        break;
      case IR_OK:
      case IR_OK2:
        changeOk();
        break;
      case IR_SLEEP:
      case IR_SLEEP2:
        changeSleep();
        break;
      case IR_POWER_OFF:
      case IR_POWER_ON:
        togglePower();
        break;
    }
    delay(IR_DELAY);
    irRecv.resume();
  }
}

void togglePower() {
  if (powerStatus) {
    Serial.println("POWER 0");
    powerOff();
  }
  else {
    Serial.println("POWER 1");
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
  mode = (mode >= 6) ? 0 : mode;

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
  sendVolume();   
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
      Serial.println(alarmOn1 ? "1" : "0");

      break;
    case DISP_MODE_ALARM2:
      alarmOn2 = !alarmOn2;
      showAlarm2();

      Serial.print("ALARM2 ");
      Serial.println(alarmOn2 ? "1" : "0");

      break;
    case DISP_MODE_SLEEP:
      sleepTimerOn = !sleepTimerOn;
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
  currentSleepTimerTime = sleepTimerTime;

  Serial.print("SLEEP ");
  Serial.print(sleepTimerTime);
  Serial.println(sleepTimerOn ? " 1" : " 0");
      
  showSleepTimer();
}

void readKeys() {
  rfmReceive();
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
  delay(IR_DELAY);
  irRecv.resume();
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

void setupRFM() {
  rfm.begin();
  rfm.openReadingPipe(1, 0xF0F0F0F0E2LL);
  rfm.startListening();
}

void rfmReceive() {
  if (rfm.available()){
    rfm.read(rfmBuffer, 6);
    //Serial.println(rfmBuffer[0]);
    //Serial.println(rfmBuffer[1]);
    //Serial.println(rfmBuffer[2]);

    int rfmPowerStatus = rfmBuffer[0] == RFM_POWER_ON;

    if (rfmPowerStatus != powerStatus) {
      if (rfmPowerStatus) {
        Serial.println("POWER 1");
        powerOn();
      }
      else {
        Serial.println("POWER 0");
        powerOff();
      }
    }
    int rfmVolume = rfmBuffer[2];
    if (rfmVolume != currentVolume) {
      currentVolume = rfmVolume;

      sendVolume(); 
      updateVolume();
    }
    //rfmTemp = rfmBuffer[0];
    //rfmBatteryVoltage = rfmBuffer[2];
  }
}

void setup() {
  Serial.begin(9600);
  setupRFM();
  setupAudioSelector();
  setupRadio();

  setupSerialCommand();
  setupIr();

  setupVfd();
  clearVfd();

  setupTimers();
  
  //resetAudioVolume();
  //fadeInAudioVolume(currentVolume);
  setDisplayMode();
  showLoad();
}

void loop() {
  processIR();
  readSerial();
  timer.run();
}

