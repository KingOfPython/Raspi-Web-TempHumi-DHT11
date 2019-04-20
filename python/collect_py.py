import sys
import time
from datetime import datetime
import Adafruit_DHT
import pymysql
import RPi.GPIO as GPIO

sensor = Adafruit_DHT.DHT11
pin = 2                      # 라즈베리파이에 연결된 핀을 2번 핀으로 설정한다.
sensor_id = "HOME"           # 센서 ID
# DB 접속 정보
conn = pymysql.connect(host = "localhost",
                       user = "*****",
                       passwd = "*****",
                       db = "project_db")

try :
    with conn.cursor() as cur:
        sql = "INSERT INTO collect_data VALUES(%s, %s, %s, %s)" 
        while True:
            humi, temp = Adafruit_DHT.read_retry(sensor, pin)   # 센서 값을 읽어 humi 와 temp 변수에 저장
            if humi is not None and temp is not None:    # humi 와 temp 변수에 값을 정상적으로 읽어올 경우
                print('Temp={0:0.1f}*C   Humi={1:0.1f}%'.format(temp, humi))      # 포맷 형식에 맞게 출력
                # DB
                cur.execute(sql, (sensor_id, temp, humi, datetime.now()))
                conn.commit()
            else:
                print("Failed to get reading.")     # 값에 오류가 있을 경우 print

            time.sleep(10)       # 10초에 한번식 동작

except KeyboardInterrupt:
    exit()

except Exception as e:
    print("err : " + e)

finally:
    conn.close()
