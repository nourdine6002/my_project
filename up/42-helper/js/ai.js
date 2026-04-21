let messages = [
  {
    role: "system",
    content: "You are a helpful AI assistant for 42 school students. You know everything about: - 42 cursus and all projects (libft, ft_printf, get_next_line, born2beroot, so_long, minitalk, push_swap, minishell, philosophers, netpractice, cub3d, inception, ft_containers, cpp modules, webserv, ft_transcendence) - C programming language - Norminette rules and fixes - Shell scripting and bash - Git and GitHub commands - Algorithms and data structures - Docker and system administration - 42 school evaluation tips - How to find peers for evaluation - Time management at 42 Always be helpful, friendly and specific. Give code examples when needed. Explain norminette errors clearly."
  }
];

async function sendMessage(userMessage) {
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

  try {
    const response = await fetch(CONFIG.AI_BASE_URL, {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + CONFIG.OPENROUTER_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    const responseText = await response.text();
    console.log("Status:", response.status);
    console.log("Response:", responseText);

    if (!response.ok) {
      let errorMsg = response.status + " - " + responseText.substring(0, 200);
      if (response.status === 402) {
        errorMsg = "402 - Prompt tokens limit exceeded. Please upgrade your OpenRouter account at https://openrouter.ai/settings/credits";
      }
      throw new Error(errorMsg);
    }

    const data = JSON.parse(responseText);

    if (data.error) {
      if (data.error.message.includes('tokens limit') || data.error.message.includes('402')) {
        throw new Error("402 - Prompt tokens limit exceeded. Please upgrade your OpenRouter account at https://openrouter.ai/settings/credits");
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
    console.error("Fetch Error:", error);
    throw error;
  }
}

function clearChat() {
  messages = [
    {
      role: "system",
      content: "You are a helpful AI assistant for 42 school students. You know everything about: - 42 cursus and all projects (libft, ft_printf, get_next_line, born2beroot, so_long, minitalk, push_swap, minishell, philosophers, netpractice, cub3d, inception, ft_containers, cpp modules, webserv, ft_transcendence) - C programming language - Norminette rules and fixes - Shell scripting and bash - Git and GitHub commands - Algorithms and data structures - Docker and system administration - 42 school evaluation tips - How to find peers for evaluation - Time management at 42 Always be helpful, friendly and specific. Give code examples when needed. Explain norminette errors clearly."
    }
  ];
}