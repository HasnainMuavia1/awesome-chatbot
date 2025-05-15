// Initialize AOS animation library
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        easing: 'ease',
        once: true
    });

    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.checked = true;
    } else if (savedTheme === 'light') {
        body.classList.remove('dark-mode');
        themeToggle.checked = false;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // If no saved preference, use system preference
        body.classList.add('dark-mode');
        themeToggle.checked = true;
    }

    // Toggle theme when switch is clicked
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    });

    // Mobile sidebar toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show');
        });
    }

    // Chat functionality
    const messageForm = document.getElementById('message-form');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');
    const typingIndicator = document.getElementById('typing-indicator');

    // Function to get current time
    window.getCurrentTime = function() {
        const now = new Date();
        return now.getHours().toString().padStart(2, '0') + ':' + 
               now.getMinutes().toString().padStart(2, '0');
    };

    // Function to add a message to the chat
    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        messageDiv.setAttribute('data-aos', isUser ? 'fade-left' : 'fade-right');
        messageDiv.setAttribute('data-aos-duration', '500');
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const messageText = document.createElement('div');
        messageText.className = 'message-text';
        messageText.innerHTML = `<p>${message}</p>`;
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.innerHTML = `<span>${getCurrentTime()}</span>`;
        
        messageContent.appendChild(messageText);
        messageContent.appendChild(messageTime);
        messageDiv.appendChild(messageContent);
        
        chatMessages.appendChild(messageDiv);
        
        // Scroll to the bottom of the chat
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Reinitialize AOS for the new element
        AOS.refresh();
    }

    // Function to show typing indicator
    function showTypingIndicator() {
        typingIndicator.style.display = 'block';
    }

    // Function to hide typing indicator
    function hideTypingIndicator() {
        typingIndicator.style.display = 'none';
    }

    // Handle form submission
    messageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const message = userInput.value.trim();
        if (message === '') return;
        
        // Add user message to chat
        addMessage(message, true);
        
        // Clear input field
        userInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Send message to server
        fetch('/send_message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message })
        })
        .then(response => response.json())
        .then(data => {
            // Hide typing indicator
            hideTypingIndicator();
            
            // Add bot response to chat
            setTimeout(() => {
                addMessage(data.response);
            }, 500); // Small delay for more natural conversation flow
        })
        .catch(error => {
            console.error('Error:', error);
            hideTypingIndicator();
            addMessage('Sorry, there was an error processing your request. Please try again later.');
        });
    });

    // Add some initial animation delay to the welcome message
    setTimeout(() => {
        const welcomeMessage = document.querySelector('.bot-message');
        if (welcomeMessage) {
            welcomeMessage.setAttribute('data-aos', 'fade-right');
            AOS.refresh();
        }
    }, 500);
});