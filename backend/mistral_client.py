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

# ✅ New summarization function
def get_summary(text):
    system_prompt = (
        "You are a summarizer. Read the document text and generate a bullet point summary. "
        "Each bullet point should be concise and informative. Focus on the most important facts."
    )

    response = ollama.chat(model="mistral", messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"Document Text:\n{text}\n\nPlease provide a bullet point summary."}
    ])
    return response['message']['content']
