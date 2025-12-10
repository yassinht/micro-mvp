# python-sim/simulator.py
import os
import time
import json
import random
import pika
from datetime import datetime

RABBIT_URL = os.getenv('RABBITMQ_URL', 'amqp://guest:guest@rabbitmq:5672')
params = pika.URLParameters(RABBIT_URL)
exchange = 'telemetry'
routing_key_template = 'device.{device_id}'

DEVICES = [
    {"deviceId": "device-001", "location": "office-1"},
    {"deviceId": "device-002", "location": "office-2"},
    {"deviceId": "device-003", "location": "lab-1"}
]

def gen_values(device):
    # temperature (15..40), humidity (20..90), co2 (350..1200)
    return {
        "temperature": round(random.uniform(18.0, 30.0) + (0 if device["deviceId"] != "device-003" else 0.5), 2),
        "humidity": round(random.uniform(30, 70), 2),
        "co2": round(random.uniform(350, 800), 1)
    }

def main():
    print("Simulator connecting to RabbitMQ:", RABBIT_URL)
    conn = pika.BlockingConnection(params)
    ch = conn.channel()
    ch.exchange_declare(exchange=exchange, exchange_type='topic', durable=False)

    try:
        while True:
            for d in DEVICES:
                msg = {
                    "deviceId": d["deviceId"],
                    "timestamp": datetime.utcnow().isoformat() + "Z",
                    "location": d["location"],
                    "values": gen_values(d)
                }
                rk = routing_key_template.format(device_id=d["deviceId"])
                ch.basic_publish(exchange=exchange, routing_key=rk, body=json.dumps(msg))
                print(f"Published → {rk}: {msg}")
            # sleep between bursts
            time.sleep(2)
    except KeyboardInterrupt:
        print("Simulator stopped by user")
    finally:
        conn.close()

if __name__ == "__main__":
    main()
