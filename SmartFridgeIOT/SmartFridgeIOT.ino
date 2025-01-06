#include <ArduinoJson.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClient.h>
#include <base64.h>
#include "esp_camera.h"
#include "soc/soc.h"
#include "soc/rtc_cntl_reg.h"
#include "DHT.h"

//Modules setup
//Camera pins
#define PWDN_GPIO_NUM     32
#define RESET_GPIO_NUM    -1
#define XCLK_GPIO_NUM      0
#define SIOD_GPIO_NUM     26
#define SIOC_GPIO_NUM     27
#define Y9_GPIO_NUM       35
#define Y8_GPIO_NUM       34
#define Y7_GPIO_NUM       39
#define Y6_GPIO_NUM       36
#define Y5_GPIO_NUM       21
#define Y4_GPIO_NUM       19
#define Y3_GPIO_NUM       18
#define Y2_GPIO_NUM        5
#define VSYNC_GPIO_NUM    25
#define HREF_GPIO_NUM     23
#define PCLK_GPIO_NUM     22
#define LED_GPIO_NUM   4 //Flash pin
camera_config_t config;


//DHT11
#define DHT_PIN 16
#define DHT_TYPE DHT11
DHT dht(DHT_PIN,DHT_TYPE);

//WiFi credentials
const char* ssid = "FRITZ!Box 7490";
const char* password = "honolulu1";

//Server data
String serverAddress = "http://iotserver.808music.com";
String serverAddressWithPort = "iotserver.808music.com:443";
String serverControlEndpoint = "/api/Esp/GetControlData";
String serverPostDataEndpoint = "/api/EspReport/InsertReportEndpoint";
String serverPostSensorEndpoint ="/api/SensorData/InsertTemperatureReportEndpoint";

void setupWiFi() {
  Serial.println("Connecting to ");
  Serial.println(ssid);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  int attempts = 0;
  while(WiFi.status() != WL_CONNECTED && attempts < 100)
  {
    Serial.println(". ");
    delay(500);
    attempts++;
  }
  Serial.println("Connected to ");
  Serial.println(ssid);
  Serial.print("With IP -> ");
  Serial.println(WiFi.localIP());
}

void setupCamera() {
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sccb_sda = SIOD_GPIO_NUM;
  config.pin_sccb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 10000000;
  config.pixel_format = PIXFORMAT_JPEG; //YUV422,GRAYSCALE,RGB565,JPEG

  config.fb_location = CAMERA_FB_IN_DRAM;
  config.frame_size = FRAMESIZE_VGA; // FRAMESIZE_ + QVGA|CIF|VGA|SVGA|XGA|SXGA|UXGA
  config.jpeg_quality = 10; //10-63 lower number means higher quality
  config.fb_count = 1;

  /*
  // Select lower framesize if the camera doesn't support PSRAM
  if(psramFound()){
    config.frame_size = FRAMESIZE_UXGA; // FRAMESIZE_ + QVGA|CIF|VGA|SVGA|XGA|SXGA|UXGA
    config.jpeg_quality = 20;
    config.fb_count = 1;
  } else {
    config.frame_size = FRAMESIZE_SVGA;
    config.jpeg_quality = 15;
    config.fb_count = 1;
  }
  */
  
  //Setup LED Flash
  pinMode(LED_GPIO_NUM, OUTPUT);

  // Initialize the Camera
  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x", err);
    return;
  }

  //Change default settings
  sensor_t* sensor = esp_camera_sensor_get();
  sensor->set_contrast(sensor,2);
  sensor->set_saturation(sensor,-2);
}

String getControlData() {
  WiFiClient client;
  HTTPClient http;

  http.begin(client,serverAddress+serverControlEndpoint);
  Serial.println(serverAddress+serverControlEndpoint);

  String payload = "{}";

  int httpResCode = http.GET();
  if(httpResCode != 200)
  {
    Serial.print("Request failure with code ");
    Serial.println(httpResCode);
    http.end();
    return payload;
  }

  payload = http.getString();
  http.end();

  Serial.println(payload);
  return payload;
}

void sendSensorData(bool requireTemperature, float t, float h, float heatIndex);

void setup() {
  WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0);
  Serial.begin(115200);

  setupWiFi();
  setupCamera();
  dht.begin();

}

void loop() {
  delay(10000);

  float h = dht.readHumidity();
  float t = dht.readTemperature();

  if (isnan(h) || isnan(t)) {
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
  }

  float heatIndex = dht.computeHeatIndex(t, h, false);


  Serial.print(F("Humidity: "));
  Serial.print(h);
  Serial.print(F("%  Temperature: "));
  Serial.print(t);
  Serial.print(F("°C "));
  Serial.print(F("°F  Heat index: "));
  Serial.print(heatIndex);
  Serial.print(F("°C "));

  String controlData = getControlData();
  JsonDocument doc;
  deserializeJson(doc, controlData);
  bool requirePicture = doc["requirePicture"];
  int criticalTime = doc["timeInCritical"];
  bool requireTemperature = doc["requireTemperature"];
  WiFiClient client;

  //Send sensor data
  sendSensorData(requireTemperature, t, h, heatIndex);

  //Send picture and sensor data
  if(requirePicture)
  {
    bool withFlash = doc["withFlash"];
    if(withFlash)
    {
      digitalWrite(LED_GPIO_NUM, HIGH);
    }
    camera_fb_t * fb = NULL;
    fb = esp_camera_fb_get();
    esp_camera_fb_return(fb);
    fb = NULL;
    fb = esp_camera_fb_get();
    if(!fb) {
      Serial.println("Camera capture failed");
      delay(1000);
      ESP.restart();
    }
    /*
    JsonDocument body;
    String imageB64 = base64::encode(fb->buf, fb->len);
    Serial.println(imageB64);
    //body["imageB64"] = imageB64;
    body["temperature"] = 32;
    body["humidity"] = 11;
    
    HTTPClient http;

    Serial.println("Connecting to server: " + serverAddress+serverPostDataEndpoint);

    http.begin(client,serverAddress+serverPostDataEndpoint);

    http.addHeader("Content-Type", "application/json");
    String payload;
    serializeJson(body, payload);
    int response = http.POST(payload);

    delay(2000);

    Serial.print("Response from " + serverAddress + ": ");
    Serial.println(response);

    http.end();
    */

    
    if (client.connect("iotserver.808music.com", 8080)) {
      Serial.println("Connection successful!");

      if(client.available())

      String head = "--808IOT\r\nContent-Disposition: form-data; name=\"imageFile\"; filename=\"esp32-cam.jpg\"\r\nContent-Type: image/jpeg\r\n\r\n";
      String tail = "\r\n--808IOT--\r\n";

      String formData;
      formData += "--808IOT\r\n";
      formData += "Content-Disposition: form-data; name=\"Temperature\"\r\n\r\n";
      //Set acutal when dht is added
      formData += String(int(t))+"\r\n";

      formData += "--808IOT\r\n";
      formData += "Content-Disposition: form-data; name=\"Humidity\"\r\n\r\n";
      //Set acutal when dht is added
      formData += String(int(h))+"\r\n";

      formData += "--808IOT\r\n";
      formData += "Content-Disposition: form-data; name=\"HeatIndex\"\r\n\r\n";
      //Set acutal when dht is added
      formData += String(int(heatIndex))+"\r\n";

      formData += "--808IOT\r\n";
      formData += "Content-Disposition: form-data; name=\"Image\"; filename=\"camera-capture.jpg\"\r\nContent-Type: image/jpeg\r\n\r\n";

      uint32_t imageLen = fb->len;
      uint32_t totalLen = formData.length() + tail.length() + imageLen;

      String headers;
      headers += "POST /api/EspReport/InsertReportEndpoint HTTP/1.1\r\n";
      headers += "Host: iotserver.808music.com:8080\r\n";
      headers += "Content-Type: multipart/form-data; boundary=808IOT\r\n";
      headers += "Content-Length: " + String(totalLen)+ "\r\n\r\n";
    
      //client.print("POST api/EspReport/InsertReportEndpoint HTTP/1.1\r\n");
      //client.print("Host: iotserver.808music.com:443\r\n");
      //client.print("Connection: keep-alive\r\n");
      //client.print("ENCTYPE: multipart/form-data\r\n");
      //client.print("User-Agent: Esp32-Cam\r\n");
      //client.print("Content-Type: multipart/form-data; boundary=808IOT\r\n");
      //client.print("Content-Length: " + String(totalLen)+ "\r\n\r\n");
      client.print(headers+formData);
      //client.print(formData);
    
      uint8_t *fbBuf = fb->buf;
      size_t fbLen = fb->len;
      for (size_t n=0; n<fbLen; n=n+1024) {
        if (n+1024 < fbLen) {
          client.write(fbBuf, 1024);
          fbBuf += 1024;
        }
        else if (fbLen%1024>0) {
          size_t remainder = fbLen%1024;
          client.write(fbBuf, remainder);
        }
      }   
      client.print(tail);

      
      Serial.println("Response:");
      /*while (client.connected()) {
        if (client.available()) {
          String response = client.readStringUntil('\n');
          Serial.println(response.c_str());
        }
      }
      */
      String line = client.readStringUntil('{');
      Serial.println(line);

      String serverRes = client.readStringUntil('}');
      Serial.println("Server response: " + serverRes);

      client.flush();
      client.stop();

    }
  
      esp_camera_fb_return(fb);
      digitalWrite(LED_GPIO_NUM, LOW);
  }

  Serial.print("Needs a picture -> ");
  Serial.println(requirePicture);

  Serial.print("Time in critical temp -> ");
  Serial.println(criticalTime);
}

void sendSensorData(bool requireTemperature, float t, float h, float heatIndex) {
  if(requireTemperature)
  {
    HTTPClient http;
    WiFiClient client;
    JsonDocument body;

    body["temperature"] = t;
    body["humidity"] = h;
    body["heatIndex"] = heatIndex;

    Serial.println("Connecting to server: " + serverAddress+serverPostSensorEndpoint);
    http.begin(client,serverAddress+serverPostSensorEndpoint);

    http.addHeader("Content-Type", "application/json");
    String payload;
    serializeJson(body, payload);
    int response = http.POST(payload);
    Serial.print("Response from " + serverAddress + ": ");
    Serial.println(response);

    http.end();
  }
}
