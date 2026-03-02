const chatBox = document.getElementById("chatBox");
let rules = [];

async function loadRules() {
    const res = await fetch("rules.json");
    rules = await res.json();
}

loadRules();

function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.classList.add("message", sender);
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
    const input = document.getElementById("userInput");
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    const reply = await generateReply(text.toLowerCase());
    addMessage(reply, "bot");
}

async function generateReply(question) {
    const rpKeywords = ["rp", "правил", "сервер", "образ", "поруш", "гравц"];
    const isRP = rpKeywords.some(word => question.includes(word));

    if (!isRP) return "Я відповідаю лише на питання пов'язані з RP та правилами сервера.";

    // Шукаємо правило у rules.json
    for (let rule of rules) {
        if (rule.keywords.some(kw => question.includes(kw))) {
            return rule.text;
        }
    }

    // Якщо не знайшли — викликаємо AI
    return await fetchAIResponse(question);
}

async function fetchAIResponse(question) {
    // Виклик OpenAI API (треба вставити свій ключ)
    const apiKey = "ТВОЙ_OPENAI_API_KEY";

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    {role: "system", content: "Ти UR — AI для RP сервера UKRAINE RP. Відповідай лише про RP та правила. Якщо не знаєш — пиши, що треба спитати адміністрацію."},
                    {role: "user", content: question}
                ]
            })
        });

        const data = await response.json();
        return data.choices[0].message.content || "Не можу відповісти, зверніться до адміністрації.";
    } catch (e) {
        return "Помилка при підключенні до AI. Спробуйте пізніше.";
    }
}
