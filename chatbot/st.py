import streamlit as st
from PIL import Image
import pytesseract
import requests
from my_api import api_key
import PyPDF2
import io

# Groq API Endpoint
API_URL = "https://api.groq.com/openai/v1/chat/completions"

def get_chat_response(messages, max_tokens=800):
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

# Sidebar: Mode selection dropdown
mode = st.sidebar.selectbox("Select Mode", options=["Experiment Chat", "JSON Formatter"])

# ==================== Experiment Chat Mode ====================
if mode == "Experiment Chat":
    st.title("🔬 Virtual Lab Chatbot - Experiment Chat")
    st.write("Chat with the AI to generate detailed, step-by-step experiment procedures. Upload a document for extraction or type your message below.")
    
    # Initialize chat conversation memory if not present
    if "chat_messages" not in st.session_state:
        st.session_state.chat_messages = [
            {"role": "system", "content": (
                "You are an AI specialized in designing and explaining laboratory experiments for a virtual lab. "
                "Provide detailed, step-by-step procedures including materials, safety guidelines, and clear instructions."
            )}
        ]
    
    # --- Document Upload Section ---
    st.sidebar.header("📂 Upload Experiment Document")
    uploaded_file = st.sidebar.file_uploader("Upload an image or PDF", type=["png", "jpg", "jpeg", "pdf"])
    
    if uploaded_file:
        file_ext = uploaded_file.name.split('.')[-1].lower()
        extracted_text = ""
        
        if file_ext in ["png", "jpg", "jpeg"]:
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
        
        if st.sidebar.button("📤 Send Document Content"):
            user_message = f"Here is an experiment description extracted from a document:\n\n{extracted_text}"
            st.session_state.chat_messages.append({"role": "user", "content": user_message})
            with st.spinner("Generating experiment steps..."):
                assistant_response = get_chat_response(st.session_state.chat_messages, max_tokens=800)
            st.session_state.chat_messages.append({"role": "assistant", "content": assistant_response})
    
    # --- Chat Interface ---
    st.header("💬 Chat Conversation")
    for msg in st.session_state.chat_messages:
        if msg["role"] == "user":
            st.chat_message("user").markdown(msg["content"])
        elif msg["role"] == "assistant":
            st.chat_message("assistant").markdown(msg["content"])
    
    # Chatbox for user input
    user_input = st.chat_input("Type your message here...")
    if user_input:
        st.session_state.chat_messages.append({"role": "user", "content": user_input})
        with st.spinner("Assistant is thinking..."):
            assistant_response = get_chat_response(st.session_state.chat_messages, max_tokens=800)
        st.session_state.chat_messages.append({"role": "assistant", "content": assistant_response})

# ==================== JSON Formatter Mode ====================
elif mode == "JSON Formatter":
    st.title("📝 Experiment JSON Formatter")
    st.write("Paste the experiment steps (from option 1) below, and I'll convert them into the structured JSON format.")
    
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
    
    input_text = st.text_area("Paste the experiment steps here:", height=250)
    if st.button("Convert to JSON"):
        if input_text.strip():
            st.session_state.json_messages.append({"role": "user", "content": f"Please convert the following experiment steps into the JSON format specified above:\n\n{input_text}"})
            with st.spinner("Converting to JSON..."):
                json_response = get_chat_response(st.session_state.json_messages, max_tokens=800)
            st.session_state.json_messages.append({"role": "assistant", "content": json_response})
    
    st.header("🔍 JSON Output")
    for msg in st.session_state.json_messages:
        if msg["role"] == "user":
            st.markdown(f"**User:** {msg['content']}")
        elif msg["role"] == "assistant":
            st.markdown(f"**Assistant:** {msg['content']}")
    
st.write("🔍 Powered by **Tesseract OCR**, **PyPDF2**, and **Llama 70B via Groq API**")
