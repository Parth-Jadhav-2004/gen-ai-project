import numpy as np
from vectorstore import build_index, get_embedding
from mistral_client import get_answer
from PyPDF2 import PdfReader
from docx import Document
import io

def extract_text_from_pdf(file_bytes):
    reader = PdfReader(io.BytesIO(file_bytes))
    return " ".join(page.extract_text() for page in reader.pages if page.extract_text())

def extract_text_from_docx(file_bytes):
    doc = Document(io.BytesIO(file_bytes))
    return "\n".join([para.text for para in doc.paragraphs if para.text.strip()])

def process_documents(documents, filenames):
    all_text = ""
    for content, filename in zip(documents, filenames):
        if filename.endswith(".pdf"):
            all_text += extract_text_from_pdf(content)
        elif filename.endswith(".docx"):
            all_text += extract_text_from_docx(content)
        else:
            # Assuming .txt
            all_text += content.decode('utf-8')

    chunks = []
    chunk_size = 1000
    chunk_overlap = 200

    for i in range(0, len(all_text), chunk_size - chunk_overlap):
        chunks.append(all_text[i:i + chunk_size])

    index = build_index(chunks)
    return chunks, index

def answer_question(index, chunks, question):
    q_embedding = get_embedding(question)
    scores = np.dot(index["embeddings"], q_embedding)
    top_k = scores.argsort()[-3:][::-1]
    context = "\n".join([chunks[i] for i in top_k])
    return get_answer(context, question)
