import numpy as np
import ollama

def get_embedding(text):
    response = ollama.embeddings(
        model="mxbai-embed-large",
        prompt=f"Represent this sentence for searching relevant passages: {text}"
    )
    return np.array(response["embedding"], dtype='float32')

def build_index(chunks):
    embeddings = [get_embedding(chunk) for chunk in chunks]
    return {
        "embeddings": np.array(embeddings)
    }
