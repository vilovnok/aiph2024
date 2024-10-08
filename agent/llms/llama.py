from langchain_ollama import OllamaLLM

from .base import BaseLLM


class LlamaLLM(_BaseLLM):
    def __init__(self, name: str, ollama_model_name: str) -> None:
        llm = OllamaLLM(model=ollama_model_name)
        super().__init__(name, llm)
