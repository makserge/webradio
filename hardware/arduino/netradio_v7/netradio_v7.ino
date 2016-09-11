#include "Wire.h"
#include "IRremote.h"
#include "SimpleTimer.h"
#include "swRTC.h"
#include "SPI.h"

#define RECV_PIN 2
#define PT_STB_PIN 4

const int RDA5807_ADDRESS_SEQ = 0x10;
const int RDA5807_ADDRESS_RANDOM = 0x11;

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

#define AUDIO_SOURCE_NET      0
#define AUDIO_SOURCE_FM       1
#define AUDIO_SOURCE_LINEIN   2

const byte BUTTON_POWER = 1;
const byte BUTTON_DISPLAY = 2;
const byte BUTTON_MODE = 3;
const byte BUTTON_PREV = 4;
const byte BUTTON_STOP = 5;
const byte BUTTON_PLAY = 6;
const byte BUTTON_NEXT = 7;
const byte BUTTON_VOLUME_DOWN = 8;
const byte BUTTON_VOLUME_UP = 9;

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
const byte SERIAL_DISP_LED = 12;
const byte SERIAL_MP3_COUNT = 13;
const byte SERIAL_LOAD_COMPLETE = 14;
const byte SERIAL_POWER = 15;

const byte SERIAL_BUFFER_LENGTH = 45;
char inSerialChar;
char serialBuffer[SERIAL_BUFFER_LENGTH];
byte serialBufferPos;
char *serialToken;
char serialDelim[2];
char *serialLast;

const byte DEFAULT_VOLUME = 16;
const byte MAX_VOLUME = 31;

boolean volumeMute = false;
byte currentVolume = DEFAULT_VOLUME;

const int MAX_MP3_TRACKS = 99999;
const byte MAX_NET_PRESETS = 9999;
const byte MAX_FM_PRESETS = 30;

unsigned int RDA5807_reg[32];

const int AUDIO_TIMEOUT = 2000;
const int FUNC_TIMEOUT = 2000;

unsigned int audioTimerId = 0;
unsigned int timeTimerId = 0;
unsigned int funcTimerId = 0;

const int TIME_INTERVAL = 1000;

unsigned long vfdDigitMap[10] = { 0x7046, 0x2040, 0x6186, 0x61C2, 0x31C0, 0x51C2, 0x51C6, 0x6040, 0x71C6, 0x71C2 };
unsigned long vfdDigitMap2[10] = { 0x77, 0x22, 0x5B, 0x6B, 0x2E, 0x6D, 0x7D, 0x23, 0x7F, 0x6F };

unsigned long vfdAlphaMap[26] = {
                          0x71C4, 0x64D2, 0x5006, 0x6452, 0x5186, 0x5184, 0x50C6, 0x31C4, 0x4412, 
                          0x2046, 0x1324, 0x1006, 0x3A44, 0x3864, 0x7046, 0x7184, 0x7066, 0x71A4, 
                          0x51C2, 0x4410, 0x3046, 0x120C, 0x306C, 0xA28, 0xA10, 0x420A
};

int vfdSymbolRegister = 0x0;
int vfdSymbolRegister2 = 0x0;

byte dispMode = DISP_MODE_CLOCK;
byte mode = MODE_NET;
byte lastDispMode = DISP_MODE_CLOCK;

byte currentFmPreset = 1;
int currentNetPreset = 1;
int currentMp3Track = 1;

int mp3TracksLen = 1;
int netPresetsLen = 1;
byte fmPresetsLen = 1;

boolean alarmOn1 = false;
byte alarmDays1[7] = {1, 2, 3, 4, 5, NULL, NULL};
byte alarmParams1[6] = {1, 1, 8, 60, 9, 0};  //[mode, preset, vol, timeout, hour, minute]

boolean alarmOn2 = false;
byte alarmDays2[7] = {NULL, NULL, NULL, NULL, NULL, 6, 7};
byte alarmParams2[6] = {2, 1, 8, 30, 10, 0};  //[mode, preset, vol, timeout, hour, minute]

const byte SLEEP_TIMER_STEP = 15;
const byte MIN_SLEEP_TIMER = 15;
const byte MAX_SLEEP_TIMER = 240;
const byte SLEEP_TIMER_DEFAULT = 60;

byte sleepTimerTime = SLEEP_TIMER_DEFAULT;
boolean sleepTimerOn = false;
byte currentSleepTimerTime = 0;

boolean isLoadComplete = false;
boolean isSkipSerialCommand = false;

boolean powerStatus = false;

unsigned long lastIrValue = 0;

IRrecv irRecv(RECV_PIN);
decode_results irDecodeResults;
swRTC rtc;
SPISettings ptSettings(500000, LSBFIRST, SPI_MODE3);

SimpleTimer timer;

void RDA5807_Reset() {
  unsigned int RDA5807_defReg[7] = {
    0x0758,
    0x0000,
    0xD009,
    0x0000,
    0x1400,
    0x84DF,
    0x4000
  };
  for (int i = 0; i < 7; i++) {
    RDA5807_reg[i] = RDA5807_defReg[i];
  }
  RDA5807_reg[2] = RDA5807_reg[2] | 0x0002;
  RDA5807_Write();
  RDA5807_reg[2] = RDA5807_reg[2] & 0xFFFB;
}

void RDA5807_Write() {
  Wire.beginTransmission(RDA5807_ADDRESS_SEQ);
  for (int i = 2; i < 7; i++) {
    Wire.write(RDA5807_reg[i] >> 8);
    Wire.write(RDA5807_reg[i] & 0xFF);
  }
  Wire.endTransmission();
  delay(10);
}

void setupAudio() {
  volumeMute = true;
  //setAudioSource(TDA7313_SOURCE_NET);
}

void setupRadio() {
  RDA5807_Reset();
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
  irRecv.blink13(true);
}

void setupVfd() {
  pinMode(PT_STB_PIN, OUTPUT);

  ptWriteCommand(0x0D);
  ptWriteCommand(0x88 | 0b100);// 1/16 Dim
  clearVfd();
}

void ptWriteCommand(unsigned char command) {
  SPI.beginTransaction(ptSettings);
  digitalWrite(PT_STB_PIN, LOW);
  delayMicroseconds(1);
  SPI.transfer(command);
  digitalWrite (PT_STB_PIN, HIGH);
  SPI.endTransaction();
  delayMicroseconds(1);
}

void clearVfd() {
  unsigned char i;
  for (i = 0; i < 32; i++) {
    ptWriteData(i, 0x0000);
  }
}

void ptWriteData(unsigned char address, unsigned long data) {
  ptWriteCommand(0x40);      //data setting cmd
  SPI.beginTransaction(ptSettings);
  digitalWrite(PT_STB_PIN, LOW);
  delayMicroseconds(1);
  SPI.transfer(0xC0 + address);
  SPI.transfer((unsigned char)(data & 0x00FF));
  SPI.transfer((unsigned char)((data>>8) & 0x00FF));
  SPI.transfer((unsigned char)((data>>16) & 0x00FF));
  delayMicroseconds(1);
  digitalWrite(PT_STB_PIN, HIGH);
  SPI.endTransaction();
}

void setupTimers() {
  timeTimerId = timer.setInterval(TIME_INTERVAL, showTime);
}

void showTime() {
  //  if (!isLoadComplete) {
  //    writeDigitToVfd(VFD_SEG_4, 'D');
  //    writeDigitToVfd(VFD_SEG_3, 'A');
  //    writeDigitToVfd(VFD_SEG_2, 'O');
  //    writeDigitToVfd(VFD_SEG_1, 'L');
  //    return;
  //  }
  byte hour = rtc.getHours();
  byte minute = rtc.getMinutes();

  Serial.print(hour, DEC);
  Serial.print(":");
  Serial.print(minute, DEC);
  Serial.print(":");
  Serial.println(rtc.getSeconds(), DEC);
  clearVfdSegment(VFD_SEG_7);
  writeDigitToVfd(VFD_SEG_9, hour % 10, (rtc.getSeconds() % 10) % 2);
  writeDigitToVfd(VFD_SEG_8, hour / 10, false);
  writeDigitToVfd(VFD_SEG_11, minute % 10, false);
  writeDigitToVfd(VFD_SEG_10, minute / 10, false);
}

void clearVfdSegment(byte segment) {
  ptWriteData(segment, 0x0000);
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
      bitSet(data, 10);
    }
    else {
      bitClear(data, 10);
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
      break;
    case DISP_MODE_FUNC:
      showModeValue();
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

void showModeValue() {
  unsigned int currentFrequency;
  byte digit;

  clearVfd();
  switch (mode) {
    case MODE_FM:
      /*currentFrequency = loadFMPreset();

      writeDigitToVfd(VFD_SEG_6, 0, false);
      writeDigitToVfd(VFD_SEG_5, currentFrequency % 10, true);

      writeDigitToVfd(VFD_SEG_4, (currentFrequency / 10) % 10, false);
      writeDigitToVfd(VFD_SEG_3, (currentFrequency / 100) % 10, false);

      digit = (currentFrequency / 1000) % 10;
      if (digit  > 0) {
        writeDigitToVfd(VFD_SEG_2, digit, false);
      }
      writeCharToVfd(VFD_SEG_1, 'F');
      */
      break;
    case MODE_NET:
      digit = (currentNetPreset / 1000) % 10;
      if (digit  > 0 || currentNetPreset > 999) {
        writeDigitToVfd(VFD_SEG_6, digit, false);
      }
      digit = (currentNetPreset / 100) % 10;
      if (digit  > 0 || currentNetPreset > 99) {
        writeDigitToVfd(VFD_SEG_5, digit, false);
      }
      digit = (currentNetPreset / 10) % 10;
      if (digit  > 0 || currentNetPreset > 99) {
        writeDigitToVfd(VFD_SEG_4, digit, false);
      }
      writeDigitToVfd(VFD_SEG_3, currentNetPreset % 10, false);
      writeCharToVfd(VFD_SEG_1, 'N');
      break;
    case MODE_MP3:
      digit = (currentMp3Track / 1000) % 10;
      if (digit  > 0 || currentMp3Track > 999) {
        writeDigitToVfd(VFD_SEG_6, digit, false);
      }
      digit = (currentMp3Track / 100) % 10;
      if (digit  > 0 || currentMp3Track > 99) {
        writeDigitToVfd(VFD_SEG_5, digit, false);
      }
      digit = (currentMp3Track / 10) % 10;
      if (digit  > 0 || currentMp3Track > 99) {
        writeDigitToVfd(VFD_SEG_4, digit, false);
      }
      writeDigitToVfd(VFD_SEG_3, currentMp3Track % 10, false);
      writeCharToVfd(VFD_SEG_1, 'P');
      break;
    case MODE_LINEIN:
      writeCharToVfd(VFD_SEG_6, 'N');
      writeCharToVfd(VFD_SEG_5, 'I');
      writeCharToVfd(VFD_SEG_4, 'E');
      writeCharToVfd(VFD_SEG_3, 'N');
      writeCharToVfd(VFD_SEG_2, 'I');
      writeCharToVfd(VFD_SEG_1, 'L');
      break;
    case MODE_APLAY:
      writeCharToVfd(VFD_SEG_6, 'Y');
      writeCharToVfd(VFD_SEG_5, 'A');
      writeCharToVfd(VFD_SEG_4, 'L');
      writeCharToVfd(VFD_SEG_3, 'P');
      writeCharToVfd(VFD_SEG_2, 'I');
      writeCharToVfd(VFD_SEG_1, 'A');
      break;
  
  }
}

void showAlarm1() {
  if (alarmOn1) {
    writeCharToVfd(VFD_SEG_6, 'N');
    writeCharToVfd(VFD_SEG_5, 'O');
   // clearVfdSegment(VFD_SEG_4);
  }
  else {
    writeCharToVfd(VFD_SEG_6, 'F');
    writeCharToVfd(VFD_SEG_5, 'F');
    writeCharToVfd(VFD_SEG_4, 'O');
  }
  writeDigitToVfd(VFD_SEG_3, 1, false);
  writeCharToVfd(VFD_SEG_2, 'L');
  writeCharToVfd(VFD_SEG_1, 'A');

  //showAlarmData(alarmParams1, alarmDays1);
}

void showAlarm2() {
  if (alarmOn2) {
    writeCharToVfd(VFD_SEG_6, 'N');
    writeCharToVfd(VFD_SEG_5, 'O');
  //  clearVfdSegment(VFD_SEG_4);
  }
  else {
    writeCharToVfd(VFD_SEG_6, 'F');
    writeCharToVfd(VFD_SEG_5, 'F');
    writeCharToVfd(VFD_SEG_4, 'O');
  }
  writeDigitToVfd(VFD_SEG_3, 2, false);
  writeCharToVfd(VFD_SEG_2, 'L');
  writeCharToVfd(VFD_SEG_1, 'A');

  //showAlarmData(alarmParams2, alarmDays2);
}

void showSleepTimer() {
  clearVfd();

  if (sleepTimerOn) {
    writeCharToVfd(VFD_SEG_5, 'N');
    writeCharToVfd(VFD_SEG_4, 'O');
  }
  else {
    writeCharToVfd(VFD_SEG_6, 'F');
    writeCharToVfd(VFD_SEG_5, 'F');
    writeCharToVfd(VFD_SEG_4, 'O');
  }
  writeCharToVfd(VFD_SEG_2, 'T');
  writeCharToVfd(VFD_SEG_1, 'S');

  //oled.clearLcd();

  //clearOledBuffer();

  //sprintf(oledBuffer, "%d %c%c%c.", sleepTimerTime, 140, 136, 141);
  //sendDataToOled(oledBuffer, OLED_ROW_1);

  //if (sleepTimerOn) {
  //  clearOledBuffer();

  //  sprintf(oledBuffer, "%c%c%c%c%c%c%c: %d %c%c%c.", 142, 145, 146, 128, 146, 142, 138, currentSleepTimerTime, 140, 136, 141);
  //  sendDataToOled(oledBuffer, OLED_ROW_2);
  //}
  //setOledTimeOut();
}

void setAudioMode() {
  switch (mode) {
    case MODE_FM:
      RDA5807_PowerOn();
      setFMPreset();
      sendFMPreset();
      setAudioSource(AUDIO_SOURCE_FM);
      break;
    case MODE_NET:
      RDA5807_PowerOff();
      sendNetPreset();
      setAudioSource(AUDIO_SOURCE_NET);
      break;
    case MODE_MP3:
      RDA5807_PowerOff();
      sendMp3Track();
      setAudioSource(AUDIO_SOURCE_NET);
      break;
    case MODE_LINEIN:
      RDA5807_PowerOff();
      setAudioSource(AUDIO_SOURCE_LINEIN);
      break;
    case MODE_APLAY:
      setAudioSource(AUDIO_SOURCE_NET);
      break;
  }
}

void setAudioSource(byte value) {
  /*
  value = value % 3; //range 0-2
  switch (value) {
    case AUDIO_SOURCE_NET:
      bitClear(tdaAudioSwitchReg, 0);
      bitClear(tdaAudioSwitchReg, 1);
      break;
    case AUDIO_SOURCE_FM:
      bitSet(tdaAudioSwitchReg, 0);
      bitClear(tdaAudioSwitchReg, 1);
      break;
    case AUDIO_SOURCE_LINEIN:
      bitClear(tdaAudioSwitchReg, 0);
      bitSet(tdaAudioSwitchReg, 1);
      break;
  }
  tdaWriteByte(tdaAudioSwitchReg);
  */
}

void setFMPreset() {
//  int currentFrequency = loadFMPreset();
 // RDA5807_SetFreq(currentFrequency);
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

void RDA5807_PowerOn() {
  RDA5807_reg[3] = RDA5807_reg[3] | 0x010;   // Enable Tuning
  RDA5807_reg[2] = RDA5807_reg[2] | 0x001;   // Enable PowerOn
  RDA5807_Write();
  RDA5807_reg[3] = RDA5807_reg[3] & 0xFFEF;  // Disable Tuning
}

void RDA5807_PowerOff() {
  RDA5807_reg[2] = 0x0001;   // all bits off
  RDA5807_Write();
}

void RDA5807_SetFreq(int frequency) {
  int minFrequency = 870;
  int channelNumber = frequency - minFrequency;
  channelNumber = channelNumber & 0x03FF;
  RDA5807_reg[3] = channelNumber * 64 + 0x10;//0x10;  // Channel + TUNE-Bit + Band=00(87-108) + Space=00(100kHz)
  //RDA5807_reg[3] = channelNumber * 64 + 0x1C;//0x10;
  Wire.beginTransmission(RDA5807_ADDRESS_SEQ);
  Wire.write(0xD009 >> 8);
  Wire.write(0xD009 & 0xFF);
  Wire.write(RDA5807_reg[3] >> 8);
  Wire.write(RDA5807_reg[3] & 0xFF);
  Wire.endTransmission();
  delay(100);
}

void setAudioVolume() {
  Serial.print("VOL ");
  Serial.println(currentVolume);

  //byte value = (volumeMute) ? TDA7313_MUTEVOL : currentVolume;
  //tdaWriteByte(TDA7313_VOL_REG | (TDA7313_MAXVOL - value * 2) );
}

void readSerial() {
  /*
    processMute: // 1~[0-1] // 1~0
    changeModeToSelected: // 2~[1-5] // 2~1
    processVol: // 3~[1-15] // 3~4
    processPreset: // 4~[1-999] // 4~1
    processSleepTimer: // 5~60~[0-1] // 5~60~0
    processDate: // 6~2014~10~8~0~33~0
    processAlarm1: // 7~1~2~12~60~0~30~1~1~2~3~4~5~0~0 - mode preset vol timeout hour minute on days(1-7)
    processAlarm2: // 8~1~2~12~60~0~30~1~0~0~0~0~0~6~7
    processNetCount: // 9~[1-99] // 9~10
    processFMCount: // 10~[1-30] // 10~2
    processDisplayToOled: // 11~Title with some
    processDisplayToLed: // 12~[875-1080] // 12~989
    processMp3Count: // 13~[1-999] // 12~989
    processLoadComplete: // 14~1
    processPower: 15~[0-1]
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
        case SERIAL_DISP_LED:
          processDisplayToLed();
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
  showAudioParam();
  if (audioTimerId > 0) {
    timer.restartTimer(audioTimerId);
  }
  else {
    audioTimerId = timer.setTimeout(AUDIO_TIMEOUT, hideAudioParam);
  }
}

void showAudioParam() {
  backupVfdData();

  if (volumeMute) {
    displayMute();
  }  
  else {  
    displayAudioParam(volumeMute ? -2 : currentVolume, 0, MAX_VOLUME, -1, 'V', 'O', 'L');
  }
}

void displayMute() {
  writeCharToVfd(VFD_SEG_4, 'E');
  writeCharToVfd(VFD_SEG_3, 'T');
  writeCharToVfd(VFD_SEG_2, 'U');
  writeCharToVfd(VFD_SEG_1, 'M');
}

void displayAudioParam(int value, int minValue, int maxValue, int offset, byte symbol1, byte symbol2, byte symbol3) {
  /*
  if (value == maxValue) {
    writeCharToVfd(VFD_SEG_6, 'X');
    writeCharToVfd(VFD_SEG_5, 'A');
    writeCharToVfd(VFD_SEG_4, 'M');
  }
  else if (value == minValue) {
    writeCharToVfd(VFD_SEG_6, 'N');
    writeCharToVfd(VFD_SEG_5, 'I');
    writeCharToVfd(VFD_SEG_4, 'M');
  }
  else if (offset != 1 && value == offset) {
    writeCharToVfd(VFD_SEG_6, 'D');
    writeCharToVfd(VFD_SEG_5, 'I');
    writeCharToVfd(VFD_SEG_4, 'M');
  }
  else {
    int origValue = value;
    if (offset == -1) {
      clearVfdSegment(VFD_SEG_4);
    }
    else {
      if (value >= offset) {
        value -= offset;
        clearVfdSegment(VFD_SEG_4);
      }
      else {
        value = abs(offset - value);
        if (value >= 10) {
          writeMinusVfdSegment(VFD_SEG_4);
        }
        else {
          clearVfdSegment(VFD_SEG_4);  
        }
      }
    }
    writeDigitToVfd(VFD_SEG_6, value % 10, false);
    if (value / 10 > 0) {
      writeDigitToVfd(VFD_SEG_5, value / 10, false);
    }
    else {
      if (value >= offset) {
        clearVfdSegment(VFD_SEG_5);
      }
     
    }
  }
  writeCharToVfd(VFD_SEG_3, symbol3);
  writeCharToVfd(VFD_SEG_2, symbol2);
  writeCharToVfd(VFD_SEG_1, symbol1);
  */
}

void hideAudioParam() {
  audioTimerId = 0;
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

//      saveToEEPROM(SAVE_MODE);
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

      updateAudioParam();
    }
  }
}

void updateAudioParam() {
  setAudioVolume();
//  saveToEEPROM(SAVE_VOL);

  showAudioParam();
  if (audioTimerId > 0) {
    timer.restartTimer(audioTimerId);
  }
  else {
    audioTimerId = timer.setTimeout(AUDIO_TIMEOUT, hideAudioParam);
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
//      saveToEEPROM(SAVE_MP3_TRACK_LEN);
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
      isLoadComplete = true;
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

  clearVfd();
  writeCharToVfd(VFD_SEG_5, 'O');
  writeCharToVfd(VFD_SEG_4, 'L');
  writeCharToVfd(VFD_SEG_3, 'L');
  writeCharToVfd(VFD_SEG_2, 'E');
  writeCharToVfd(VFD_SEG_1, 'H');
  delay(2000);
  clearVfd();
}

void powerOff() {
  Serial.println("POWER 0");

  powerStatus = false;

  volumeMute = true;
  setAudioVolume();
  sendMute();

  clearVfd();
  writeCharToVfd(VFD_SEG_3, 'E');
  writeCharToVfd(VFD_SEG_2, 'Y');
  writeCharToVfd(VFD_SEG_1, 'B');
  delay(2000);

  dispMode = DISP_MODE_CLOCK;
  setDisplayMode();
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
      //saveToEEPROM(SAVE_NET_PRESET);
      //saveToEEPROM(SAVE_NET_PRESET_LEN);
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

      setFMPreset();
//      saveToEEPROM(SAVE_FM_PRESET);
//      saveToEEPROM(SAVE_FM_PRESET_LEN);
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

//        saveToEEPROM(SAVE_FM_PRESET);
      }
    }
    else if (mode == MODE_NET) {
      if (number > 0 && number <= netPresetsLen) {
        currentNetPreset = number;

       // saveToEEPROM(SAVE_NET_PRESET);
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

  if (funcTimerId > 0) {
    timer.restartTimer(funcTimerId);
  }
  else {
    funcTimerId = timer.setTimeout(FUNC_TIMEOUT, restoreLastDispMode);
  }
}

void restoreLastDispMode() {
  funcTimerId = 0;
  dispMode = lastDispMode;
  setDisplayMode();
}

void processDate() {
  char *data[6] = {serialNextParam(), serialNextParam(), serialNextParam(), serialNextParam(), serialNextParam(), serialNextParam()};
//6~2014~10~8~0~33~0
  if ((data[0] != NULL) && (data[1] != NULL) && (data[2] != NULL) && (data[3] != NULL) && (data[4] != NULL) && (data[5] != NULL)) {
    rtc.stopRTC();
    rtc.setTime(atol(data[3]), atol(data[4]), atol(data[5]));
    rtc.setDate(atol(data[2]), atol(data[1]), atol(data[0]));
    rtc.startRTC();
  }
}

void processSleepTimer() {
  char *data[2] = {serialNextParam(), serialNextParam()};

  if (data[0] != NULL && data[1] != NULL) {
    sleepTimerTime = atol(data[0]);
    sleepTimerOn = atol(data[1]);

//    saveToEEPROM(SAVE_SLEEP);
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
//    saveToEEPROM(SAVE_ALARM1);

    showAlarm1();
  }
}

void processAlarm2() {
  if (getAlarmData(2)) {
   // saveToEEPROM(SAVE_ALARM2);
    showAlarm2();
  }
}

boolean getAlarmData(byte alarmNum) {
  //mode preset vol timeout hour minute days on
  char *data[6] = {serialNextParam(), serialNextParam(), serialNextParam(), serialNextParam(), serialNextParam(), serialNextParam()};

  char *on = serialNextParam();
  char *days = serialNextParam();
  char *param;

  if ((on != NULL) && (days != NULL) && (data[0] != NULL) && (data[1] != NULL) && (data[2] != NULL)
    && (data[3] != NULL) && (data[4] != NULL) && (data[0] != NULL))  {

    if (alarmNum == 1) {
      alarmParams1[0] = atol(data[0]);
      alarmParams1[1] = atol(data[1]);
      alarmParams1[2] = atol(data[2]);
      alarmParams1[3] = atol(data[3]);
      alarmParams1[4] = atol(data[4]);
      alarmParams1[5] = atol(data[5]);

      alarmOn1 = atol(on);

      alarmDays1[0] = atol(days);
      for (byte i = 1; i < 7; i++) {
        param = serialNextParam();
        alarmDays1[i] = atol(param);
      }
    }
    else {
      alarmParams2[0] = atol(data[0]);
      alarmParams2[1] = atol(data[1]);
      alarmParams2[2] = atol(data[2]);
      alarmParams2[3] = atol(data[3]);
      alarmParams2[4] = atol(data[4]);
      alarmParams2[5] = atol(data[5]);

      alarmOn2 = atol(on);

      alarmDays2[0] = atol(days);
      for (byte i = 1; i < 7; i++) {
        param = serialNextParam();
        alarmDays2[i] = atol(param);
      }
    }
    return true;
  }
  return false;
}

void processDisplayToLed() {
  int number;
  char *param;

  param = serialNextParam();

  if (param != NULL) {
    if (mode == MODE_FM) {
//        eepromWriteInt(EEPROM_FM_PRESET_FREQ, atol(param));
        setFMPreset();
    }
    setDisplayMode();
  }
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
    irRecv.resume();
  }
  if (lastIrValue !=  irValue) {
    lastIrValue =  irValue;
    if (powerStatus) {
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
          changeAudioParamValue(true);
          break;
        case IR_VOL_DOWN:
        case IR_VOL_DOWN2:
        case IR_DOWN:
        case IR_DOWN2:
          changeAudioParamValue(false);
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
       case IR_POWER_ON:
       case IR_POWER_OFF:
          togglePower();
          break;
      }
    }
    else {
      if (lastIrValue == IR_POWER_ON || lastIrValue == IR_POWER_OFF) {
        togglePower();
      }
    }
    delay(200);
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
//  saveToEEPROM(SAVE_MODE);

  setAudioMode();
  showFuncMode();

  sendMode();
}

void changeDisplayMode() {
  dispMode++;
  dispMode = (dispMode >= 7) ? 1 : dispMode;
  setDisplayMode();
}

void changeAudioParamValue(boolean isUpDir) {
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
      
  updateAudioParam();
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
//    saveToEEPROM(SAVE_FM_PRESET);
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
//    saveToEEPROM(SAVE_NET_PRESET);
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
//      saveToEEPROM(SAVE_ALARM1);
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
      Serial.print(alarmDays1[0]);
      Serial.print(" ");
      Serial.print(alarmDays1[1]);
      Serial.print(" ");
      Serial.print(alarmDays1[2]);
      Serial.print(" ");
      Serial.print(alarmDays1[3]);
      Serial.print(" ");
      Serial.print(alarmDays1[4]);
      Serial.print(" ");
      Serial.print(alarmDays1[5]);
      Serial.print(" ");
      Serial.println(alarmDays1[6]);

      break;
    case DISP_MODE_ALARM2:
      alarmOn2 = !alarmOn2;
//      saveToEEPROM(SAVE_ALARM2);
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
      Serial.print(alarmDays2[0]);
      Serial.print(" ");
      Serial.print(alarmDays2[1]);
      Serial.print(" ");
      Serial.print(alarmDays2[2]);
      Serial.print(" ");
      Serial.print(alarmDays2[3]);
      Serial.print(" ");
      Serial.print(alarmDays2[4]);
      Serial.print(" ");
      Serial.print(alarmDays2[5]);
      Serial.print(" ");
      Serial.println(alarmDays2[6]);

      break;
    case DISP_MODE_SLEEP:
      sleepTimerOn = !sleepTimerOn;
     // saveToEEPROM(SAVE_SLEEP);
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

//  saveToEEPROM(SAVE_SLEEP);
  showSleepTimer();
}

void readKeys() {
  int keypress = 0;
  char data;
  char keyData;

  SPI.beginTransaction(ptSettings);
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
    Serial.println(keyData, HEX);
    processKeys(keyData);
  }
}

void processKeys(byte buttonState) {
  switch (buttonState) {
    case BUTTON_POWER:
      togglePower();
      break;
    case BUTTON_VOLUME_DOWN:
      changeAudioParamValue(false);
      break;
    case BUTTON_VOLUME_UP:
      changeAudioParamValue(true);
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

void setupRTC() {
  rtc.stopRTC();
  rtc.setTime(0,0,0);
  rtc.setDate(1,1,2016);
  rtc.startRTC();
}

void setup() {
  Serial.begin(9600);
  //Wire.begin();
  SPI.begin();

  setupRTC();
//  setupRFM();
  //setupAudio();
  //setupRadio();

  //setupSerialCommand();
 // setupIr();

  setupVfd();
  clearVfd();

  setupTimers();
  disableTimers();
  setDisplayMode();

 // setAudioMode();
  //setAudioVolume();
}

void loop() {
 // readSerial();
 // processIR();
 // readKeys();
  timer.run();
//  rfmReceive();
}
