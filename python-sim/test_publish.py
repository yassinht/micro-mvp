# python-sim/test_publish.py
import pika, os, json
url = os.getenv('RABBITMQ_URL','amqp://micro:micro_pass@rabbitmq:5672')
params = pika.URLParameters(url)
conn = pika.BlockingConnection(params)
ch = conn.channel()
ch.exchange_declare(exchange='telemetry', exchange_type='topic', durable=False)
msg = {"deviceId":"device-test","timestamp":"2025-12-08T00:00:00Z","values":{"temperature":25.3}}
ch.basic_publish(exchange='telemetry', routing_key='device.device-test', body=json.dumps(msg))
print("Published test message")
conn.close()

