#include "SPI.h"
#include "SimpleTimer.h"
#include "Wire.h"
#include "RTClib.h"
#include "dht.h"
#include "IRremote.h"
#include "OLedI2C.h"
#include "RF24.h"

#define TDA7313_ADDR            0x44

#define TDA7313_MAXVOL          63
#define TDA7313_MUTEVOL         0

#define EQ_OFFSET               7
#define MAX_EQ                  14

#define BALANCE_OFFSET          15
#define MAX_BALANCE             31

#define TDA7313_SOURCE_NET      0
#define TDA7313_SOURCE_FM       1
#define TDA7313_SOURCE_LINEIN   2

#define TDA7313_GAIN_1          0
#define TDA7313_GAIN_2          1
#define TDA7313_GAIN_3          2
#define TDA7313_GAIN_4          3

#define TDA7313_VOL_REG         0x00 //00000000
#define TDA7313_L_ATT_REG       0x80 //10000000
#define TDA7313_R_ATT_REG       0xA0 //10100000
#define TDA7313_BASS_REG        0x60 //01100000
#define TDA7313_TREBLE_REG      0x70 //01110000
#define TDA7313_SWITCH_REG      0x40 //01000000

uint8_t tdaAudioSwitchReg = TDA7313_SWITCH_REG;

#define RFM_CE_PIN              8
#define RFM_CSN_PIN             10

#define PT_DIN_PIN              6
#define PT_CLK_PIN              5
#define PT_STB_PIN              4

#define KEYS1_PIN               A2
#define KEYS2_PIN               A0

#define DHT22_PIN 3
#define RECV_PIN 2
#define AMP_POWER_PIN 7
#define SPECTRUM_ENABLE_PIN A2
#define SPECTRUM_BRIGHTNESS_PIN 8
//#define AMBIENT_LIGHT_SENSOR_PIN A2

#define EEPROM_ADDRESS 0x57

#define VFD_SEGMENTS 7

#define VFD_SEG_0 0
#define VFD_SEG_1 3
#define VFD_SEG_2 6
#define VFD_SEG_3 9
#define VFD_SEG_4 12
#define VFD_SEG_5 15
#define VFD_SEG_6 18

unsigned long vfdSignRegister = 0b000000000000000000000000000000000;

const int RDA5807_ADDRESS_SEQ = 0x10;
const int RDA5807_ADDRESS_RANDOM = 0x11;

#define RDA5807_REG_RA 0x0A
#define RDA5807_REG_RA_STEREO 0x0400
#define RDA5807_REG_RA_RDS 0x8000
#define RDA5807_REG_RB 0x0B
#define RDA5807_REG_RDSA 0x0C
#define RDA5807_REG_RDSB 0x0D
#define RDA5807_REG_RDSC 0x0E
#define RDA5807_REG_RDSD 0x0F

char RDA5807_PSName1[10];
char RDA5807_PSName2[10];
char RDA5807_programServiceName[10];
char RDA5807_RDSText[64 + 2];
uint8_t RDA5807_textAB, RDA5807_last_textAB, RDA5807_lastTextIDX;

const byte BUTTON_POWER = 1;
const byte BUTTON_DISPLAY = 2;
const byte BUTTON_MODE = 3;
const byte BUTTON_PREV = 4;
const byte BUTTON_STOP = 5;
const byte BUTTON_PLAY = 6;
const byte BUTTON_NEXT = 7;
const byte BUTTON_AUDIO = 8;
const byte BUTTON_VOLUME_DOWN = 9;
const byte BUTTON_VOLUME_UP = 10;

const int BUTTON_POWER_LOW = 0;
const int BUTTON_POWER_HIGH = 60;
const int BUTTON_DISPLAY_LOW = 100;
const int BUTTON_DISPLAY_HIGH = 150;
const int BUTTON_MODE_LOW = 190;
const int BUTTON_MODE_HIGH = 260;
const int BUTTON_PREV_LOW = 290;
const int BUTTON_PREV_HIGH = 370;
const int BUTTON_STOP_LOW = 400;
const int BUTTON_STOP_HIGH = 470;
const int BUTTON_PLAY_LOW = 500;
const int BUTTON_PLAY_HIGH = 545;
const int BUTTON_NEXT_LOW = 580;
const int BUTTON_NEXT_HIGH = 620;
const int BUTTON_AUDIO_LOW = 640;
const int BUTTON_AUDIO_HIGH = 700;

const int BUTTON_VOLUME_UP_LOW = 0;
const int BUTTON_VOLUME_UP_HIGH = 60;
const int BUTTON_VOLUME_DOWN_LOW = 100;
const int BUTTON_VOLUME_DOWN_HIGH = 400;

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
const byte DISP_MODE_TEMP = 6;
const byte DISP_MODE_AUDIO = 7;

const byte AUDIO_PARAM_VOLUME = 1;
const byte AUDIO_PARAM_BALANCE = 2;
const byte AUDIO_PARAM_BASS = 3;
const byte AUDIO_PARAM_TREBLE = 4;

const byte DEFAULT_VOLUME = 16;
const byte DEFAULT_BALANCE = BALANCE_OFFSET;
const byte DEFAULT_BASS = EQ_OFFSET;
const byte DEFAULT_TREBLE = EQ_OFFSET;

const byte MAX_VOLUME = 31;
const int VOLUME_FADE_DELAY = 5000;
const int AUDIO_TIMEOUT = 2000;
const int FUNC_TIMEOUT = 2000;
const int TIME_INTERVAL = 1000;
const int TEMP_INTERVAL = 30000;
const unsigned int ALARM_INTERVAL = 60000;

const byte SLEEP_TIMER_STEP = 15;
const byte MIN_SLEEP_TIMER = 15;
const byte MAX_SLEEP_TIMER = 240;
const byte SLEEP_TIMER_DEFAULT = 60;

const int OLED_TIMEOUT = 15000;

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

const byte SAVE_MODE = 1;
const byte SAVE_VOL = 3;
const byte SAVE_BAL = 14;
const byte SAVE_BASS = 15;
const byte SAVE_TREBLE = 16;
const byte SAVE_FM_PRESET = 5;
const byte SAVE_NET_PRESET = 6;
const byte SAVE_ALARM1 = 7;
const byte SAVE_ALARM2 = 8;
const byte SAVE_SLEEP = 9;
const byte SAVE_NET_PRESET_LEN = 10;
const byte SAVE_FM_PRESET_LEN = 11;
const byte SAVE_MP3_TRACK_LEN = 13;

const byte EEPROM_MODE = 0;
const byte EEPROM_VOL = 1;
const byte EEPROM_BAL = 50;
const byte EEPROM_BASS = 52;
const byte EEPROM_TREBLE = 54;

const byte EEPROM_FM_PRESET = 2;
const byte EEPROM_NET_PRESET = 56;
const byte EEPROM_SLEEP_TIMER = 5;

const byte EEPROM_ALARM1_ON = 6;
const byte EEPROM_ALARM1[13] = {7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19};

const byte EEPROM_ALARM2_ON = 20;
const byte EEPROM_ALARM2[13] = {21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33};

const byte EEPROM_NET_PRESET_LEN = 34;
const byte EEPROM_FM_PRESET_LEN = 36;
const byte EEPROM_FM_PRESET_FREQ = 40;
const byte EEPROM_MP3_TRACK_LEN = 44;

const byte MAX_FM_PRESETS = 30;
const byte MAX_NET_PRESETS = 9999;
const int MAX_MP3_TRACKS = 9999;
const int FM_MIN_FREQUENCY = 875;

const byte OLED_ROW_1 = 0;
const byte OLED_ROW_2 = 1;
const byte OLED_ROW_SYMBOLS = 16;
const byte OLED_SCROLL_DELAY = 2000; //in ms
const byte MAX_OLED_SYMBOLS = 35;
char oledBuffer[MAX_OLED_SYMBOLS];

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
const byte SERIAL_DISP_OLED = 11;
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

unsigned long lastIrValue = 0;

byte lastButtonState = LOW;
unsigned long lastButtonDebounceTime = 0;
const unsigned int BUTTON_DEBOUNCE_DELAY = 50;
byte buttonState;

byte lastButtonState2 = LOW;
unsigned long lastButtonDebounceTime2 = 0;
byte buttonState2;

byte mode = MODE_NET;
byte lastMode = MODE_NET;
byte dispMode = DISP_MODE_CLOCK;
byte lastDispMode = DISP_MODE_CLOCK;

byte currentVolume = DEFAULT_VOLUME;
byte currentBalance = DEFAULT_BALANCE;
byte currentBass = DEFAULT_BASS;
byte currentTreble = DEFAULT_TREBLE;

byte audioParamMode = AUDIO_PARAM_VOLUME;

boolean volumeMute = false;
byte maxFadeVolume;
const int FADE_TIMEOUT = 3000;

unsigned int audioTimerId = 0;
unsigned int funcTimerId = 0;
unsigned int timeTimerId = 0;
unsigned int tempTimerId = 0;
unsigned int oledTimerId = 0;

byte currentTime[4] = {1, 0, 0, 0};
boolean alarmOn = false;

boolean alarmOn1 = false;
byte alarmDays1[7] = {1, 2, 3, 4, 5, NULL, NULL};
byte alarmParams1[6] = {1, 1, 8, 60, 9, 0};  //[mode, preset, vol, timeout, hour, minute]

boolean alarmOn2 = false;
byte alarmDays2[7] = {NULL, NULL, NULL, NULL, NULL, 6, 7};
byte alarmParams2[6] = {2, 1, 8, 30, 10, 0};  //[mode, preset, vol, timeout, hour, minute]

byte sleepTimerTime = SLEEP_TIMER_DEFAULT;
boolean sleepTimerOn = false;
byte currentSleepTimerTime = 0;

byte currentFmPreset = 1;
byte fmPresetsLen = 1;

int currentNetPreset = 1;
int netPresetsLen = 1;

int currentMp3Track = 1;
int mp3TracksLen = 1;

unsigned int RDA5807_reg[32];

boolean powerStatus = false;

byte oledContrast = 0; //0-255
int rfmBuffer[3];
int rfmTemp;
int rfmHumidity;
int rfmBatteryVoltage;

boolean isLoadComplete = false;
boolean isSkipSerialCommand = false;

const byte SENSOR_BATTERY_OFFSET = 0;
const byte LOW_SENSOR_BATTERY_VOLTAGE = 36;

#define AMBIENT_LIGHT_THRESHOLD 600

int ambientLightLevel = 0;

const byte LED_LOW_BRIGHTNESS = 2;
const byte LED_HIGH_BRIGHTNESS = 16;

byte ledBrightness = LED_LOW_BRIGHTNESS;

const byte OLED_LOW_CONTRAST = 0;
const byte OLED_HIGH_CONTRAST = 100;

byte currOledScrollPos = 0;
char currOledScrollMessage[40];
byte currOledScrollRow = 0;
int oledScrollPrevTime = 0;

unsigned long vfdDigitMap[10] = {
  0x6888A, 0x8080, 0x60F82, 0x68782, 0x8788, 0x6870A, 0x68F0A, 0x8082,
  0x68F8A, 0x6878A
};

unsigned long vfdAlphaMap[26] = {
  0x98F8A, 0x78F8B, 0x6080A, 0x7888B, 0xF0F0F, 0x10F0F, 0x68E0A, 0x98F8D,
  0x62222, 0x68884, 0x94F4D, 0xF0809, 0x98ADD, 0x9CA9D, 0x6888A, 0x10F8B,
  0x6CF8A, 0x94F8b, 0x6870A, 0x42227, 0x6888D, 0x11A4D, 0x9DA8D, 0x95255,
  0x42255, 0xF1247
};

SimpleTimer timer;
RTC_DS1307 rtc;

dht DHT;

IRrecv irRecv(RECV_PIN);
decode_results irDecodeResults;

OLedI2C oled;

RF24 rfm(RFM_CE_PIN, RFM_CSN_PIN);

void readKeys() {
  unsigned int buttonValue = analogRead(KEYS1_PIN);
  unsigned int buttonValue2 = analogRead(KEYS2_PIN);

  //Serial.print("Key value:");
  //Serial.println(buttonValue);

  //delay(300);

  byte tmpButtonState = LOW;
  byte tmpButtonState2 = LOW;

  if (buttonValue >= BUTTON_POWER_LOW && buttonValue < BUTTON_POWER_HIGH) {
    tmpButtonState = BUTTON_POWER;
  }
  else if (buttonValue >= BUTTON_DISPLAY_LOW && buttonValue < BUTTON_DISPLAY_HIGH) {
    tmpButtonState = BUTTON_DISPLAY;
  }
  else if (buttonValue > BUTTON_MODE_LOW && buttonValue < BUTTON_MODE_HIGH) {
    tmpButtonState = BUTTON_MODE;
  }
  else if (buttonValue > BUTTON_PREV_LOW && buttonValue < BUTTON_PREV_HIGH) {
    tmpButtonState = BUTTON_PREV;
  }
  else if (buttonValue > BUTTON_STOP_LOW && buttonValue < BUTTON_STOP_HIGH) {
    tmpButtonState = BUTTON_STOP;
  }
  else if (buttonValue > BUTTON_PLAY_LOW && buttonValue < BUTTON_PLAY_HIGH) {
    tmpButtonState = BUTTON_PLAY;
  }
  else if (buttonValue > BUTTON_NEXT_LOW && buttonValue < BUTTON_NEXT_HIGH) {
    tmpButtonState = BUTTON_NEXT;
  }
  else if (buttonValue >= BUTTON_AUDIO_LOW && buttonValue < BUTTON_AUDIO_HIGH) {
    tmpButtonState = BUTTON_AUDIO;
  }

  if (buttonValue2 >= BUTTON_VOLUME_UP_LOW && buttonValue2 < BUTTON_VOLUME_UP_HIGH) {
    tmpButtonState2 = BUTTON_VOLUME_UP;
  }
  else if (buttonValue2 >= BUTTON_VOLUME_DOWN_LOW && buttonValue2 < BUTTON_VOLUME_DOWN_HIGH) {
    tmpButtonState2 = BUTTON_VOLUME_DOWN;
  }

  if (tmpButtonState != lastButtonState) {
    lastButtonDebounceTime = millis();
  }
  if (tmpButtonState2 != lastButtonState2) {
    lastButtonDebounceTime2 = millis();
  }

  if ((millis() - lastButtonDebounceTime) > BUTTON_DEBOUNCE_DELAY) {
    buttonState = tmpButtonState;
    if (buttonState > 0) {
      //Serial.print("Key:");
      //Serial.println(buttonState);
      processKeys(buttonState);
      delay(300);
    }
  }
  lastButtonState = tmpButtonState;

  if ((millis() - lastButtonDebounceTime2) > BUTTON_DEBOUNCE_DELAY) {
    buttonState2 = tmpButtonState2;
    if (buttonState2 > 0) {
      // Serial.print("Key:");
      // Serial.println(buttonState2);
      processKeys(buttonState2);
      delay(300);
    }
  }
  lastButtonState2 = tmpButtonState2;
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
    case BUTTON_AUDIO:
      changeAudioParam();
      break;
  }
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
    saveToEEPROM(SAVE_FM_PRESET);
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
    saveToEEPROM(SAVE_NET_PRESET);
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

void changeMode() {
  mode++;
  mode = (mode >= 6) ? 1 : mode;
  saveToEEPROM(SAVE_MODE);

  setAudioMode();
  showFuncMode();

  sendMode();
}

void changeAudioParam() {
  audioParamMode++;
  audioParamMode = (audioParamMode >= 5) ? 1 : audioParamMode;
  hideOled();
  updateAudioParam();
}

void changeDisplayMode() {
  dispMode++;
  dispMode = (dispMode >= 7) ? 1 : dispMode;
  hideOled();
  setDisplayMode();
}

void changeAudioParamValue(boolean isUpDir) {
  switch (audioParamMode) {
    case AUDIO_PARAM_VOLUME:
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
      break;
    case AUDIO_PARAM_BALANCE:
      if (isUpDir) {
        if (currentBalance < MAX_BALANCE) {
          currentBalance++;
        }
      }
      else {
        if (currentBalance > 0) {
          currentBalance--;
        }
      }
      break;
    case AUDIO_PARAM_BASS:
      if (isUpDir) {
        if (currentBass < MAX_EQ) {
          currentBass++;
        }
      }
      else {
        if (currentBass > 0) {
          currentBass--;
        }
      }
      break;
    case AUDIO_PARAM_TREBLE:
      if (isUpDir) {
        if (currentTreble < MAX_EQ) {
          currentTreble++;
        }
      }
      else {
        if (currentTreble > 0) {
          currentTreble--;
        }
      }
      break;
  }

  updateAudioParam();
}

void updateAudioParam() {
  switch (audioParamMode) {
    case AUDIO_PARAM_VOLUME:
      setAudioVolume();
      saveToEEPROM(SAVE_VOL);
      break;
    case AUDIO_PARAM_BALANCE:
      setAudioBalance();
      saveToEEPROM(SAVE_BAL);
      break;
    case AUDIO_PARAM_BASS:
      setAudioBass();
      saveToEEPROM(SAVE_BASS);
      break;
    case AUDIO_PARAM_TREBLE:
      setAudioTreble();
      saveToEEPROM(SAVE_TREBLE);
      break;
  }

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

  switch (audioParamMode) {
    case AUDIO_PARAM_VOLUME:
      if (volumeMute) {
        displayMute();
      }  
      else {  
        displayAudioParam(volumeMute ? -2 : currentVolume, 0, MAX_VOLUME, -1, 'V', 'O', 'L');
      }
      break;
    case AUDIO_PARAM_BALANCE:
      displayAudioParam(currentBalance, 0, MAX_BALANCE, BALANCE_OFFSET, 'B', 'A', 'L');
      break;
    case AUDIO_PARAM_BASS:
      displayAudioParam(currentBass, 0, MAX_EQ, EQ_OFFSET, 'B', 'A', 'S');
      break;
    case AUDIO_PARAM_TREBLE:
      displayAudioParam(currentTreble, 0, MAX_EQ, EQ_OFFSET, 'T', 'R', 'E');
      break;
  }
}

void displayMute() {
  writeCharToVfd(VFD_SEG_4, 'E');
  writeCharToVfd(VFD_SEG_3, 'T');
  writeCharToVfd(VFD_SEG_2, 'U');
  writeCharToVfd(VFD_SEG_1, 'M');
}

void displayAudioParam(int value, int minValue, int maxValue, int offset, byte symbol1, byte symbol2, byte symbol3) {
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
      else {
        if (origValue < offset) {
          writeMinusVfdSegment(VFD_SEG_5);
        }
        else {
          clearVfdSegment(VFD_SEG_5); 
        }
      }
    }
  }
  writeCharToVfd(VFD_SEG_3, symbol3);
  writeCharToVfd(VFD_SEG_2, symbol2);
  writeCharToVfd(VFD_SEG_1, symbol1);
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

void ptWrite(unsigned char data) {
  for (unsigned char i = 0; i < 8; i++) {
    digitalWrite(PT_CLK_PIN, LOW);
    if ((data & 0x01) == 0x01) {
      digitalWrite(PT_DIN_PIN, HIGH);
    }
    else {
      digitalWrite(PT_DIN_PIN, LOW);
    }
    data >>= 1;
    delayMicroseconds(1);
    digitalWrite(PT_CLK_PIN, HIGH);
    delayMicroseconds(1);
  }
}

void writeCharToVfd(byte address, byte value) {
  writeSymbolToVfd(address, vfdAlphaMap[value - 65]);
}

void writeDigitToVfd(byte address, byte value, boolean decimal) {
  unsigned long data = vfdDigitMap[value];

  if (decimal) {
    bitSet(data, 20);
  }
  writeSymbolToVfd(address, data);
}

void writeSymbolToVfd(byte address, unsigned long data) {
  ptWriteCommand(0x40);

  digitalWrite(PT_STB_PIN, LOW);
  delayMicroseconds(1);

  ptWrite(0xC0 + address);
  ptWrite((unsigned char)(data & 0x00ff));
  ptWrite((unsigned char)((data >> 8) & 0x00ff));
  ptWrite((unsigned char)((data >> 16) & 0x00ff));

  delayMicroseconds(1);
  digitalWrite(PT_STB_PIN, HIGH);
}

void showAlarmOnVfd(boolean on) {
  if (on) {
    bitSet(vfdSignRegister, 10);
  }
  else {
    bitClear(vfdSignRegister, 10);
  }
  writeSymbolToVfd(VFD_SEG_0, vfdSignRegister);
}

void setupVfd() {
  pinMode(PT_DIN_PIN, OUTPUT);
  pinMode(PT_CLK_PIN, OUTPUT);
  pinMode(PT_STB_PIN, OUTPUT);

  ptWriteCommand(0b00000011); // 7/21 Digit mode

  setVfdBrightness();
}

void setVfdBrightness() {
  //ledBrightness
  clearVfd();

  //ptWriteCommand(0b10001001);// 2/16 Dim
  ptWriteCommand(0b10001111);// 14/16 Dim
}

void ptWriteCommand(unsigned char command) {
  digitalWrite(PT_STB_PIN, LOW);
  delayMicroseconds(1);

  ptWrite(command);

  digitalWrite(PT_STB_PIN, HIGH);
  delayMicroseconds(1);
}

void clearVfd() {
  unsigned char i;
  for (i = 0; i < VFD_SEGMENTS; i++) {
    writeSymbolToVfd(i * 3, 0x0000);
  }
}

void clearVfdSegment(byte segment) {
  writeSymbolToVfd(segment, 0x0000);
}

void writeMinusVfdSegment(byte segment) {
  writeSymbolToVfd(segment, 0x700);
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
    case DISP_MODE_TEMP:
      showTemp();
      timer.enable(tempTimerId);
      break;
  }
}

void clearOledBuffer() {
  for (int i = 0; i < MAX_OLED_SYMBOLS; i++) {
    oledBuffer[i] = '\0';
  }
}

void showModeValue() {
  unsigned int currentFrequency;
  byte digit;

  clearVfd();
  switch (mode) {
    case MODE_FM:
      currentFrequency = loadFMPreset();

      writeDigitToVfd(VFD_SEG_6, 0, false);
      writeDigitToVfd(VFD_SEG_5, currentFrequency % 10, true);

      writeDigitToVfd(VFD_SEG_4, (currentFrequency / 10) % 10, false);
      writeDigitToVfd(VFD_SEG_3, (currentFrequency / 100) % 10, false);

      digit = (currentFrequency / 1000) % 10;
      if (digit  > 0) {
        writeDigitToVfd(VFD_SEG_2, digit, false);
      }
      writeCharToVfd(VFD_SEG_1, 'F');

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

void sendDataToOled(char *value, byte row) {
  oled.lcdOn();
  oled.setContrast(oledContrast);
  if (strlen(value) > OLED_ROW_SYMBOLS) {
    scheduleScrollString(value, row);
  }
  else {
    oled.sendString(value, 0, row);
  }
}

void scheduleScrollString(char *value, byte row) {
  strncpy(currOledScrollMessage, value, sizeof(currOledScrollMessage));

  currOledScrollRow = row;
  currOledScrollPos = 0;
}

void scrollOledString() {
  if (currOledScrollPos + OLED_ROW_SYMBOLS >= strlen(currOledScrollMessage) + 1) {
    return;
  }
  if (millis() % OLED_SCROLL_DELAY == 0 && oledScrollPrevTime != millis()) {
    oledScrollPrevTime =  millis();

    char oledBuffer[OLED_ROW_SYMBOLS];
    int tempPos = currOledScrollPos;
    if(tempPos < 0) {
      tempPos = -(tempPos);
    }
    memcpy(&oledBuffer[0], &currOledScrollMessage[tempPos], OLED_ROW_SYMBOLS);
    oled.sendString(oledBuffer, 0, currOledScrollRow);
    currOledScrollPos += 1;
  }
}

void setupTimers() {
  timeTimerId = timer.setInterval(TIME_INTERVAL, showTime);
  tempTimerId = timer.setInterval(TEMP_INTERVAL, showTemp);
  timer.setInterval(TIME_INTERVAL, setTime);
  timer.setInterval(ALARM_INTERVAL, checkAlarms);
}

void disableTimers() {
  timer.disable(timeTimerId);
  timer.disable(tempTimerId);
}

void setTime() {
  DateTime now = rtc.now();

  currentTime[0] = now.dayOfWeek();
  currentTime[1] = now.hour();
  currentTime[2] = now.minute();
  currentTime[3] = now.second();

  //readAmbientLightSensor(checkBattery());
}

void showTime() {
  //  if (!isLoadComplete) {
  //    writeDigitToVfd(VFD_SEG_4, 'D');
  //    writeDigitToVfd(VFD_SEG_3, 'A');
  //    writeDigitToVfd(VFD_SEG_2, 'O');
  //    writeDigitToVfd(VFD_SEG_1, 'L');
  //    return;
  //  }
  clearVfdSegment(VFD_SEG_6);
  clearVfdSegment(VFD_SEG_5);
  writeDigitToVfd(VFD_SEG_4, currentTime[2] % 10, false);
  writeDigitToVfd(VFD_SEG_3, currentTime[2] / 10, false);
  writeDigitToVfd(VFD_SEG_2, currentTime[1] % 10, (currentTime[3] % 10) % 2);
  writeDigitToVfd(VFD_SEG_1, currentTime[1] / 10, false);
}

void showTemp() {
  int status = DHT.read(DHT22_PIN);
  if (status == DHTLIB_OK) {
    byte intTemp = (byte)DHT.temperature;
    byte intHumidity = (byte)DHT.humidity;

    writeCharToVfd(VFD_SEG_3, 'C');
    writeDigitToVfd(VFD_SEG_2, intTemp % 10, false);
    writeDigitToVfd(VFD_SEG_1, intTemp / 10, false);

    oled.clearLcd();

    char oledBuffer2[16];
  
    sprintf(oledBuffer2, "%d%%", intHumidity);
    sendDataToOled(oledBuffer2, OLED_ROW_1);
  
    if (rfmTemp) {
      if (rfmBatteryVoltage < LOW_SENSOR_BATTERY_VOLTAGE) {
        char oledBuffer2[26] = { 129, 128, 146, 128, 144, 133, 159, ' ', 132, 128, 146, 151, 136, 138, 128, ' ', 144, 128, 135, 144, 159, 134, 133, 141, 128, '\0' };
        sendDataToOled(oledBuffer2, OLED_ROW_2);
      }
      else {
        char oledBuffer2[16];
        sprintf(oledBuffer2, "%dC %d%% %d.%dV", rfmTemp, rfmHumidity, rfmBatteryVoltage / 10, rfmBatteryVoltage % 10);
        sendDataToOled(oledBuffer2, OLED_ROW_2);
      }
    }
    else {
      char oledBuffer2[19] = { 141, 133, 146, ' ', 132, 128, 141, 141, 155, 149, '\0' };
      sendDataToOled(oledBuffer2, OLED_ROW_2);
    }
    oledTimerId = 0;
    setOledTimeOut();
  }
}

void showAlarm1() {
  if (alarmOn1) {
    writeCharToVfd(VFD_SEG_6, 'N');
    writeCharToVfd(VFD_SEG_5, 'O');
    clearVfdSegment(VFD_SEG_4);
  }
  else {
    writeCharToVfd(VFD_SEG_6, 'F');
    writeCharToVfd(VFD_SEG_5, 'F');
    writeCharToVfd(VFD_SEG_4, 'O');
  }
  writeDigitToVfd(VFD_SEG_3, 1, false);
  writeCharToVfd(VFD_SEG_2, 'L');
  writeCharToVfd(VFD_SEG_1, 'A');

  showAlarmData(alarmParams1, alarmDays1);
}

void showAlarm2() {
  if (alarmOn2) {
    writeCharToVfd(VFD_SEG_6, 'N');
    writeCharToVfd(VFD_SEG_5, 'O');
    clearVfdSegment(VFD_SEG_4);
  }
  else {
    writeCharToVfd(VFD_SEG_6, 'F');
    writeCharToVfd(VFD_SEG_5, 'F');
    writeCharToVfd(VFD_SEG_4, 'O');
  }
  writeDigitToVfd(VFD_SEG_3, 2, false);
  writeCharToVfd(VFD_SEG_2, 'L');
  writeCharToVfd(VFD_SEG_1, 'A');

  showAlarmData(alarmParams2, alarmDays2);
}

void showAlarmData(byte alarmParams[6], byte alarmDays[7]) {
  clearOledBuffer();

  if ((int)alarmParams[5] < 10) {
    sprintf(oledBuffer, "%d:0%d", alarmParams[4],  alarmParams[5]);
  }
  else {
    sprintf(oledBuffer, "%d:%d", alarmParams[4],  alarmParams[5]);
  }
  oled.clearLcd();
  sendDataToOled(oledBuffer, OLED_ROW_1);
  clearOledBuffer();
  char dayOfWeek[7] = { 49, 50, 51, 52, 53, 54, 55 };

  int offset = 0;

  for (byte i = 0; i < 7; i++) {
    if (alarmDays[i] != NULL) {
      if (offset > 0) {
        oledBuffer[offset++] = ' ';
      }
      oledBuffer[offset++] = dayOfWeek[i];
    }
  }
  sendDataToOled(oledBuffer, OLED_ROW_2);

  setOledTimeOut();
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

  oled.clearLcd();

  clearOledBuffer();

  sprintf(oledBuffer, "%d %c%c%c.", sleepTimerTime, 140, 136, 141);
  sendDataToOled(oledBuffer, OLED_ROW_1);

  if (sleepTimerOn) {
    clearOledBuffer();

    sprintf(oledBuffer, "%c%c%c%c%c%c%c: %d %c%c%c.", 142, 145, 146, 128, 146, 142, 138, currentSleepTimerTime, 140, 136, 141);
    sendDataToOled(oledBuffer, OLED_ROW_2);
  }
  setOledTimeOut();
}

void toggleMute() {
  volumeMute = !volumeMute;
  setAudioVolume();
  sendMute();
}

void sendMute() {
  Serial.print("MUTE ");
  Serial.println(volumeMute);
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

void changeOk() {
  switch (dispMode) {
    case DISP_MODE_ALARM1:
      alarmOn1 = !alarmOn1;
      saveToEEPROM(SAVE_ALARM1);
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
      saveToEEPROM(SAVE_ALARM2);
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
      saveToEEPROM(SAVE_SLEEP);
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

  saveToEEPROM(SAVE_SLEEP);
  showSleepTimer();
}

void setupIr() {
  irRecv.enableIRIn();
  irRecv.blink13(true);
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

void changeModeToSelected() {
  byte number;
  char *param;

  param = serialNextParam();
  if (param != NULL) {
    number = atol(param);
    if (number > 0 && number < 6) {
      mode = number;

      saveToEEPROM(SAVE_MODE);
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

      audioParamMode = AUDIO_PARAM_VOLUME;
      updateAudioParam();
    }
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
      saveToEEPROM(SAVE_MP3_TRACK_LEN);
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
      saveToEEPROM(SAVE_NET_PRESET);
      saveToEEPROM(SAVE_NET_PRESET_LEN);
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
      saveToEEPROM(SAVE_FM_PRESET);
      saveToEEPROM(SAVE_FM_PRESET_LEN);
    }
  }
}

void processDisplayToOled() {
  if (!(dispMode == DISP_MODE_CLOCK || dispMode == DISP_MODE_FUNC)) {
    return;
  }
  char *param;

  param = serialNextParam();

  if (param != NULL) {
    oled.clearLcd();
    sendDataToOled(param, OLED_ROW_1);
    if (mode == MODE_FM) {
      char buffer[16];
      RDA5807_GetRadioInfo(buffer);
      sendDataToOled(buffer, OLED_ROW_2);
    }
    setOledTimeOut();
  }
}

void processDisplayToLed() {
  int number;
  char *param;

  param = serialNextParam();

  if (param != NULL) {
    if (mode == MODE_FM) {
        eepromWriteInt(EEPROM_FM_PRESET_FREQ, atol(param));
        setFMPreset();
    }
    setDisplayMode();
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

        saveToEEPROM(SAVE_FM_PRESET);
      }
    }
    else if (mode == MODE_NET) {
      if (number > 0 && number <= netPresetsLen) {
        currentNetPreset = number;

        saveToEEPROM(SAVE_NET_PRESET);
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

void processDate() {
  char *data[6] = {serialNextParam(), serialNextParam(), serialNextParam(), serialNextParam(), serialNextParam(), serialNextParam()};

  if ((data[0] != NULL) && (data[1] != NULL) && (data[2] != NULL) && (data[3] != NULL) && (data[4] != NULL) && (data[5] != NULL)) {
    rtc.adjust(DateTime(atol(data[0]), atol(data[1]), atol(data[2]), atol(data[3]), atol(data[4]), atol(data[5])));
  }
}

void processSleepTimer() {
  char *data[2] = {serialNextParam(), serialNextParam()};

  if (data[0] != NULL && data[1] != NULL) {
    sleepTimerTime = atol(data[0]);
    sleepTimerOn = atol(data[1]);

    saveToEEPROM(SAVE_SLEEP);
    initSleepTimer();
    showSleepTimer();
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

void processAlarm1() {
  if (getAlarmData(1)) {
    saveToEEPROM(SAVE_ALARM1);

    showAlarm1();
  }
}

void processAlarm2() {
  if (getAlarmData(2)) {
    saveToEEPROM(SAVE_ALARM2);
    showAlarm2();
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

void checkAlarms() {
  unsigned int currentMinute;
  unsigned int sleepMinute;
  //Serial.println("Check Alarms");

  if ((alarmOn1 == true) && (currentTime[1] == alarmParams1[4]) && (currentTime[2] == alarmParams1[5]) && checkAlarmDays(alarmDays1, currentTime[0])) {
    alarmOn = true;
    powerOnWithParams(alarmParams1[0], alarmParams1[1], alarmParams1[2]);
    return;
  }
  if ((alarmOn2 == true) && (currentTime[1] == alarmParams2[4]) && (currentTime[2] == alarmParams2[5]) && checkAlarmDays(alarmDays2, currentTime[0])) {
    alarmOn = true;
    powerOnWithParams(alarmParams2[0], alarmParams2[1], alarmParams2[2]);
    return;
  }
  if (alarmOn == true) {
    currentMinute = currentTime[1] * 60 + currentTime[2];
    if ((currentMinute == (alarmParams1[4] * 60 + alarmParams1[5] + alarmParams1[3])) || (currentMinute == (alarmParams2[4] * 60 + alarmParams2[5] + alarmParams2[3]))) {
      alarmOn = false;
      powerOff();
      return;
    }
  }

  if (powerStatus && sleepTimerOn) {
    currentSleepTimerTime --;
    if (currentSleepTimerTime == 0) {

      resetSleepTimer();

      initSleepTimer();
      showSleepTimer();
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

boolean checkAlarmDays(byte days[7], byte dayOfWeek) {
  byte i;
  for (i = 0; i < 7; i++) {
    if (days[i] != NULL && days[i] == dayOfWeek) {
      return true;
    }
  }
  return false;
}

void powerOnWithParams(byte powerOnMode, byte powerOnPreset, byte powerOnVolume) {
  mode = powerOnMode;
  sendMode();
  if (mode == MODE_FM) {
    currentFmPreset = powerOnPreset;
  }
  else if (mode == MODE_NET) {
    currentNetPreset = powerOnPreset;
  }

  setAudioMode();
  showFuncMode();
  currentVolume = 0;

  powerOnAlarm();
  maxFadeVolume = powerOnVolume;
  fadeVolume();
}

void powerOnAlarm() {
  Serial.println("POWERALARM 1");

  powerOnCommon();
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

  ampPowerOn();

  digitalWrite(SPECTRUM_ENABLE_PIN, HIGH);

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

  ampPowerOff();
  hideOled();

  digitalWrite(SPECTRUM_ENABLE_PIN, LOW);

  clearVfd();
  writeCharToVfd(VFD_SEG_3, 'E');
  writeCharToVfd(VFD_SEG_2, 'Y');
  writeCharToVfd(VFD_SEG_1, 'B');
  delay(2000);

  dispMode = DISP_MODE_CLOCK;
  setDisplayMode();
}

void fadeVolume() {
  currentVolume = 0;
  //  timer.setTimeout(FADE_TIMEOUT, increaseFadeVolume);
}

void increaseFadeVolume() {
  currentVolume++;
  if (currentVolume <= maxFadeVolume) {
    setAudioVolume();
    //        timer.setTimeout(FADE_TIMEOUT, increaseFadeVolume);
  }
}

void saveToEEPROM(byte what) {
  switch (what) {
    case SAVE_MODE:
      eepromWriteByte(EEPROM_MODE, mode);
      break;
    case SAVE_VOL:
      eepromWriteByte(EEPROM_VOL, currentVolume);
      break;
    case SAVE_BAL:
      eepromWriteByte(EEPROM_BAL, currentBalance);
      break;
    case SAVE_BASS:
      eepromWriteByte(EEPROM_BASS, currentBass);
      break;
    case SAVE_TREBLE:
      eepromWriteByte(EEPROM_TREBLE, currentTreble);
      break;
    case SAVE_FM_PRESET:
      eepromWriteByte(EEPROM_FM_PRESET, currentFmPreset);
      break;
    case SAVE_FM_PRESET_LEN:
      eepromWriteByte(EEPROM_FM_PRESET_LEN, fmPresetsLen);
      break;
    case SAVE_NET_PRESET:
      eepromWriteInt(EEPROM_NET_PRESET, currentNetPreset);
      break;
    case SAVE_NET_PRESET_LEN:
      eepromWriteInt(EEPROM_NET_PRESET_LEN, netPresetsLen);
      break;
    case SAVE_MP3_TRACK_LEN:
      eepromWriteInt(EEPROM_MP3_TRACK_LEN, mp3TracksLen);
      break;
    case SAVE_ALARM1:
      eepromWriteByte(EEPROM_ALARM1_ON, alarmOn1 ? 1 : 0);
      eepromWriteByte(EEPROM_ALARM1[0], alarmParams1[0]);
      eepromWriteByte(EEPROM_ALARM1[1], alarmParams1[1]);
      eepromWriteByte(EEPROM_ALARM1[2], alarmParams1[2]);
      eepromWriteByte(EEPROM_ALARM1[3], alarmParams1[3]);
      eepromWriteByte(EEPROM_ALARM1[4], alarmParams1[4]);
      eepromWriteByte(EEPROM_ALARM1[5], alarmParams1[5]);

      eepromWriteByte(EEPROM_ALARM1[6], alarmDays1[0]);
      eepromWriteByte(EEPROM_ALARM1[7], alarmDays1[1]);
      eepromWriteByte(EEPROM_ALARM1[8], alarmDays1[2]);
      eepromWriteByte(EEPROM_ALARM1[9], alarmDays1[3]);
      eepromWriteByte(EEPROM_ALARM1[10], alarmDays1[4]);
      eepromWriteByte(EEPROM_ALARM1[11], alarmDays1[5]);
      eepromWriteByte(EEPROM_ALARM1[12], alarmDays1[6]);
      break;
    case SAVE_ALARM2:
      eepromWriteByte(EEPROM_ALARM2_ON, alarmOn2 ? 1 : 0);
      eepromWriteByte(EEPROM_ALARM2[0], alarmParams2[0]);
      eepromWriteByte(EEPROM_ALARM2[1], alarmParams2[1]);
      eepromWriteByte(EEPROM_ALARM2[2], alarmParams2[2]);
      eepromWriteByte(EEPROM_ALARM2[3], alarmParams2[3]);
      eepromWriteByte(EEPROM_ALARM2[4], alarmParams2[4]);
      eepromWriteByte(EEPROM_ALARM2[5], alarmParams2[5]);

      eepromWriteByte(EEPROM_ALARM2[6], alarmDays2[0]);
      eepromWriteByte(EEPROM_ALARM2[7], alarmDays2[1]);
      eepromWriteByte(EEPROM_ALARM2[8], alarmDays2[2]);
      eepromWriteByte(EEPROM_ALARM2[9], alarmDays2[3]);
      eepromWriteByte(EEPROM_ALARM2[10], alarmDays2[4]);
      eepromWriteByte(EEPROM_ALARM2[11], alarmDays2[5]);
      eepromWriteByte(EEPROM_ALARM2[12], alarmDays2[6]);
      break;
    case SAVE_SLEEP:
      eepromWriteByte(EEPROM_SLEEP_TIMER, sleepTimerTime);
      break;
  }
}

void loadFromEEPROM() {
  mode = eepromGetByteValue(EEPROM_MODE, MODE_NET);
  currentVolume = eepromGetByteValue(EEPROM_VOL, DEFAULT_VOLUME);
  currentBalance = eepromGetByteValue(EEPROM_BAL, DEFAULT_BALANCE);
  currentBass = eepromGetByteValue(EEPROM_BASS, DEFAULT_BASS);
  currentTreble = eepromGetByteValue(EEPROM_TREBLE, DEFAULT_TREBLE);
  currentFmPreset = eepromGetByteValue(EEPROM_FM_PRESET, 1);
  currentNetPreset = eepromGetIntValue(EEPROM_NET_PRESET, 1);
  sleepTimerTime = eepromGetByteValue(EEPROM_SLEEP_TIMER, SLEEP_TIMER_DEFAULT);

  alarmOn1 = eepromGetBooleanValue(EEPROM_ALARM1_ON, false);

  alarmParams1[0] = eepromGetByteValue(EEPROM_ALARM1[0], 1);
  alarmParams1[1] = eepromGetByteValue(EEPROM_ALARM1[1], 1);
  alarmParams1[2] = eepromGetByteValue(EEPROM_ALARM1[2], 8);
  alarmParams1[3] = eepromGetByteValue(EEPROM_ALARM1[3], 60);
  alarmParams1[4] = eepromGetByteValue(EEPROM_ALARM1[4], 9);
  alarmParams1[5] = eepromGetByteValue(EEPROM_ALARM1[5], 0);

  alarmDays1[0] = eepromGetByteValue(EEPROM_ALARM1[6], 1);
  alarmDays1[1] = eepromGetByteValue(EEPROM_ALARM1[7], 2);
  alarmDays1[2] = eepromGetByteValue(EEPROM_ALARM1[8], 3);
  alarmDays1[3] = eepromGetByteValue(EEPROM_ALARM1[9], 4);
  alarmDays1[4] = eepromGetByteValue(EEPROM_ALARM1[10], 5);
  alarmDays1[5] = eepromGetByteValue(EEPROM_ALARM1[11], NULL);
  alarmDays1[6] = eepromGetByteValue(EEPROM_ALARM1[12], NULL);

  alarmOn2 = eepromGetBooleanValue(EEPROM_ALARM2_ON, false);

  alarmParams2[0] = eepromGetByteValue(EEPROM_ALARM2[0], 1);
  alarmParams2[1] = eepromGetByteValue(EEPROM_ALARM2[1], 1);
  alarmParams2[2] = eepromGetByteValue(EEPROM_ALARM2[2], 8);
  alarmParams2[3] = eepromGetByteValue(EEPROM_ALARM2[3], 30);
  alarmParams2[4] = eepromGetByteValue(EEPROM_ALARM2[4], 10);
  alarmParams2[5] = eepromGetByteValue(EEPROM_ALARM2[5], 0);

  alarmDays2[0] = eepromGetByteValue(EEPROM_ALARM2[6], NULL);
  alarmDays2[1] = eepromGetByteValue(EEPROM_ALARM2[7], NULL);
  alarmDays2[2] = eepromGetByteValue(EEPROM_ALARM2[8], NULL);
  alarmDays2[3] = eepromGetByteValue(EEPROM_ALARM2[9], NULL);
  alarmDays2[4] = eepromGetByteValue(EEPROM_ALARM2[10], NULL);
  alarmDays2[5] = eepromGetByteValue(EEPROM_ALARM2[11], 6);
  alarmDays2[6] = eepromGetByteValue(EEPROM_ALARM2[12], 7);

  netPresetsLen = eepromGetIntValue(EEPROM_NET_PRESET_LEN, 1);
  fmPresetsLen = eepromGetByteValue(EEPROM_FM_PRESET_LEN, 1);
  mp3TracksLen = eepromGetIntValue(EEPROM_MP3_TRACK_LEN, 1);
}

int loadFMPreset() {
  return eepromGetIntValue(EEPROM_FM_PRESET_FREQ, FM_MIN_FREQUENCY);
}

int eepromGetIntValue(byte address, int defaultValue) {
  int out = eepromReadInt(address);
  // Serial.print("Address:");
  //Serial.println(address);
  //Serial.print("Raw:");
  //Serial.println(out);
  out = (out <= 0) ? defaultValue : out;
  return out;
}

byte eepromGetByteValue(byte address, byte defaultValue) {
  byte out = eepromReadByte(address);
  // Serial.print("Address:");
  //Serial.println(address);
  //Serial.print("Raw:");
  //Serial.println(out);
  out = (out == 0) ? defaultValue : out;
  return out;
}

boolean eepromGetBooleanValue(byte address, boolean defaultValue) {
  byte value = eepromReadByte(address);
  return (value == 0) ? defaultValue : true;
}

int eepromReadInt(byte address) {
  int c = 0;
  byte buffer[2];

  Wire.beginTransmission(EEPROM_ADDRESS);
  Wire.write((int)(address >> 8)); // MSB
  Wire.write((int)(address & 0xFF)); // LSB
  Wire.endTransmission();
  Wire.requestFrom(EEPROM_ADDRESS, 2);
  for (c = 0; c < 2; c++ ) {
    if (Wire.available()) buffer[c] = Wire.read();
  }
  return (buffer[0] << 8) | buffer[1];
}

byte eepromReadByte(int address) {
  byte value = 0x00;

  Wire.beginTransmission(EEPROM_ADDRESS);
  Wire.write((int)(address >> 8));   // MSB
  Wire.write((int)(address & 0xFF)); // LSB
  Wire.endTransmission();

  Wire.requestFrom(EEPROM_ADDRESS, 1);

  if (Wire.available()) value = Wire.read();

  return value;
}

void eepromWriteInt(byte address, int value) {
  Wire.beginTransmission(EEPROM_ADDRESS);
  Wire.write((int)(address >> 8));   // MSB
  Wire.write((int)(address & 0xFF)); // LSB
  Wire.write((int)(value >> 8));
  Wire.write(value);
  Wire.endTransmission();

  delay(5);
}

void eepromWriteByte(int address, byte value) {
  Wire.beginTransmission(EEPROM_ADDRESS);
  Wire.write((int)(address >> 8));   // MSB
  Wire.write((int)(address & 0xFF)); // LSB
  Wire.write((int)value);
  Wire.endTransmission();

  delay(5);
}

void RDA5807_PowerOff() {
  RDA5807_reg[2] = 0x0001;   // all bits off
  RDA5807_Write();
}

void RDA5807_Reset() {
  unsigned int RDA5807_defReg[7] = {
    0x0758,  // 00 defaultid
    0x0000,  // 01 not used
    0xD009,  // 02 DHIZ,DMUTE,BASS, POWERUPENABLE,RDS
    0x0000,  // 03
    0x1400,  // 04 DE ? SOFTMUTE
    0x84DF,  // 05 INT_MODE,SEEKTH=0110,????, Volume=15
    0x4000,  // 06 OPENMODE=01
  };
  for (int i = 0; i < 7; i++) {
    RDA5807_reg[i] = RDA5807_defReg[i];
  }
  RDA5807_reg[2] = RDA5807_reg[2] | 0x0002;   // Enable SoftReset
  RDA5807_Write();
  RDA5807_reg[2] = RDA5807_reg[2] & 0xFFFB;   // Disable SoftReset
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

void RDA5807_WriteReg(int reg) {
  Wire.beginTransmission(RDA5807_ADDRESS_RANDOM);
  Wire.write(reg);
  Wire.write(RDA5807_reg[reg] >> 8);
  Wire.write(RDA5807_reg[reg] & 0xFF);
  Wire.endTransmission();
  delay(10);
}

void RDA5807_PowerOn() {
  RDA5807_reg[3] = RDA5807_reg[3] | 0x010;   // Enable Tuning
  RDA5807_reg[2] = RDA5807_reg[2] | 0x001;   // Enable PowerOn
  RDA5807_Write();
  RDA5807_reg[3] = RDA5807_reg[3] & 0xFFEF;  // Disable Tuning
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

void RDA5807_SetVol() {
  RDA5807_reg[5] = (RDA5807_reg[5] & 0xFFF0) | (int)currentVolume;
  RDA5807_WriteReg(5);
}

void RDA5807_GetRDS() {
  uint16_t registers[16];

  Wire.requestFrom(RDA5807_ADDRESS_SEQ, 2);
  registers[RDA5807_REG_RA] = RDA5807_Read16();
  Wire.endTransmission();

  if (registers[RDA5807_REG_RA] & RDA5807_REG_RA_RDS) {
    uint16_t newData;
    bool result = false;

    Wire.beginTransmission(RDA5807_ADDRESS_RANDOM);
    Wire.write(RDA5807_REG_RDSA);
    Wire.endTransmission(0);

    Wire.requestFrom(RDA5807_ADDRESS_RANDOM, 8, 1);
    newData = RDA5807_Read16();
    if (newData != registers[RDA5807_REG_RDSA]) {
      registers[RDA5807_REG_RDSA] = newData;
      result = true;
    }
    newData = RDA5807_Read16();
    if (newData != registers[RDA5807_REG_RDSB]) {
      registers[RDA5807_REG_RDSB] = newData;
      result = true;
    }
    newData = RDA5807_Read16();
    if (newData != registers[RDA5807_REG_RDSC]) {
      registers[RDA5807_REG_RDSC] = newData;
      result = true;
    }
    newData = RDA5807_Read16();
    if (newData != registers[RDA5807_REG_RDSD]) {
      registers[RDA5807_REG_RDSD] = newData;
      result = true;
    }
    Wire.endTransmission();

    if (result) {
      RDA5807_DecodeRDS(registers[RDA5807_REG_RDSA], registers[RDA5807_REG_RDSB], registers[RDA5807_REG_RDSC], registers[RDA5807_REG_RDSD]);
    }
  }
}

uint16_t RDA5807_Read16() {
  uint8_t hiByte = Wire.read();
  uint8_t loByte = Wire.read();
  return (256 * hiByte + loByte);
}

void RDA5807_InitRDS() {
  strcpy(RDA5807_PSName1, "--------");
  strcpy(RDA5807_PSName2, RDA5807_PSName1);
  strcpy(RDA5807_programServiceName, "        ");
  memset(RDA5807_RDSText, 0, sizeof(RDA5807_RDSText));
  RDA5807_lastTextIDX = 0;
}

void RDA5807_DecodeRDS(uint16_t block1, uint16_t block2, uint16_t block3, uint16_t block4) {
  uint8_t idx;
  char c1, c2;
  char *p;

  if (block1 == 0) {
    RDA5807_InitRDS();
    RDA5807_DisplayServiceName(RDA5807_programServiceName);
    RDA5807_DisplayText("");
    return;
  }

  uint8_t rdsGroupType = 0x0A | ((block2 & 0xF000) >> 8) | ((block2 & 0x0800) >> 11);
  uint8_t rdsTP = (block2 & 0x0400);
  uint8_t rdsPTY = (block2 & 0x0400);

  switch (rdsGroupType) {
    case 0x0A:
    case 0x0B:
      idx = 2 * (block2 & 0x0003);

      c1 = block4 >> 8;
      c2 = block4 & 0x00FF;

      if ((RDA5807_PSName1[idx] == c1) && (RDA5807_PSName1[idx + 1] == c2)) {
        RDA5807_PSName2[idx] = c1;
        RDA5807_PSName2[idx + 1] = c2;
        RDA5807_PSName2[8] = '\0';

        if ((idx == 6) && strcmp(RDA5807_PSName1, RDA5807_PSName2) == 0) {
          if (strcmp(RDA5807_PSName2, RDA5807_programServiceName) != 0) {
            strcpy(RDA5807_programServiceName, RDA5807_PSName2);
            RDA5807_DisplayServiceName(RDA5807_programServiceName);
          }
        }
      }

      if ((RDA5807_PSName1[idx] != c1) || (RDA5807_PSName1[idx + 1] != c2)) {
        RDA5807_PSName1[idx] = c1;
        RDA5807_PSName1[idx + 1] = c2;
        RDA5807_PSName1[8] = '\0';
      }
      break;

    case 0x2A:
      RDA5807_textAB = (block2 & 0x0010);
      idx = 4 * (block2 & 0x000F);

      if (idx < RDA5807_lastTextIDX) {
        RDA5807_DisplayText(RDA5807_RDSText);
      }
      RDA5807_lastTextIDX = idx;

      if (RDA5807_textAB != RDA5807_last_textAB) {
        RDA5807_last_textAB = RDA5807_textAB;
        memset(RDA5807_RDSText, 0, sizeof(RDA5807_RDSText));
      }

      RDA5807_RDSText[idx] = (block3 >> 8);
      idx++;
      RDA5807_RDSText[idx] = (block3 & 0x00FF);
      idx++;

      RDA5807_RDSText[idx] = (block4 >> 8);
      idx++;
      RDA5807_RDSText[idx] = (block4 & 0x00FF);
      idx++;
      break;
  }
}

void RDA5807_DisplayServiceName(char *name) {
  Serial.print("RDS2 ");
  Serial.println(name);
}

void RDA5807_DisplayText(char *text) {
  Serial.print("RDS ");
  Serial.println(text);
}

char RDA5807_GetRadioInfo(char buffer[16]) {
  uint16_t registers[16];
  boolean stereo = false;
  boolean rds = false;
  byte rssi = 0;

  Wire.requestFrom (RDA5807_ADDRESS_SEQ, (6 * 2));
  for (int i = 0; i < 6; i++) {
    registers[0xA + i] = RDA5807_Read16();
  }
  Wire.endTransmission();
  if (registers[RDA5807_REG_RA] & RDA5807_REG_RA_STEREO) {
    stereo = true;
  }
  if (registers[RDA5807_REG_RA] & RDA5807_REG_RA_RDS) {
    rds = true;
  }
  rssi = registers[RDA5807_REG_RB] >> 10;

  if (!stereo && !rds) {
    sprintf(buffer, "%c%c%c%c L:%d", 140, 142, 141, 142, rssi);
  }
  else if (stereo && !rds) {
    sprintf(buffer, "%c%c%c%c%c%c L:%d", 145, 146, 133, 144, 133, 142, rssi);
  }
  else if (!stereo && rds) {
    sprintf(buffer, "%c%c%c%c RDS L:%d", 140, 142, 141, 142, rssi);
  }
  else if (stereo && rds) {
    sprintf(buffer, "%c%c%c%c%c%c RDS L:%d", 145, 146, 133, 144, 133, 142, rssi);
  }
}

void setOledTimeOut() {
  if (oledTimerId > 0) {
    timer.enable(oledTimerId);
    timer.restartTimer(oledTimerId);
  }
  else {
    oledTimerId = timer.setTimeout(OLED_TIMEOUT, hideOled);
    timer.enable(oledTimerId);
  }
}

void hideOled() {
  timer.disable(oledTimerId);
  oledTimerId = 0;
  oled.lcdOff();
}

void setAudioMode() {
  switch (mode) {
    case MODE_FM:
      RDA5807_PowerOn();
      setFMPreset();
      sendFMPreset();
      setAudioSource(TDA7313_SOURCE_FM);
      break;
    case MODE_NET:
      RDA5807_PowerOff();
      sendNetPreset();
      setAudioSource(TDA7313_SOURCE_NET);
      break;
    case MODE_MP3:
      RDA5807_PowerOff();
      sendMp3Track();
      setAudioSource(TDA7313_SOURCE_NET);
      break;
    case MODE_LINEIN:
      RDA5807_PowerOff();
      setAudioSource(TDA7313_SOURCE_LINEIN);
      break;
    case MODE_APLAY:
      setAudioSource(TDA7313_SOURCE_NET);
      break;
  }
}

void setFMPreset() {
  int currentFrequency = loadFMPreset();
  RDA5807_SetFreq(currentFrequency);
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

void setAudioVolume() {
  Serial.print("VOL ");
  Serial.println(currentVolume);

  byte value = (volumeMute) ? TDA7313_MUTEVOL : currentVolume;
  tdaWriteByte(TDA7313_VOL_REG | (TDA7313_MAXVOL - value * 2) );
}

void setAudioBalance() {
 Serial.print("BAL ");
 Serial.println(currentBalance);

 int value = (currentBalance - BALANCE_OFFSET) * 2;
 if (value == 0) {
    tdaWriteByte(TDA7313_L_ATT_REG | 0x00);
    tdaWriteByte(TDA7313_R_ATT_REG | 0x00);
  }
  else {
    if (value < 0) {
      tdaWriteByte(TDA7313_L_ATT_REG | 0x00);
      tdaWriteByte(TDA7313_R_ATT_REG | ((byte)abs(value)));
    } 
    else {
      tdaWriteByte(TDA7313_L_ATT_REG | ((byte)value));
      tdaWriteByte(TDA7313_R_ATT_REG | 0x00);
    }
  }
}

void setAudioBass() {
  Serial.print("BASS ");
  Serial.println(currentBass);

  int value = currentBass - EQ_OFFSET;
  if (value < 0) {
    value = EQ_OFFSET - abs(value);
  } 
  else {
    value = (EQ_OFFSET * 2) + 1 - value;
  }
  tdaWriteByte(TDA7313_BASS_REG | value);
}

void setAudioTreble() {
  Serial.print("TREBLE ");
  Serial.println(currentTreble);

  int value = currentTreble - EQ_OFFSET;
  if (value < 0) {
    value = EQ_OFFSET - abs(value);
  } 
  else {
    value = (EQ_OFFSET * 2) + 1 - value;
  }
  tdaWriteByte(TDA7313_TREBLE_REG | value);
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
    
      if (powerStatus) {
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
          case SERIAL_DISP_OLED:
            processDisplayToOled();
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
      }
      else {
        if (serialCommand == SERIAL_POWER) {
          processPower();
        }
      }
      clearSerialBuffer();
    }
    serialBuffer[serialBufferPos++] = inSerialChar;
    serialBuffer[serialBufferPos] = '\0';
  }
}

void clearSerialBuffer() {
  for (int i = 0; i < SERIAL_BUFFER_LENGTH; i++) {
    serialBuffer[i] = '\0';
  }
  serialBufferPos = 0;
  delay(5);
}

char *serialNextParam() {
  char *nextToken;
  nextToken = strtok_r(NULL, serialDelim, &serialLast);
  return nextToken;
}

void setupSerialCommand() {
  strncpy(serialDelim, "~", 2);
  clearSerialBuffer();
}

void setupRadio() {
  RDA5807_Reset();
  RDA5807_InitRDS();
}

void setupOled() {
  oled.init();
}

void setupAmpPower() {
  pinMode(AMP_POWER_PIN, OUTPUT);
}

void ampPowerOn() {
  digitalWrite(AMP_POWER_PIN, HIGH);
}

void ampPowerOff() {
  digitalWrite(AMP_POWER_PIN, LOW);
}

void setupAudio() {
#if ARDUINO >= 157
  Wire.setClock(100000UL); // Set I2C frequency to 100kHz
#else
  TWBR = ((F_CPU / 100000UL) - 16) / 2; // Set I2C frequency to 100kHz
#endif

  tdaSetGain(TDA7313_GAIN_1);
  volumeMute = true;
  setAudioSource(TDA7313_SOURCE_NET);
  setAudioBalance();
  setAudioBass();
  setAudioTreble();
}

void tdaSetGain(byte value) {
  value = value % 4; //range 0-3
  switch (value) {
    case TDA7313_GAIN_1://0db
      bitSet(tdaAudioSwitchReg, 3);
      bitSet(tdaAudioSwitchReg, 4);
      break;
    case TDA7313_GAIN_2://+3,75db
      bitClear(tdaAudioSwitchReg, 3);
      bitSet(tdaAudioSwitchReg, 4);
      break;
    case TDA7313_GAIN_3://+7.5db
      bitSet(tdaAudioSwitchReg, 3);
      bitClear(tdaAudioSwitchReg, 4);
      break;
    case TDA7313_GAIN_4://+11.25db
      bitClear(tdaAudioSwitchReg, 3);
      bitClear(tdaAudioSwitchReg, 4);
      break;
  }
  tdaWriteByte(tdaAudioSwitchReg);
}

void setAudioSource(byte value) {
  value = value % 3; //range 0-2
  switch (value) {
    case TDA7313_SOURCE_NET:
      bitClear(tdaAudioSwitchReg, 0);
      bitClear(tdaAudioSwitchReg, 1);
      break;
    case TDA7313_SOURCE_FM:
      bitSet(tdaAudioSwitchReg, 0);
      bitClear(tdaAudioSwitchReg, 1);
      break;
    case TDA7313_SOURCE_LINEIN:
      bitClear(tdaAudioSwitchReg, 0);
      bitSet(tdaAudioSwitchReg, 1);
      break;
  }
  tdaWriteByte(tdaAudioSwitchReg);
}

void tdaWriteByte(byte value) {
  Wire.beginTransmission(TDA7313_ADDR);
  Wire.write(value);
  Wire.endTransmission();
  delay(10);
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
    rfmHumidity = rfmBuffer[1];
    rfmBatteryVoltage = rfmBuffer[2] + SENSOR_BATTERY_OFFSET;
  }
}
/*
  void readAmbientLightSensor(boolean isLowBrightness) {
  ambientLightLevel = analogRead(AMBIENT_LIGHT_SENSOR_PIN);

  if ((ambientLightLevel < AMBIENT_LIGHT_THRESHOLD) && (isLowBrightness == false)) {
    digitalWrite(SPECTRUM_BRIGHTNESS_PIN, HIGH);
    ledBrightness = LED_HIGH_BRIGHTNESS;
    oledContrast = OLED_HIGH_CONTRAST;
  }
  else {
    digitalWrite(SPECTRUM_BRIGHTNESS_PIN, LOW);
    ledBrightness = LED_LOW_BRIGHTNESS;
    oledContrast = OLED_LOW_CONTRAST;
  }
  setLedBrightness();
  }
*/
void setupSpectrum() {
  pinMode(SPECTRUM_ENABLE_PIN, OUTPUT);
  pinMode(SPECTRUM_BRIGHTNESS_PIN, OUTPUT);
  digitalWrite(SPECTRUM_BRIGHTNESS_PIN, HIGH);
}

void setup() {
  Serial.begin(9600);
  Wire.begin();
  SPI.begin();
  rtc.begin();
  
  setupRFM();
  setupAudio();
  setupOled();
  setupRadio();

  loadFromEEPROM();

  setupSerialCommand();
  setupIr();

  setupVfd();
  clearVfd();

  setupTimers();
  disableTimers();
  setDisplayMode();

  setAudioMode();
  setAudioVolume();

  // setupAmpPower();
  //setupSpectrum();
  //  delay(5000);
  //Serial.println("Ok!");
}

void loop() {
  readSerial();
  processIR();
  readKeys();
  timer.run();
  rfmReceive();
  if (powerStatus && mode == MODE_FM) {
     RDA5807_GetRDS();
  }
  scrollOledString();
}
