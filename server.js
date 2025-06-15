const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Load system prompt from prompt.txt
const promptPath = path.join(__dirname, 'prompt.txt');
let systemPrompt = '';
try {
  systemPrompt = fs.readFileSync(promptPath, 'utf8');
} catch (err) {
  console.warn('prompt.txt not found. Using empty system prompt.');
  systemPrompt = '';
}

// Simple in-memory conversation store
let conversations = {};

// Helper to fetch API key based on model
function getApiKey(model) {
  if (model === 'Gemini') return process.env.GEMINI_API_KEY || '';
  if (model === 'OpenRouter') return process.env.OPENROUTER_API_KEY || '';
  return '';
}

// Placeholder function for calling model APIs
async function callModelAPI(model, messages, params, systemPrompt) {
  // Here you'd call the real API. For now we just echo the last user message.
  const last = messages[messages.length - 1];
  return `Echo from ${model}: ${last}`;
}

app.post('/api/chat', async (req, res) => {
  const { conversationId, message, model, params, prompt } = req.body;
  const convo = conversations[conversationId] || [];
  convo.push({ role: 'user', content: message });
  const reply = await callModelAPI(model, convo.map(c => c.content), params, prompt);
  convo.push({ role: 'assistant', content: reply });
  conversations[conversationId] = convo;
  res.json({ reply });
});

// Serve the current system prompt file
app.get('/prompt.txt', (req, res) => {
  res.sendFile(promptPath);
});

app.use(express.static(path.join(__dirname, 'client')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
