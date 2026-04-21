let messages = [
  {
    role: "system",
    content: "You are a helpful AI assistant for 42 students. Keep responses SIMPLE and CLEAR.\n\nStructure your answer:\n- Use bullet points with dashes\n- Each point on a new line\n- Use headers for main topics\n- Include code examples when helpful\n- Keep explanations short and easy to understand\n\nAnswer ONLY 42 coding questions (C, Python, Shell, norminette, Git). Say 'I only help with 42 coursework' for other topics."
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
      content: "You are a helpful AI assistant for 42 students. Keep responses SIMPLE and CLEAR.\n\nStructure your answer:\n- Use bullet points with dashes\n- Each point on a new line\n- Use headers for main topics\n- Include code examples when helpful\n- Keep explanations short and easy to understand\n\nAnswer ONLY 42 coding questions (C, Python, Shell, norminette, Git). Say 'I only help with 42 coursework' for other topics."
    }
  ];
}