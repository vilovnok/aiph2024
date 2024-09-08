from llms import LlamaLLM
from utils import read_prompt


def read_prompt(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()

if __name__ == "__main__":
    llm = LlamaLLM("llama", "llama3.1")

    prompt = read_prompt("../prompts/system_prompts/support_prompts.txt")


    question = "Сегодня хорошая погода!"
    answer = llm.invoke({"query": question}, prompt)
    
    print(f"QUERY (eng): {question}")
    print(f"Model answer (rus): {answer}")