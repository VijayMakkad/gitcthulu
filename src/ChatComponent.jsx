import React, { useState, useEffect } from 'react';

const ChatComponent = () => {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const apiKey = "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"; 

  const sendMessage = async () => {
    if (!userInput) return;

    const conversation = chatHistory.map(message => `[USER] ${message.user}: ${message.text}\n`).join('');
    const prompt = `[INST] ${userInput}\n`;
    const fullPrompt = `${conversation}${prompt}`;

    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: fullPrompt }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.status}`);
      }

      const aiResponse = (await response.json())[0].generated_text.trim();
      setChatHistory([...chatHistory, { user: 'AI', text: aiResponse }]);
      setUserInput('');
    } catch (error) {
      console.error("Error:", error);
      // Handle errors appropriately (e.g., display error message to user)
    }
  };

  // Handle user input change
  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  return (
    <div style={{border:'1px solid black', borderRadius:'8px', padding:'1rem', margin:'1rem'}}>
      {/* Display chat history */}
      {chatHistory.map((message, index) => (
        <p key={index} style={{border:'1px solid white', borderRadius:'6px'}}>
          <b>{message.user}:</b><br/> <i>{message.text}</i>
        </p>
      ))}
      <input type="text" value={userInput} onChange={handleInputChange} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatComponent;