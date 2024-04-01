import tkinter as tk
import paho.mqtt.client as mqtt

subscribed_topics = []

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Kết nối thành công!")
        # Subscribe lại các chủ đề đã subscribe trước đó khi kết nối lại thành công
        for topic in subscribed_topics:
            client.subscribe(topic)
    else:
        print("Kết nối không thành công. Mã lỗi:", rc)

def on_message(client, userdata, message):
    topic = message.topic
    payload = message.payload.decode('utf-8')
    print(f"Nhận tin nhắn từ chủ đề '{topic}': {payload}")
    message_display.insert(tk.END, f"Nhận từ '{topic}': {payload}\n")

def connect_to_mqtt_server():
    global mqtt_client
    mqtt_broker = server_entry.get()
    mqtt_client = mqtt.Client()
    mqtt_client.on_connect = on_connect
    mqtt_client.on_message = on_message
    mqtt_client.connect(mqtt_broker, 1883)
    mqtt_client.loop_start()

def subscribe():
    topic = subscribe_entry.get()
    mqtt_client.subscribe(topic)
    subscribed_topics.append(topic)  # Thêm chủ đề vào danh sách các chủ đề đã subscribe
    subscribed_topics_listbox.insert(tk.END, topic)

def publish():
    topic = publish_topic_entry.get()
    message = publish_message_entry.get()
    mqtt_client.publish(topic, message)

# Tạo cửa sổ giao diện
root = tk.Tk()
root.title("MQTT Client")

# Khung nhập server MQTT
server_label = tk.Label(root, text="Server MQTT:")
server_label.grid(row=0, column=0)
server_entry = tk.Entry(root)
server_entry.grid(row=0, column=1)

# Nút kết nối
connect_button = tk.Button(root, text="Kết nối", command=connect_to_mqtt_server)
connect_button.grid(row=0, column=2)

# Khung nhập chủ đề subscribe
subscribe_label = tk.Label(root, text="Chủ đề Subscribe:")
subscribe_label.grid(row=1, column=0)
subscribe_entry = tk.Entry(root)
subscribe_entry.grid(row=1, column=1)

# Nút Subscribe
subscribe_button = tk.Button(root, text="Subscribe", command=subscribe)
subscribe_button.grid(row=1, column=2)

# Khung hiển thị thông điệp
message_display = tk.Text(root, height=10, width=50)
message_display.grid(row=2, column=0, columnspan=3)

# Khung nhập chủ đề publish
publish_topic_label = tk.Label(root, text="Chủ đề Publish:")
publish_topic_label.grid(row=3, column=0)
publish_topic_entry = tk.Entry(root)
publish_topic_entry.grid(row=3, column=1)

# Khung nhập dữ liệu cần publish
publish_message_label = tk.Label(root, text="Dữ liệu Publish:")
publish_message_label.grid(row=4, column=0)
publish_message_entry = tk.Entry(root)
publish_message_entry.grid(row=4, column=1)

# Nút Publish
publish_button = tk.Button(root, text="Publish", command=publish)
publish_button.grid(row=4, column=2)

# Khung hiển thị các chủ đề đã subscribe
subscribed_topics_label = tk.Label(root, text="Các chủ đề đã subscribe:")
subscribed_topics_label.grid(row=5, column=0, columnspan=2)

subscribed_topics_listbox = tk.Listbox(root, height=5, width=30)
subscribed_topics_listbox.grid(row=6, column=0, columnspan=3)

root.mainloop()
