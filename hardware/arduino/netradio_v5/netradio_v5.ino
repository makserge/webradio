//#include "Bounce.h"
#include "SPI.h"
#include "SimpleTimer.h"
#include "Wire.h"
#include "RTClib.h"
#include "dht11.h"
#include "IRremote.h"
#include "OLedI2C.h"
#include "RF24.h"

#define TPA0172_ADDRESS 0x6C
unsigned char TPA0172_reg[6];
#define BOOT_VOLUME 2

#define RFM_CE_PIN 8
#define RFM_CSN_PIN 10

//#define POWER_KEY_PIN 4
//#define KEYS_PIN A3
#define DHT11_PIN 3
#define RECV_PIN 2
//#define BAT_METER_PIN A6
#define AMP_POWER_PIN 9
#define SPECTRUM_ENABLE_PIN A1
#define SPECTRUM_BRIGHTNESS_PIN 5
//#define LINE_IN_DETECT_PIN 6
//#define AMBIENT_LIGHT_SENSOR_PIN A2

//#define POWER_KEY_DEBOUNCE_INTERVAL 40
//#define LINE_KEY_DEBOUNCE_INTERVAL 300

#define EEPROM_ADDRESS 0x57

#define LED_ADDRESS 0x50

#define LED_DIGIT_0 0x20                          
#define LED_DIGIT_1 0x21
#define LED_DIGIT_2 0x22
#define LED_DIGIT_3 0x23

#define LED_VOLUME_CHAR 0x14
#define LED_OFF_CHAR 0x15
#define LED_A_CHAR 0x16
#define LED_L_CHAR 0x17
#define LED_DEGREE_CHAR 0x1B

//const int RDA5807_ADDRESS_SEQ = 0x10;
//const int RDA5807_ADDRESS_RANDOM = 0x11;

//#define RDA5807_REG_RA 0x0A
//#define RDA5807_REG_RA_STEREO 0x0400
//#define RDA5807_REG_RA_RDS 0x8000
//#define RDA5807_REG_RB 0x0B
//#define RDA5807_REG_RDSA 0x0C
//#define RDA5807_REG_RDSB 0x0D
//#define RDA5807_REG_RDSC 0x0E
//#define RDA5807_REG_RDSD 0x0F

//char RDA5807_PSName1[10];
//char RDA5807_PSName2[10];
//char RDA5807_programServiceName[10];
//char RDA5807_RDSText[64 + 2];
//uint8_t RDA5807_textAB, RDA5807_last_textAB, RDA5807_lastTextIDX;

//const byte BUTTON_PREV = 1;
//const byte BUTTON_NEXT = 2;
//const byte BUTTON_MODE = 3;
//const byte BUTTON_DISPLAY = 4;
//const byte BUTTON_VOLUME_DOWN = 5;
//const byte BUTTON_VOLUME_UP = 6;

//const int BUTTON_DISPLAY_LOW = 0;
//const int BUTTON_DISPLAY_HIGH = 60;
//const int BUTTON_PREV_LOW = 90;
//const int BUTTON_PREV_HIGH = 180;
//const int BUTTON_MODE_LOW = 200;
//const int BUTTON_MODE_HIGH = 300;
//const int BUTTON_NEXT_LOW = 350;
//const int BUTTON_NEXT_HIGH = 420;
//const int BUTTON_VOLUME_DOWN_LOW = 450;
//const int BUTTON_VOLUME_DOWN_HIGH = 550;
//const int BUTTON_VOLUME_UP_LOW = 600;
//const int BUTTON_VOLUME_UP_HIGH = 700;

const byte MODE_FM = 1;
const byte MODE_NET = 2;
const byte MODE_MP3 = 3;
const byte MODE_LINEIN = 4;

const byte DISP_MODE_CLOCK = 1;
const byte DISP_MODE_FUNC = 2;
const byte DISP_MODE_ALARM1 = 3;
const byte DISP_MODE_ALARM2 = 4;
const byte DISP_MODE_SLEEP = 5;
const byte DISP_MODE_TEMP = 6;

const byte DEFAULT_VOLUME = 8;
const byte MAX_VOLUME = 31;
const byte MAX_LOW_BAT_VOLUME = 20;
const int VOLUME_FADE_DELAY = 5000;
const int VOLUME_TIMEOUT = 2000;
const int FUNC_TIMEOUT = 2000;
const int TIME_INTERVAL = 1000;
const int TEMP_INTERVAL = 30000;
const unsigned int ALARM_INTERVAL = 60000;

const byte SLEEP_TIMER_STEP = 15;
const byte MIN_SLEEP_TIMER = 15;
const byte MAX_SLEEP_TIMER = 240;
const byte SLEEP_TIMER_DEFAULT = 60;

const int OLED_TIMEOUT = 15000;

const unsigned long IR_MUTE_ON = 2148500494;
const unsigned long IR_MUTE_OFF = 2148467726;
const unsigned long IR_MODE = 2148500493;
const unsigned long IR_MODE2 = 2148467725;
const unsigned long IR_POWER_OFF = 2148500492;
const unsigned long IR_POWER_ON = 2148467724;
const unsigned long IR_DISPLAY = 2148500495;
const unsigned long IR_DISPLAY2 = 2148467727;
const unsigned long IR_VOL_UP = 2148500496;
const unsigned long IR_VOL_UP2 = 2148467728;
const unsigned long IR_VOL_DOWN = 2148500497;
const unsigned long IR_VOL_DOWN2 = 2148467729;
const unsigned long IR_PRESET_UP = 2148500498;
const unsigned long IR_PRESET_UP2 = 2148467730;
const unsigned long IR_PRESET_DOWN = 2148500499;
const unsigned long IR_PRESET_DOWN2 = 2148467731;
const unsigned long IR_UP = 2148500510;
const unsigned long IR_UP2 = 2148467742;
const unsigned long IR_DOWN = 2148500511;
const unsigned long IR_DOWN2 = 2148467743;
const unsigned long IR_OK = 2148467746; 
const unsigned long IR_OK2 = 2148500514; 
const unsigned long IR_LEFT = 2148500512;
const unsigned long IR_LEFT2 = 2148467744;
const unsigned long IR_RIGHT = 2148500513;
const unsigned long IR_RIGHT2 = 2148467745;
const unsigned long IR_SLEEP = 2148500541;
const unsigned long IR_SLEEP2 = 2148467773;

const byte SAVE_MODE = 1;
const byte SAVE_VOL = 3;
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
const byte EEPROM_FM_PRESET = 2;
const byte EEPROM_NET_PRESET = 3;
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
const byte MAX_NET_PRESETS = 99;
const int MAX_MP3_TRACKS = 999;
const int FM_MIN_FREQUENCY = 875;

const byte OLED_ROW_1 = 0;
const byte OLED_ROW_2 = 1;
const byte OLED_ROW_SYMBOLS = 16;
const byte OLED_SCROLL_DELAY = 2000; //in ms
const byte MAX_OLED_SYMBOLS = 35;
char oledBuffer[MAX_OLED_SYMBOLS];
                                                       
//const byte SERIAL_MUTE = 1;
//const byte SERIAL_MODE = 2;
//const byte SERIAL_VOLUME = 3;
//const byte SERIAL_PREESET= 4;
//const byte SERIAL_SLEEP = 5;
//const byte SERIAL_DATE = 6;
//const byte SERIAL_ALARM1 = 7;
//const byte SERIAL_ALARM2 = 8;
//const byte SERIAL_NET_COUNT = 9;
//const byte SERIAL_FM_COUNT = 10;
//const byte SERIAL_DISP_OLED = 11;
//const byte SERIAL_DISP_LED = 12;
//const byte SERIAL_MP3_COUNT = 13;
//const byte SERIAL_LOAD_COMPLETE = 14;
//const byte SERIAL_POWER = 15;

//const byte SERIAL_BUFFER_LENGTH = 45;
//char inSerialChar;
//char serialBuffer[SERIAL_BUFFER_LENGTH];
//byte serialBufferPos;
//char *serialToken;
//char serialDelim[2];
//char *serialLast;

unsigned long lastIrValue = 0;

//byte lastButtonState = LOW;
//unsigned long lastButtonDebounceTime = 0;
//const unsigned int BUTTON_DEBOUNCE_DELAY = 50;
//byte buttonState;

byte mode = MODE_NET;
byte lastMode = MODE_NET;
byte dispMode = DISP_MODE_CLOCK;
byte lastDispMode = DISP_MODE_CLOCK;

byte currentVolume = DEFAULT_VOLUME;
boolean volumeMute = false;
byte maxFadeVolume;
const int FADE_TIMEOUT = 3000; 

unsigned int volumeTimerId = 0;
unsigned int funcTimerId = 0;
unsigned int timeTimerId = 0;
unsigned int tempTimerId = 0;
unsigned int oledTimerId = 0;

byte currentTime[4] = {1, 0, 0, 0};
//boolean alarmOn = false;

boolean alarmOn1 = false;
byte alarmDays1[7] = {1, 2, 3, 4, 5, NULL, NULL};
byte alarmParams1[6] = {1, 1, 8, 60, 9, 0};  //[mode, preset, vol, timeout, hour, minute]

boolean alarmOn2 = false;
byte alarmDays2[7] = {NULL, NULL, NULL, NULL, NULL, 6, 7};
byte alarmParams2[6] = {2, 1, 8, 30, 10, 0};  //[mode, preset, vol, timeout, hour, minute]

byte sleepTimerTime = SLEEP_TIMER_DEFAULT;
//boolean sleepTimerOn = false;
//byte currentSleepTimerTime = 0;

byte currentFmPreset = 1;
byte fmPresetsLen = 1;

int currentNetPreset = 1;
int netPresetsLen = 1;

int currentMp3Track = 1;
int mp3TracksLen = 1;

//unsigned int RDA5807_reg[32];
/*
unsigned int RDA5807_defReg[10] = {
                                    0x0758,  // 00 defaultid
                                    0x0000,  // 01 not used
                                    0xD009,  // 02 DHIZ,DMUTE,BASS, POWERUPENABLE,RDS
                                    0x0000,  // 03
                                    0x1400,  // 04 DE ? SOFTMUTE  
                                    0x84DF,  // 05 INT_MODE,SEEKTH=0110,????, Volume=15
                                    0x4000,  // 06 OPENMODE=01
                                    0x0000,  // 07 unused ?
                                    0x0000,  // 08 unused ?
                                    0x0000   // 09 unused ?
                                  };
*/
const byte VOLUME_VALUE_MAP[MAX_VOLUME + 1] = { 62, 60, 58, 56, 54, 52, 50, 48, 46, 44, 42, 40, 38, 36, 34, 32, 30, 28, 26, 24, 22, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2, 0 };

//const int BAT_LEVEL_MULTIPLIER = 2; // for 10k/10k divider
//const float BAT_LOW_THRESHOLD = 3.6;
//const float BAT_SHUTDOWN_THRESHOLD = 3.2;
boolean powerStatus = false;

byte ledCustomChar[24][5] = {{ 0x7F, 0x41, 0x7F, 0x00, 0x00 }, //0
                             { 0x7F, 0x41, 0x7F, 0x00, 0x40 }, //0.
                             { 0x42, 0x7F, 0x40, 0x00, 0x00 }, //1
                             { 0x42, 0x7F, 0x40, 0x00, 0x40 }, //1.
                             { 0x79, 0x49, 0x4F, 0x00, 0x00 }, //2
                             { 0x79, 0x49, 0x4F, 0x00, 0x40 }, //2.
                             { 0x49, 0x49, 0x7F, 0x00, 0x00 }, //3
                             { 0x49, 0x49, 0x7F, 0x00, 0x40 }, //3.
                             { 0x0F, 0x08, 0x7F, 0x00, 0x00 }, //4
                             { 0x0F, 0x08, 0x7F, 0x00, 0x40 }, //4.
                             { 0x4F, 0x49, 0x79, 0x00, 0x00 }, //5
                             { 0x4F, 0x49, 0x79, 0x00, 0x40 }, //5.
                             { 0x7F, 0x49, 0x79, 0x00, 0x00 }, //6
                             { 0x7F, 0x49, 0x79, 0x00, 0x40 }, //6.
                             { 0x01, 0x01, 0x7F, 0x00, 0x00 }, //7
                             { 0x01, 0x01, 0x7F, 0x00, 0x40 }, //7.
                             { 0x7F, 0x49, 0x7F, 0x00, 0x00 }, //8
                             { 0x7F, 0x49, 0x7F, 0x00, 0x40 }, //8.
                             { 0x4F, 0x49, 0x7F, 0x00, 0x00 }, //9
                             { 0x4F, 0x49, 0x7F, 0x00, 0x40 }, //9.
                             { 0x1C, 0x14, 0x22, 0x41, 0x7F }, //Volume
                             { 0x00, 0x14, 0x08, 0x14, 0x00 }, //Off
                             { 0x7F, 0x09, 0x7F, 0x00, 0x00 }, //A
                             { 0x7F, 0x40, 0x40, 0x00, 0x00 }  //L
                            };

byte ledCustomCharMap[2][10] = { { 0x00, 0x02, 0x04, 0x06, 0x08, 0x0A, 0x0C, 0x0E, 0x10, 0x12 }, 
                                 { 0x01, 0x03, 0x05, 0x07, 0x09, 0x0B, 0x0D, 0x0F, 0x11, 0x13 }
                               }; 

byte oledContrast = 0; //0-255
int rfmBuffer[3];
int rfmTemp; 
int rfmHumidity;
int rfmBatteryVoltage;

boolean isLoadComplete = false;
//boolean isSkipSerialCommand = false;

const byte SENSOR_BATTERY_OFFSET = 0;
const byte LOW_SENSOR_BATTERY_VOLTAGE = 36;

//#define AMBIENT_LIGHT_THRESHOLD 600

//int ambientLightLevel = 0;

const byte LED_LOW_BRIGHTNESS = 0x00;//all segments 2.5 mA
//const byte LED_HIGH_BRIGHTNESS = 0x33;//all segments 10 mA

byte ledBrightness = LED_LOW_BRIGHTNESS;

const byte OLED_LOW_CONTRAST = 0;
const byte OLED_HIGH_CONTRAST = 100;

//boolean isLineOutLock = false;

byte currOledScrollPos = 0;
char currOledScrollMessage[40];
byte currOledScrollRow = 0;
int oledScrollPrevTime = 0;

//Bounce powerKeyBouncer = Bounce(POWER_KEY_PIN, POWER_KEY_DEBOUNCE_INTERVAL);
//Bounce lineInKeyBouncer = Bounce(LINE_IN_DETECT_PIN, LINE_KEY_DEBOUNCE_INTERVAL);

SimpleTimer timer;
RTC_DS1307 rtc;

dht11 DHT;

IRrecv irRecv(RECV_PIN);
decode_results irDecodeResults;

OLedI2C oled;

//RF24 rfm(RFM_CE_PIN, RFM_CSN_PIN);

/*
void readKeys() {
  if (!powerStatus) {
    return;
  }  
  unsigned int buttonValue = analogRead(KEYS_PIN);
  //Serial.print("Key value:");
  //Serial.println(buttonValue);
  
  //delay(300);
  
  byte tmpButtonState = LOW;

  if (buttonValue >= BUTTON_DISPLAY_LOW && buttonValue < BUTTON_DISPLAY_HIGH) {
     tmpButtonState = BUTTON_DISPLAY;
  }  
  else if (buttonValue > BUTTON_PREV_LOW && buttonValue < BUTTON_PREV_HIGH) {
     tmpButtonState = BUTTON_PREV;
  } 
  else if (buttonValue > BUTTON_MODE_LOW && buttonValue < BUTTON_MODE_HIGH) {
     tmpButtonState = BUTTON_MODE;
  }
  else if (buttonValue > BUTTON_NEXT_LOW && buttonValue < BUTTON_NEXT_HIGH) {
     tmpButtonState = BUTTON_NEXT;
  } 
  else if (buttonValue > BUTTON_VOLUME_DOWN_LOW && buttonValue < BUTTON_VOLUME_DOWN_HIGH) {
     tmpButtonState = BUTTON_VOLUME_DOWN;
  } 
  else if (buttonValue > BUTTON_VOLUME_UP_LOW && buttonValue < BUTTON_VOLUME_UP_HIGH) {
     tmpButtonState = BUTTON_VOLUME_UP;
  } 

  if (tmpButtonState != lastButtonState) {
     lastButtonDebounceTime = millis();
  } 

  if ((millis() - lastButtonDebounceTime) > BUTTON_DEBOUNCE_DELAY) {
     buttonState = tmpButtonState;
     if (buttonState > 0) {
        //Serial.print("Key:");
        //Serial.println(buttonState);
        switch (buttonState) {
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
          case BUTTON_VOLUME_DOWN:
            changeVolume(false);
            break;  
          case BUTTON_VOLUME_UP:
            changeVolume(true);
            break;
        }
        delay(300);   
     }  
  }

  lastButtonState = tmpButtonState;
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
*/
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
  //if (!isLineOutLock) {
    mode++;
    mode = (mode >= 5) ? 1 : mode;
    saveToEEPROM(SAVE_MODE);
  //}
  setAudioMode();
  showFuncMode();
  
  sendMode();
}  

void changeDisplayMode() {
  dispMode++;
  dispMode = (dispMode >= 7) ? 1 : dispMode;  

  hideOled();
  setDisplayMode();
}  

void changeVolume(boolean isUpDir) {
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

void updateVolume() {
  setVolume();
  saveToEEPROM(SAVE_VOL); 
  
  showVolume();
  if (volumeTimerId > 0) {
    timer.restartTimer(volumeTimerId); 
  }
  else {  
    volumeTimerId = timer.setTimeout(VOLUME_TIMEOUT, hideVolume);
  } 
}  

void showVolume() {
  backupLedData();
  
  clearLed();

  writeCharToLed(LED_DIGIT_0, LED_VOLUME_CHAR);
  
  if (volumeMute) {
    writeCharToLed(LED_DIGIT_1, LED_OFF_CHAR);
  }
  writeDigitToLed(LED_DIGIT_2, currentVolume / 10, false);
  writeDigitToLed(LED_DIGIT_3, currentVolume % 10, false);
}  

void hideVolume() {
  volumeTimerId = 0;
  clearLed();
  
  restoreLedData();
}  

void backupLedData() {
  disableTimers();
}

void restoreLedData() {
  setDisplayMode();
}

void writeCharToLed(byte digit, byte value) {
  Wire.beginTransmission(LED_ADDRESS);
  Wire.write(digit);
  Wire.write(value);
  Wire.endTransmission();
}

void writeDigitToLed(byte digit, byte value, boolean decimalPoint) {
  writeCharToLed(digit, ledCustomCharMap[decimalPoint ? 1 : 0][value]);
}  

void setupLed() {
  Wire.beginTransmission(LED_ADDRESS); 
  Wire.write(0x04);                        // select configuration register MAX6953 Table 6
  Wire.write(0x01);                        // disable shutdown;
  Wire.endTransmission();

  setLedBrightness();
 
  //Custom chars
  setupLedCustomChars();
}  

void setupLedCustomChars() {
  Wire.beginTransmission(LED_ADDRESS);
  Wire.write(0x05);
  Wire.write(0x80);

  for (byte i = 0; i < 6; i++) {
    setupLedCustomChar(i);
  }  
  
  Wire.endTransmission();
  Wire.beginTransmission(LED_ADDRESS);
  Wire.write(0x05);
  Wire.write(0x9E);

  for (byte i = 6; i < 12; i++) {
    setupLedCustomChar(i);
  } 
  
  Wire.endTransmission();
  Wire.beginTransmission(LED_ADDRESS);
  Wire.write(0x05);
  Wire.write(0xBC);

  for (byte i = 12; i < 18; i++) {
    setupLedCustomChar(i);
  } 

  Wire.endTransmission();
  Wire.beginTransmission(LED_ADDRESS);
  Wire.write(0x05);
  Wire.write(0xDA);

  for (byte i = 18; i < 24; i++) {
    setupLedCustomChar(i);
  }
  
  Wire.endTransmission();
}  

void setupLedCustomChar(byte position) {
  for (byte i = 0; i < 5; i++) {
    Wire.write(ledCustomChar[position][i]);
  }
}  

void setLedBrightness() {
  //MAX6953 Table 23
  Wire.beginTransmission(LED_ADDRESS);
  Wire.write(0x01);                       // Set intensity for Digit 0 and 2
  Wire.write(ledBrightness);
  
  Wire.endTransmission();

  //MAX6953 Table 24
  Wire.beginTransmission(LED_ADDRESS);
  Wire.write(0x02);                       //Set intensity for Digit 1 and 3
  Wire.write(ledBrightness);           
  Wire.endTransmission();
}

void clearLed() {
  writeCharToLed(LED_DIGIT_0, ' ');
  writeCharToLed(LED_DIGIT_1, ' ');
  writeCharToLed(LED_DIGIT_2, ' ');
  writeCharToLed(LED_DIGIT_3, ' ');
}  

void setDisplayMode() {
  disableTimers();
  clearLed();
  
  switch (dispMode) {
    case DISP_MODE_CLOCK:
      showTime();
      timer.enable(timeTimerId);
      break;
    case DISP_MODE_FUNC:
      showModeValue();
      break;
    case DISP_MODE_ALARM1:
     // showAlarm1();
      break;
    case DISP_MODE_ALARM2:
    //  showAlarm2();
      break;
    case DISP_MODE_SLEEP:
    //  showSleepTimer(); 
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
  
  switch (mode) {
    case MODE_FM:
      currentFrequency = loadFMPreset();

      writeDigitToLed(LED_DIGIT_3, currentFrequency % 10, false);

      writeDigitToLed(LED_DIGIT_2, (currentFrequency / 10) % 10, true);
      writeDigitToLed(LED_DIGIT_1, (currentFrequency / 100) % 10, false);
      
      digit = (currentFrequency / 1000) % 10; 
      if (digit  > 0) {
        writeDigitToLed(LED_DIGIT_0, digit, false);
      }
     
      break;
    case MODE_NET:
      writeCharToLed(LED_DIGIT_0, 'N');  
      writeCharToLed(LED_DIGIT_1, ' ');
      
      digit = (currentNetPreset / 10) % 10;
      if (digit  > 0) {
        writeDigitToLed(LED_DIGIT_2, digit, false);
      }
      writeDigitToLed(LED_DIGIT_3, currentNetPreset % 10, false);
      break;
    case MODE_MP3:
      writeCharToLed(LED_DIGIT_0, 'P');  

      digit = (currentMp3Track / 100) % 10;
      if (digit  > 0 || currentMp3Track > 99) {
        writeDigitToLed(LED_DIGIT_1, digit, false);
      }
      digit = (currentMp3Track / 10) % 10;
      if (digit  > 0 || currentMp3Track > 99) {
        writeDigitToLed(LED_DIGIT_2, digit, false);
      }
      writeDigitToLed(LED_DIGIT_3, currentMp3Track % 10, false);
      
      break;
    case MODE_LINEIN:
      writeCharToLed(LED_DIGIT_3, 'E');
      writeCharToLed(LED_DIGIT_2, 'N');
      writeCharToLed(LED_DIGIT_1, 'I');
      writeCharToLed(LED_DIGIT_0, 'L');
      
      break;
  }      
}  

void sendDataToOled(char *value, byte row) {
  oled.lcdOn();
  oled.setContrast(oledContrast);
  if (strlen(value) > OLED_ROW_SYMBOLS) {
    //oled.scrollString(value, row, OLED_SCROLL_DELAY);
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
  //timer.setInterval(ALARM_INTERVAL, checkAlarms);
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
/*
boolean checkBattery() {
  float volt = BAT_LEVEL_MULTIPLIER * (analogRead(BAT_METER_PIN) * 3.3) / 1024.0;
  
  //Serial.print("Bat:");
  //Serial.println(volt);
  
  if (volt <= BAT_SHUTDOWN_THRESHOLD) {
    clearLed(); 
    writeCharToLed(LED_DIGIT_3, 'T');
    writeCharToLed(LED_DIGIT_2, 'A');
    writeCharToLed(LED_DIGIT_1, 'B');
    delay(30000);
    powerOff();
    return 1;
  }
  else if (volt <= BAT_LOW_THRESHOLD) {
    if (currentVolume > MAX_LOW_BAT_VOLUME) {
      currentVolume =  MAX_LOW_BAT_VOLUME;
      setVolume();
    }
    return 1; 
  }
  return 0;  
}  
*/
void showTime() {
//  if (!isLoadComplete) {
//    writeCharToLed(LED_DIGIT_3, 'D');
//    writeCharToLed(LED_DIGIT_2, 'A');
//    writeCharToLed(LED_DIGIT_1, 'O');
//    writeCharToLed(LED_DIGIT_0, 'L');
//    return;    
//  }  
  writeDigitToLed(LED_DIGIT_3, currentTime[2] % 10, false);
  writeDigitToLed(LED_DIGIT_2, currentTime[2] / 10, false);
  writeDigitToLed(LED_DIGIT_1, currentTime[1] % 10, true);
  writeDigitToLed(LED_DIGIT_0, currentTime[1] / 10, false);
} 

void showTemp() {
  int status = DHT.read(DHT11_PIN);
  if (status == DHTLIB_OK) {
    byte intTemp = (byte)DHT.temperature;
    byte intHumidity = (byte)DHT.humidity;

    writeCharToLed(LED_DIGIT_3, 'C');
    writeCharToLed(LED_DIGIT_2, LED_DEGREE_CHAR);
    writeDigitToLed(LED_DIGIT_1, intTemp % 10, false);
    writeDigitToLed(LED_DIGIT_0, intTemp / 10, false);
    
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
      char oledBuffer2[19] = { 141, 133, 146, ' ', 132, 128, 141, 141, 155, 149, ' ', 132, 128, 146, 151, 136, 138, 128, '\0' };
      sendDataToOled(oledBuffer2, OLED_ROW_2);
    }  
    oledTimerId = 0;
    setOledTimeOut();
  }
} 
/*
void showAlarm1() {
  writeCharToLed(LED_DIGIT_0, LED_A_CHAR);
  writeCharToLed(LED_DIGIT_1, LED_L_CHAR);
  writeDigitToLed(LED_DIGIT_2, 1, false);
  if (alarmOn1) {
      writeCharToLed(LED_DIGIT_3, ' ');
  }
  else {
      writeCharToLed(LED_DIGIT_3, LED_OFF_CHAR);
  }

  showAlarmData(alarmParams1, alarmDays1);
}  

void showAlarm2() {
  writeCharToLed(LED_DIGIT_0, LED_A_CHAR);
  writeCharToLed(LED_DIGIT_1, LED_L_CHAR);
  writeDigitToLed(LED_DIGIT_2, 2, false);
  if (alarmOn2) {
      writeCharToLed(LED_DIGIT_3, ' ');
  }
  else {
      writeCharToLed(LED_DIGIT_3, LED_OFF_CHAR);
  }

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
  clearLed();
  writeCharToLed(LED_DIGIT_0, 'S');
  writeCharToLed(LED_DIGIT_1, 'T');
  if (!sleepTimerOn) {
     writeCharToLed(LED_DIGIT_3, LED_OFF_CHAR); 
  }
  
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
*/
void toggleMute() {
  volumeMute = !volumeMute;
  setVolume();
  sendMute();
}  

void sendMute() {
  Serial.print("MUTE ");
  Serial.println(volumeMute);  
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
/*
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
*/
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
          changeVolume(true);
          break;
        case IR_VOL_DOWN:
        case IR_VOL_DOWN2:
        case IR_DOWN:
        case IR_DOWN2:
          changeVolume(false);
          break;
        case IR_PRESET_DOWN:
        case IR_PRESET_DOWN2:
        case IR_LEFT:
        case IR_LEFT2:
       //   changeItem(false);
          break; 
        case IR_PRESET_UP:
        case IR_PRESET_UP2:
        case IR_RIGHT:
        case IR_RIGHT2:
        //  changeItem(true);
          break; 
        case IR_OK:
        case IR_OK2:
        //  changeOk();
          break;
       case IR_SLEEP:
       case IR_SLEEP2:
      //    changeSleep();
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
    //resetSleepTimer();
    //initSleepTimer();
    
    powerOff();  
  }
  else {  
    powerOn();
  }  
}  
/*
void processMute() {
  byte number;
  char *param;

  param = serialNextParam();
  if (param != NULL) {
    number = atol(param);
    volumeMute = (number == 1);
    
    setVolume();
    showMute();
    sendMute();
  }
}  

void changeModeToSelected() {
  //if (isLineOutLock) {
  //  return;  
  //}  
  byte number;
  char *param;

  param = serialNextParam();
  if (param != NULL) {
    number = atol(param);
    if (number > 0 && number < 5) {
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
    
      updateVolume();
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
*/
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
  setVolume();
  sendMute();
  
  ampPowerOn();
  
  digitalWrite(SPECTRUM_ENABLE_PIN, HIGH);
  
  writeCharToLed(LED_DIGIT_3, ' ');
  writeCharToLed(LED_DIGIT_2, '!');
  writeCharToLed(LED_DIGIT_1, 'I');
  writeCharToLed(LED_DIGIT_0, 'H');
  delay(2000);  
}  

void powerOff() {
  Serial.println("POWER 0");

  powerStatus = false;

  volumeMute = true;
  setVolume();
  sendMute();
  
  ampPowerOff();
  hideOled();
  
  digitalWrite(SPECTRUM_ENABLE_PIN, LOW);
  
  writeCharToLed(LED_DIGIT_3, ' ');
  writeCharToLed(LED_DIGIT_2, 'E');
  writeCharToLed(LED_DIGIT_1, 'Y');
  writeCharToLed(LED_DIGIT_0, 'B');
  delay(2000);
  
  dispMode = DISP_MODE_CLOCK;
  setDisplayMode();
}

void fadeVolume() {
  currentVolume = 0;
  timer.setTimeout(FADE_TIMEOUT, increaseFadeVolume);
}  

void increaseFadeVolume() {
    currentVolume++;
    if (currentVolume <= maxFadeVolume) {
        setVolume();  
        timer.setTimeout(FADE_TIMEOUT, increaseFadeVolume);
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

int eepromReadInt(byte address){
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

byte eepromReadByte(int address){
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
/*
void RDA5807_PowerOff() {
  RDA5807_reg[2] = 0x0001;   // all bits off
  RDA5807_Write();
}

void RDA5807_Reset() {
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
  RDA5807_reg[5] = (RDA5807_reg[5] & 0xFFF0)| (int)currentVolume;  
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
  //Serial.print("RDS2 "); 
  //Serial.println(name);
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
    registers[0xA+i] = RDA5807_Read16();
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
*/
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
   //   RDA5807_PowerOn();
     // setFMPreset();
    //  sendFMPreset();
      break;
    case MODE_NET:
  //    RDA5807_PowerOff();
      sendNetPreset();
      break;
    case MODE_MP3:
   //   RDA5807_PowerOff();
      sendMp3Track();
      break;
    case MODE_LINEIN:
   //   RDA5807_PowerOff();
      break;
  }
  setAudioInput();
}  

void setAudioInput()  {
  
  switch (mode) {
    case MODE_FM:
      sendTpaLine(true);
      break;
    case MODE_NET:
      sendTpaLine(false);
      break;
    case MODE_MP3:
      sendTpaLine(false);
      break;
    case MODE_LINEIN:
      sendTpaLine(false);
      break;
  }
}  
/*
void setFMPreset() {
  int currentFrequency = loadFMPreset();
  RDA5807_SetFreq(currentFrequency);
}  

void sendFMPreset() {
  Serial.print("PRESET ");
  Serial.println(currentFmPreset);
}  
*/
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
  }
}  

void setVolume() {
  byte value = volumeMute ? 255 : VOLUME_VALUE_MAP[currentVolume];
  Serial.print("VOL ");
  Serial.println(currentVolume);

  sendTpaVolume(value);
}

void readSerial() {
/*
processMute: // 1~[0-1] // 1~0
changeModeToSelected: // 2~[1-4] // 2~1
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
*/ /*
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
  }  */
}  
/*
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
*/
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
  getTpaRegisters();
  TPA0172_reg[4] = (int)B000001;
  writeTpaRegisters();
  
  sendTpaVolume(BOOT_VOLUME); 
}  
/*
void setupRFM() {
  rfm.begin();
  rfm.openReadingPipe(1, 0xF0F0F0F0E1LL);
  rfm.startListening();  
}  

void rfmReceive() {
  if (rfm.available()){
    rfm.read(rfmBuffer, 6);
    Serial.println(rfmBuffer[0]);
    rfmTemp = rfmBuffer[0];
    rfmHumidity = rfmBuffer[1];
    rfmBatteryVoltage = rfmBuffer[2] + SENSOR_BATTERY_OFFSET;
  } 
}

void setupPowerKey() {
  pinMode(POWER_KEY_PIN, INPUT);
  digitalWrite(POWER_KEY_PIN, HIGH);
}  

void setupLineInDetectKey() {
  pinMode(LINE_IN_DETECT_PIN, INPUT);
  digitalWrite(LINE_IN_DETECT_PIN, HIGH);
  
  if (lineInKeyBouncer.read() == 0) {
      lastMode = mode;
      mode = MODE_LINEIN;
      isLineOutLock = true;
      saveToEEPROM(SAVE_MODE);
      setAudioMode();
      showFuncMode();
  
      sendMode(); 
  }
}  

void readPowerKey() {
  if (powerKeyBouncer.update()) {
    if (powerKeyBouncer.read() == 0) {
      togglePower();
    }
  }
}

void readLineInKey() {
  if (lineInKeyBouncer.update()) {
    if (lineInKeyBouncer.read() == 0) {
      lastMode = mode;
      mode = MODE_LINEIN;
      isLineOutLock = true;
      
      saveToEEPROM(SAVE_MODE);
      setAudioMode();
      showFuncMode();
  
      sendMode(); 
    }
    else if (lineInKeyBouncer.read() == 1) {
      mode = lastMode;
      isLineOutLock = false;
      
      saveToEEPROM(SAVE_MODE);
      setAudioMode();
      showFuncMode();
  
      sendMode(); 
    }
  }
}

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

void sendTpaVolume(byte value) {
  getTpaRegisters();
  TPA0172_reg[0] = value;
  TPA0172_reg[1] = value;
  TPA0172_reg[2] = value;
  TPA0172_reg[3] = value;
  writeTpaRegisters();
}  

void sendTpaLine(boolean isLine) {
  getTpaRegisters();
  TPA0172_reg[5] = isLine ? (int)B00000000 : (int)B00000010;
  writeTpaRegisters();
}  

void getTpaRegisters() {
  Wire.beginTransmission(TPA0172_ADDRESS);
  
  Wire.requestFrom(TPA0172_ADDRESS, 6);
  for (byte i = 0; i < 6; i++) {
    TPA0172_reg[i] = Wire.read();
  }
  Wire.endTransmission();  
}  

void writeTpaRegisters() {
  Wire.beginTransmission(TPA0172_ADDRESS);
  Wire.write(TPA0172_reg, 6);
  Wire.endTransmission();
}  

void setup() {
  Serial.begin(9600);
  Wire.begin();
  SPI.begin();
  rtc.begin();

  //setupPowerKey();
 // setupRFM();
  setupAudio();
  setupOled();    
 // setupRadio();
    
  loadFromEEPROM();
  
 // setupSerialCommand();  
  setupIr();
 
  setupLed();
  clearLed();
  
  setupTimers();
  disableTimers();
  setDisplayMode();

  setAudioMode();
  setVolume();
 
  setupAmpPower();
  setupSpectrum();
//  setupLineInDetectKey();
//  delay(5000);
//Serial.println("Ok!");  
}  
  
void loop() {
 // readSerial();
 // readPowerKey();
 // readLineInKey();
  processIR();
  //readKeys();
  timer.run();
 // rfmReceive();
 // if (powerStatus && mode == MODE_FM) {
 //   RDA5807_GetRDS();
 // }
  scrollOledString();  
}
