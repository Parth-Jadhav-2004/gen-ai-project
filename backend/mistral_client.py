import ollama

def get_answer(context, question):
    system_prompt = (
        "You are a helpful assistant. Use the context from the uploaded documents "
        "to answer the user's question as accurately as possible."
    )

    response = ollama.chat(model="mistral", messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"Context:\n{context}\n\nQuestion:\n{question}"}
    ])
    return response['message']['content']
