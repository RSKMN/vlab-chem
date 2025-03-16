import streamlit as st
from PIL import Image
import pytesseract
import requests
from my_api import api_key
import PyPDF2
import json

# Groq API Endpoint
API_URL = "https://api.groq.com/openai/v1/chat/completions"

def get_chat_response(messages, max_tokens=1000):
    """
    Sends the conversation history (messages) to the Groq API (Llama 70B)
    and returns the assistant's response.
    """
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": messages,
        "temperature": 0.6,
        "max_tokens": max_tokens
    }
    try:
        response = requests.post(API_URL, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"].strip()
    except requests.exceptions.RequestException as e:
        return f"⚠️ API Error: {e}"

# Sidebar Mode Selection
mode = st.sidebar.selectbox("Select Mode", options=["Experiment Chat", "JSON Formatter"])

# ==================== Experiment Chat Mode (from snippet 1) ====================
if mode == "Experiment Chat":
    # Initialize chat conversation memory if not present
    if "chat_messages" not in st.session_state:
        st.session_state.chat_messages = [
            {"role": "system", "content": "You are an AI that helps with virtual laboratory experiments. Provide clear, detailed steps."}
        ]
    st.title("🔬 Virtual Lab Chatbot")
    st.write("Chat with the AI for detailed experiment procedures.")

    # Document Upload Section
    uploaded_file = st.sidebar.file_uploader("📂 Upload Experiment Document", type=["png", "jpg", "jpeg", "pdf"])
    if uploaded_file:
        file_ext = uploaded_file.name.split('.')[-1].lower()
        extracted_text = ""
        if file_ext in ["png", "jpg", "jpeg"]:
            image = Image.open(uploaded_file)
            extracted_text = pytesseract.image_to_string(image)
        elif file_ext == "pdf":
            pdf_reader = PyPDF2.PdfReader(uploaded_file)
            for page in pdf_reader.pages:
                extracted_text += page.extract_text() + "\n"
        if extracted_text.strip():
            st.sidebar.text_area("Extracted Text:", extracted_text, height=150)
            if st.sidebar.button("Send to Chat"):
                st.session_state.chat_messages.append({"role": "user", "content": extracted_text})
                with st.spinner("Generating response..."):
                    response = get_chat_response(st.session_state.chat_messages)
                st.session_state.chat_messages.append({"role": "assistant", "content": response})
                st.rerun()

    st.header("💬 Chat Conversation")
    for msg in st.session_state.chat_messages:
        if msg["role"] == "user":
            st.chat_message("user").markdown(msg["content"])
        elif msg["role"] == "assistant":
            st.chat_message("assistant").markdown(msg["content"])

    user_input = st.chat_input("Type your message here...")
    if user_input:
        st.session_state.chat_messages.append({"role": "user", "content": user_input})
        with st.spinner("Assistant is thinking..."):
            response = get_chat_response(st.session_state.chat_messages)
        st.session_state.chat_messages.append({"role": "assistant", "content": response})
        st.rerun()

# ==================== JSON Formatter Mode (from snippet 2) ====================
elif mode == "JSON Formatter":
    # Initialize JSON formatter conversation memory if not present
    if "json_messages" not in st.session_state:
        st.session_state.json_messages = [
            {"role": "system", "content": (
                "You are an AI that converts plain text experiment procedure steps into a structured JSON format. "
                "The output JSON must follow this exact format:\n\n"
                '{\n'
                '    "experimentId": "exp-001",\n'
                '    "experimentName": "Acid-Base Reaction",\n'
                '    "description": "Mix HCl and NaOH in a beaker to form salt water.",\n'
                '    "steps": [\n'
                '        {\n'
                '            "action": "bringApparatus",\n'
                '            "name": "Beaker",\n'
                '            "countLabel": 1,\n'
                '            "color": "#888"\n'
                '        },\n'
                '        {\n'
                '            "action": "addChemical",\n'
                '            "apparatusName": "Beaker-1",\n'
                '            "chemical": "HCl",\n'
                '            "amount": 50,\n'
                '            "unit": "ml",\n'
                '            "color": "#ff0000"\n'
                '        },\n'
                '        {\n'
                '            "action": "addChemical",\n'
                '            "apparatusName": "Beaker-1",\n'
                '            "chemical": "NaOH",\n'
                '            "amount": 50,\n'
                '            "unit": "ml",\n'
                '            "color": "#00ff00"\n'
                '        },\n'
                '        {\n'
                '            "action": "mix",\n'
                '            "apparatusName": "Beaker-1",\n'
                '            "color": "#0000ff"\n'
                '        }\n'
                '    ]\n'
                '}\n\n'
                "Ensure your output is valid JSON and nothing else is added."
            )}
        ]
    st.title("📝 Experiment JSON Formatter")
    st.write("Paste the experiment steps (from Experiment Chat mode) below, and I'll convert them into a structured JSON format.")
    input_text = st.text_area("Paste the experiment steps here:", height=250)
    if st.button("Convert to JSON"):
        if input_text.strip():
            st.session_state.json_messages.append({"role": "user", "content": f"Please convert the following experiment steps into the JSON format specified above:\n\n{input_text}"})
            with st.spinner("Converting to JSON..."):
                json_response = get_chat_response(st.session_state.json_messages, max_tokens=1500)
            st.session_state.json_messages.append({"role": "assistant", "content": json_response})
    st.header("🔍 JSON Output")
    for msg in st.session_state.json_messages:
        if msg["role"] == "user":
            st.markdown(f"**User:** {msg['content']}")
        elif msg["role"] == "assistant":
            st.markdown(f"**Assistant:** {msg['content']}")

st.write("Powered by **Tesseract OCR**, **PyPDF2**, and **Llama 70B via Groq API**")
