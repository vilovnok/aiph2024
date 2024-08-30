from celery import (Celery, signals)
from utils import (generate_output, generate_output_test)
from model_loader import (ModelLoader, ModelTest) 


def make_celery(app_name=__name__):
    backend = broker = "redis://localhost:6379/0"
    return Celery(app_name, backend=backend, broker=broker)


celery = make_celery()

model_loader = None
model_path = 'r1char9/T5_chat'
# model_path = "meta-llama/Llama-2-7b-chat-hf"


# @signals.worker_process_init.connect
# def setup_model(signal, sender, **kwargs):
    # global model_loader
model_loader = ModelTest(model_path)


@celery.task
def generate_text_task(prompt):
    print('2')
    outputs = generate_output_test(
        prompt, model_loader.model, model_loader.tokenizer
    )
    print('4')
    return model_loader.tokenizer.decode(outputs[0], skip_special_tokens=True)


# @signals.worker_process_init.connect
# def setup_model(signal, sender, **kwargs):
#     global model_loader
#     model_loader = ModelLoader(model_path)

# @celery.task
# def generate_text_task(prompt):
#     time, memory, outputs = generate_output(
#         prompt, model_loader.model, model_loader.tokenizer
#     )
#     return model_loader.tokenizer.decode(outputs[0]), time, memory
