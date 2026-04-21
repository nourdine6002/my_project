let messages = [
  {
    role: "system",
    content: "You are a helpful AI assistant for 42 school students. ONLY answer questions related to 42 school cursus, programming, and coding (C, Python, Shell, etc.). If the user asks about unrelated topics (weather, sports, politics, entertainment, personal matters, etc.), politely respond: 'I'm here to help with 42 cursus questions only! Ask me about projects, code, norminette, or coding concepts.' You know: 42 cursus projects (libft, ft_printf, get_next_line, born2beroot, so_long, minitalk, push_swap, minishell, philosophers, netpractice, cub3d, inception, ft_containers, cpp modules, webserv, ft_transcendence), C programming, Python, Norminette rules, Shell scripting, Git commands, Algorithms, Docker. Be helpful, friendly and specific. Give code examples when needed."
  }
];

async function sendMessage(userMessage, retryCount = 0) {
  messages.push({
    role: "user",
    content: userMessage
  });

  const requestBody = {
    model: CONFIG.AI_MODEL,
    messages: messages,
    max_tokens: 2048,
    temperature: 0.7
  };

  console.log("Request:", JSON.stringify(requestBody, null, 2));

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(CONFIG.AI_BASE_URL, {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + CONFIG.OPENROUTER_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const responseText = await response.text();
    console.log("Status:", response.status);
    console.log("Response:", responseText);

    if (!response.ok) {
      let errorMsg = response.status + " - " + responseText.substring(0, 200);
      if (response.status === 402) {
        errorMsg = "402 - Prompt tokens limit exceeded. Please upgrade your OpenRouter account at https://openrouter.ai/settings/credits";
      }
      if ((response.status === 504 || response.status === 502) && retryCount < 2) {
        console.log("Retrying...", retryCount + 1);
        messages.pop();
        return sendMessage(userMessage, retryCount + 1);
      }
      throw new Error(errorMsg);
    }

    const data = JSON.parse(responseText);

    if (data.error) {
      if (data.error.message.includes('tokens limit') || data.error.message.includes('402')) {
        throw new Error("402 - Prompt tokens limit exceeded. Please upgrade your OpenRouter account at https://openrouter.ai/settings/credits");
      }
      if (data.error.message.includes('aborted') && retryCount < 2) {
        console.log("Retrying after abort...", retryCount + 1);
        messages.pop();
        return sendMessage(userMessage, retryCount + 1);
      }
      throw new Error("API Error: " + data.error.message);
    }

    if (data.choices && data.choices[0] && data.choices[0].message) {
      const aiResponse = data.choices[0].message.content;
      messages.push({
        role: "assistant",
        content: aiResponse
      });
      return aiResponse;
    }

    console.error("No response data:", data);
    return "No response from AI. Check console for details.";

  } catch (error) {
    clearTimeout(timeoutId);
    console.error("Fetch Error:", error);
    if (error.name === 'AbortError' && retryCount < 2) {
      console.log("Timeout, retrying...", retryCount + 1);
      messages.pop();
      return sendMessage(userMessage, retryCount + 1);
    }
    throw error;
  }
}

function clearChat() {
  messages = [
    {
      role: "system",
      content: "You are a helpful AI assistant for 42 school students. ONLY answer questions related to 42 school cursus, programming, and coding (C, Python, Shell, etc.). If the user asks about unrelated topics (weather, sports, politics, entertainment, personal matters, etc.), politely respond: 'I'm here to help with 42 cursus questions only! Ask me about projects, code, norminette, or coding concepts.' You know: 42 cursus projects (libft, ft_printf, get_next_line, born2beroot, so_long, minitalk, push_swap, minishell, philosophers, netpractice, cub3d, inception, ft_containers, cpp modules, webserv, ft_transcendence), C programming, Python, Norminette rules, Shell scripting, Git commands, Algorithms, Docker. Be helpful, friendly and specific. Give code examples when needed."
    }
  ];
}