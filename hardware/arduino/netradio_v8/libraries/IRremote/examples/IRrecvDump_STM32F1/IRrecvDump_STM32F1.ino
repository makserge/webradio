/*
   IRremote: IRrecvDump - dump details of IR codes with IRrecv
   An IR detector/demodulator must be connected to the input RECV_PIN.
   Version 0.1 July, 2009
   Copyright 2009 Ken Shirriff
   http://arcfn.com
   JVC and Panasonic protocol added by Kristian Lauszus (Thanks to zenwheel and other people at the original blog post)
   LG added by Darryl Smith (based on the JVC protocol)
*/

#include <IRremote.h> // default location @ libraries
//#include "IRremote.h" // same folder as .ino
//#include </YOUR-FOLDER/arduino-1.x.x/libraries/IRremote/IRremote.h> // full path specified

/*
   Default for STM32F1 is PC15, for Arduino pin D11.
   You can change this to another available Arduino Pin.
   Your IR receiver should be connected to the pin defined here
*/

#if defined(__STM32F1__)
int RECV_PIN = PC15;
#else
int RECV_PIN = 11;
#endif

IRrecv irrecv(RECV_PIN);

decode_results results;

void setup()
{
  Serial.begin(115200); // set correct speed in serial monitor

#if defined(__STM32F1__)

#ifdef F_CPU
  Serial.print(F("F_CPU: ")); // main Arduino clock
  Serial.println(F_CPU);
  Serial.println();
#endif

  Serial.print(F("SYSCLOCK: ")); // SYSCLOCK is defined in boarddefs.h
  Serial.println(SYSCLOCK);
  Serial.println();

  // irparams.blinkflag = 1; // option to test BLINKLED
#endif

  irrecv.enableIRIn(); // Start the receiver
  Serial.println(F("READY!"));
  Serial.println();
}

void dump(decode_results *results) {
  // Dumps out the decode_results structure.
  // Call this after IRrecv::decode()
  int count = results->rawlen;
  if (results->decode_type == UNKNOWN) {
    Serial.print("Unknown encoding: ");
  }
  else if (results->decode_type == NEC) {
    Serial.print("Decoded NEC: ");

  }
  else if (results->decode_type == SONY) {
    Serial.print("Decoded SONY: ");
  }
  else if (results->decode_type == RC5) {
    Serial.print("Decoded RC5: ");
  }
  else if (results->decode_type == RC6) {
    Serial.print("Decoded RC6: ");
  }
  else if (results->decode_type == PANASONIC) {
    Serial.print("Decoded PANASONIC - Address: ");
    Serial.print(results->address, HEX);
    Serial.print(" Value: ");
  }
  else if (results->decode_type == LG) {
    Serial.print("Decoded LG: ");
  }
  else if (results->decode_type == JVC) {
    Serial.print("Decoded JVC: ");
  }
  else if (results->decode_type == AIWA_RC_T501) {
    Serial.print("Decoded AIWA RC T501: ");
  }
  else if (results->decode_type == WHYNTER) {
    Serial.print("Decoded Whynter: ");
  }
  Serial.print(results->value, HEX);
  Serial.print(" (");
  Serial.print(results->bits, DEC);
  Serial.println(" bits)");
  Serial.print("Raw (");
  Serial.print(count, DEC);
  Serial.print("): ");

  for (int i = 1; i < count; i++) {
    if (i & 1) {
      Serial.print(results->rawbuf[i]*USECPERTICK, DEC);
    }
    else {
      Serial.write('-');
      Serial.print((unsigned long) results->rawbuf[i]*USECPERTICK, DEC);
    }
    Serial.print(" ");
  }
  Serial.println();
}

void loop() {
  if (irrecv.decode(&results)) {
    Serial.println(results.value, HEX);
    dump(&results);
    irrecv.resume(); // Receive the next value
  }
}
