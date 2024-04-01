
import json
from datetime import datetime, timedelta
import time
import threading

import paho.mqtt.client as mqtt

# Thiết lập thông tin máy chủ MQTT
mqtt_broker = "localhost"
mqtt_port = 1883

relay_events = []
topics = ["smart-plug.add-alarm"]


# Hàm để cập nhật danh sách relay events vào tệp JSON
def update_relay_events_to_file(file_path, relay_events):
    try:
        with open(file_path, "w") as file:
            json.dump({"relay_events": relay_events}, file, indent=2)
            print("Relay events updated to file.")
    except Exception as e:
        print(f"Error updating relay events to file: {e}")

# Đọc dữ liệu relay_event từ file JSON và thêm vào danh sách relay_events
def read_relay_events_from_file(file_path):
    try:
        with open(file_path, "r") as file:
            data = json.load(file)
            return data.get("relay_events", [])
    except FileNotFoundError:
        print(f"File '{file_path}' not found.")
        return []
    except json.JSONDecodeError:
        print(f"Error decoding JSON from file '{file_path}'.")
        return []

# Sử dụng đường dẫn đến tệp JSON của bạn
file_path = "./Data/relay_events.json"
relay_events = read_relay_events_from_file(file_path)

# Hàm xử lý khi nhận được message
def on_message(client, userdata, message):
    data = message.payload.decode("utf-8")
    print("hoang",data)
    relay_event = json.loads(data)
    relay_events.append(relay_event)
    update_relay_events_to_file("./Data/relay_events.json", relay_events)
    
client = mqtt.Client("Client Python1")
client.on_message = on_message

# Kết nối đến broker
client.connect(mqtt_broker, mqtt_port, keepalive=60)

# Đăng ký các topic
for topic in topics:
    client.subscribe(topic)

# Lắng nghe các message
def loop():
    while True:
        try:
            client.loop_forever()
        except Exception as e:
            print("An error occurred:", e)
            time.sleep(5)  # Đợi một khoảng thời gian trước khi thử kết nối lại
            client.reconnect()  # Thử kết nối lại
threading.Thread(target=loop ).start()

def check_relay_event_time(event):
    current_time = datetime.now()
    # print('{:02d}'.format(current_time.hour))
    print(current_time.second)
    if '{:02d}'.format(current_time.hour) + ":" +  '{:02d}'.format(current_time.minute) == event["time_selection"] and current_time.second == 0:
        return True
    return False
# Hàm để xử lý sự kiện relay
def handle_relay_event(event):
    if event["repeat_type"] == "daily":
        if event["event_type"] == 0:
            print("Turn OFF")
            client.publish("smart-plug.relay",'{"id":"'+event["id"]+'","status":"off"}')
        if event["event_type"] == 1:
            print("Turn ON")
            client.publish("smart-plug.relay",'{"id":"'+event["id"]+'","status":"on"}')
        client.publish("smart-plug.message",event["description"]+ "Successfull")
        client.publish("smart-plug.event-update",'{"uuid":"'+ event["id"]+'","status":false}')
        event["status"] = False
        update_relay_events_to_file("./Data/relay_events.json", relay_events)
    elif event["repeat_type"] == "weekly":
        days_repeat = event["days_repeat"]
        current_time = datetime.now()
        day_of_week = current_time.strftime("%A")
        if day_of_week in days_repeat:
            if event["event_type"] == 0:
                print("Turn OFF")
                client.publish("smart-plug.relay-event-reply",'{"id":"'+event["id"]+'","status":"off"}')
            if event["event_type"] == 1:
                print("Turn ON")
                client.publish("smart-plug.relay-event-reply",'{"id":"'+event["id"]+'","status":"on"}')

# Lặp qua các sự kiện relay và xử lý chúng
def process_relay_events():
    try:   
        while True:
            for event in relay_events:
                if event["status"] == True and check_relay_event_time(event):
                    # Sử dụng một tiến trình mới để xử lý sự kiện
                    
                    threading.Thread(target=handle_relay_event, args=(event,)).start()
            # Chờ 1 phút trước khi kiểm tra lại
            time.sleep(1)
    except KeyboardInterrupt:
        print("KeyboardInterrupt detected. Exiting...")
        # Thoát khỏi chương trình khi phát hiện KeyboardInterrupt
        
# Khởi chạy hàm xử lý sự kiện relay trong một tiến trình mới
threading.Thread(target=process_relay_events).start()



