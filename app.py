from flask import Flask, render_template, request, jsonify
import random
import time

app = Flask(__name__)

# Sample responses for the chatbot
responses = [
    "Hello! How can I assist you today?",
    "That's an interesting question. Let me think about it.",
    "I'm here to help with any questions you might have.",
    "Could you provide more details about your question?",
    "I understand your concern. Here's what I suggest...",
    "Thanks for sharing that information with me.",
    "I'm processing your request, please wait a moment.",
    "I appreciate your patience.",
    "Let me know if you need anything else!",
    "I'm always learning and improving to serve you better."
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/send_message', methods=['POST'])
def send_message():
    user_message = request.json.get('message', '')
    
    # Simulate processing time for a more realistic experience
    time.sleep(0.5)
    
    # For demo purposes, just return a random response
    # In a real application, you would process the user's message and generate an appropriate response
    bot_response = random.choice(responses)
    
    return jsonify({
        'response': bot_response,
        'timestamp': time.strftime('%H:%M')
    })

if __name__ == '__main__':
    app.run(debug=True)