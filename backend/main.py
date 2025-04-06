from flask import Flask, request, jsonify
from flask_cors import CORS
from rag import process_documents, answer_question

app = Flask(__name__)
CORS(app)

documents = []
index = None
chunks = []

@app.route("/upload-files/", methods=["POST"])
def upload_files():
    global documents, index, chunks
    if 'files' not in request.files:
        return jsonify({"error": "No files uploaded"}), 400

    uploaded_files = request.files.getlist("files")
    documents = [file.read() for file in uploaded_files]
    filenames = [file.filename for file in uploaded_files]

    try:
        chunks, index = process_documents(documents, filenames)
        return jsonify({"message": "Documents uploaded and processed."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/ask-question/", methods=["POST"])
def ask_question():
    global index, chunks
    data = request.get_json()
    question = data.get("question", "").strip()

    if not question:
        return jsonify({"error": "Question is missing"}), 400
    if not index or not chunks:
        return jsonify({"error": "Please upload documents first"}), 400

    try:
        answer = answer_question(index, chunks, question)
        return jsonify({"answer": answer}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
