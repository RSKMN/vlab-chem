import streamlit as st
from PIL import Image
import pytesseract
import requests
from my_api import api_key
import PyPDF2
import io

# Groq API Endpoint
API_URL = "https://api.groq.com/openai/v1/chat/completions"

def get_chat_response(messages):
    """Sends conversation history to Llama 70B via Groq API."""
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": messages,
        "temperature": 0.6,  # For consistent responses
        "max_tokens": 400
    }
    
    try:
        response = requests.post(API_URL, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"].strip()
    except requests.exceptions.RequestException as e:
        return f"⚠️ API Error: {e}"

# Initialize conversation memory
if "messages" not in st.session_state:
    st.session_state.messages = [
        {"role": "system", "content": (
            "You are an AI specialized in explaining laboratory experiments for a virtual lab. "
            "Provide detailed, step-by-step procedures with materials, safety guidelines, and explanations."
        )}
    ]

st.title("🔬 Virtual Lab Chatbot")
st.write("Chat with the AI to generate step-by-step experiment procedures. You can also upload documents.")

# --- Document Upload Section ---
st.sidebar.header("📂 Upload Experiment Document")
uploaded_file = st.sidebar.file_uploader("Upload an image or PDF", type=["png", "jpg", "jpeg", "pdf"])

if uploaded_file:
    file_ext = uploaded_file.name.split('.')[-1].lower()
    extracted_text = ""
    
    if file_ext in ["png", "jpg", "jpeg"]:
        # Extract text from image (OCR)
        image = Image.open(uploaded_file)
        st.sidebar.image(image, caption="Uploaded Image", use_column_width=True)
        extracted_text = pytesseract.image_to_string(image)
    
    elif file_ext == "pdf":
        try:
            pdf_reader = PyPDF2.PdfReader(uploaded_file)
            for page in pdf_reader.pages:
                extracted_text += page.extract_text() + "\n"
        except Exception as e:
            extracted_text = f"⚠️ Error reading PDF: {e}"

    st.sidebar.subheader("Extracted Text:")
    st.sidebar.text_area("", extracted_text, height=200)

    if st.sidebar.button("📤 Send to Chat"):
        user_message = f"Here is an experiment description from a document:\n\n{extracted_text}"
        st.session_state.messages.append({"role": "user", "content": user_message})
        with st.spinner("Generating experiment steps..."):
            assistant_response = get_chat_response(st.session_state.messages)
        st.session_state.messages.append({"role": "assistant", "content": assistant_response})

# --- Chat Interface ---
st.header("💬 Chat with the AI")

for msg in st.session_state.messages:
    if msg["role"] == "user":
        st.chat_message("user").markdown(msg["content"])
    elif msg["role"] == "assistant":
        st.chat_message("assistant").markdown(msg["content"])

# Chatbox for user input
user_input = st.chat_input("Type your message here...")
if user_input:
    st.session_state.messages.append({"role": "user", "content": user_input})
    with st.spinner("Thinking..."):
        assistant_response = get_chat_response(st.session_state.messages)
    st.session_state.messages.append({"role": "assistant", "content": assistant_response})
