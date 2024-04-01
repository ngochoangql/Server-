import joblib
import numpy as np
import paho.mqtt.client as mqtt
import warnings
import json
import os
# Load mô hình
loaded_model = joblib.load('C:\\Users\\IBM\\Desktop\\MQTT\\model.pkl')
loaded_scaler = joblib.load('C:\\Users\\IBM\\Desktop\\MQTT\\scaler.pkl') 


warnings.filterwarnings("ignore", category=UserWarning)

# Thiết lập thông tin máy chủ MQTT
mqtt_broker = "localhost"
mqtt_port = 1883
topic = "smart-plug.all-data"
list_event_relay = []
 

# Hàm xử lý khi nhận được message
def on_message(client, userdata, message):
    if message.topic == "smart-plug.all-data":
       
            # Giải mã message và tách thành danh sách các giá trị
        
        decoded_message = message.payload.decode("utf-8")
        data_mqtt = json.loads(decoded_message)
        data_string = data_mqtt["data"]
        # print(decoded_message)
        values = [float(val) for val in data_string.strip('()').split(',') if val.strip()]

        # Chia danh sách thành các danh sách con mỗi phần tử chỉ chứa một giá trị
        values = [values[i:i+4] for i in range(0, len(values), 4)]
        # print(values)
        # Đọc dữ liệu hiện có từ tệp JSON (nếu có)
        for value in values:
            try:
                with open('../Data/DataChart/'+data_mqtt["id"]+".json", "r") as json_file:
                    data = json.load(json_file)
            except FileNotFoundError:
                data = {"current":[],"voltage":[],"active":[],"apparent":[]}
                folder_path = '../Data/DataChart/'
                os.makedirs(folder_path, exist_ok=True)
                os.path.join(folder_path, data_mqtt["id"] + ".json")
                
            data["current"].append(round(value[0]*1000, 2))
            data["voltage"].append(round(value[1], 2))
            data["active"].append(round(value[2]*100, 2))
            data["apparent"].append(round(value[3]*100, 2))
            # Ghi danh sách đã cập nhật vào tệp JSON
            with open('../Data/DataChart/'+data_mqtt["id"]+".json", "w") as json_file:
                json.dump(data, json_file, indent=4)
                
                
                
        try:
            with open( '../Data/DataParameter/'+data_mqtt["id"]+".json", "r") as json_file:
                data1 = json.load(json_file)
        except FileNotFoundError:
            data1 = {"current":0,"voltage":0,"active":0,"apparent":0,"predict":""}
            folder_path = '../Data/DataParameter/'
            os.makedirs(folder_path, exist_ok=True)
            os.path.join(folder_path, data_mqtt["id"] + ".json")
            
        # Thêm dữ liệu mới vào danh sách
        data1["current"]=round(values[3][0]*1000, 2)
        data1["voltage"]= round(values[3][1], 2)
        data1["active"]= round(values[3][2]*100, 2)
        data1["apparent"]=round(values[3][3]*100, 2)
        # Ghi danh sách đã cập nhật vào tệp JSON
        new_samples = np.array(values)
        # print( new_samples)
        new_samples_scaled = loaded_scaler.transform(new_samples)
        predictions = loaded_model.predict(new_samples_scaled)
        print("Predictions for new samples:", predictions)
        trend = predictions[0]
        for i in range(1, len(values)):
            prev_value = sum(values[i-1])
            current_value = sum(values[i])
            if current_value > prev_value:
                trend = predictions[len(predictions)-1]
                
        data1["predict"]=trend
                
        with open('../Data/DataParameter/'+data_mqtt["id"]+".json", "w") as json_file:
            json.dump(data1, json_file, indent=4)         
# Thiết lập MQTT client
client = mqtt.Client()
client.on_message = on_message

# Kết nối đến broker
client.connect(mqtt_broker, mqtt_port)

# Đăng ký topic
client.subscribe(topic)

# Lắng nghe các message
client.loop_forever()