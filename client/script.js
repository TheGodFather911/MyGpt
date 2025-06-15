const chat = document.getElementById('chat');
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const systemPromptEl = document.getElementById('systemPrompt');
const codeBox = document.getElementById('codeBox');
const getCodeBtn = document.getElementById('getCode');

function appendMessage(role, text) {
  const div = document.createElement('div');
  div.textContent = `${role}: ${text}`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function getParams() {
  return {
    temperature: parseFloat(document.getElementById('temp').value),
    topP: parseFloat(document.getElementById('topP').value),
    topK: parseInt(document.getElementById('topK').value),
    maxOutputTokens: parseInt(document.getElementById('maxOut').value)
  };
}

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = userInput.value;
  appendMessage('User', message);
  userInput.value = '';
  const payload = {
    conversationId: 'default',
    message,
    model: document.getElementById('model').value,
    params: getParams(),
    prompt: systemPromptEl.value
  };
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  appendMessage('AI', data.reply);
});

getCodeBtn.addEventListener('click', () => {
  const model = document.getElementById('model').value;
  const params = getParams();
  const prompt = systemPromptEl.value;
  const messages = Array.from(chat.children).map(c => c.textContent);
  const code = `curl -X POST https://api.example.com/chat \\
  -H "Authorization: Bearer YOUR_KEY" \\
  -d '${JSON.stringify({model, params, prompt, messages}, null, 2)}'`;
  codeBox.textContent = code;
  codeBox.style.display = 'block';
});

function loadPrompt() {
  fetch('prompt.txt').then(r => r.text()).then(t => { systemPromptEl.value = t; });
}
loadPrompt();

// Theme toggle
const body = document.body;
const toggleBtn = document.getElementById('toggleTheme');
function setTheme(theme) {
  body.className = theme;
  localStorage.setItem('theme', theme);
}
toggleBtn.addEventListener('click', () => {
  const current = body.className === 'dark' ? 'light' : 'dark';
  setTheme(current);
});
setTheme(localStorage.getItem('theme') || 'light');
