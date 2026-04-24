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
    temperature: 0.2,
    top_p: 1
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
     console.log("Response:", responseText.substring(0, 500));

     if (!response.ok) {
       let errorMsg = response.status + " - ";
       
       // Try to parse JSON error
       try {
         const errorData = JSON.parse(responseText);
         errorMsg += (errorData.error?.message || errorData.message || JSON.stringify(errorData)).substring(0, 200);
       } catch {
         // Not JSON - probably HTML error page
         errorMsg += responseText.substring(0, 150) + (responseText.length > 150 ? '...' : '');
       }
       
       if (response.status === 401) {
         errorMsg = "401 - Invalid API key. Please check your configuration.";
       }
       if (response.status === 402) {
         errorMsg = "402 - Credits limit exceeded. Please check your account.";
       }
       if ((response.status === 504 || response.status === 502) && retryCount < 2) {
         console.log("Retrying...", retryCount + 1);
         messages.pop();
         return sendMessage(userMessage, retryCount + 1);
       }
       throw new Error(errorMsg);
     }

     // Try to parse JSON response
     let data;
     try {
       data = JSON.parse(responseText);
     } catch (parseError) {
       console.error("Failed to parse JSON:", responseText.substring(0, 200));
       
       // Check if response is HTML (starts with <!DOCTYPE or <html)
       if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
         throw new Error('Server returned HTML error page. Check API endpoint and key.');
       }
       
       throw new Error('Invalid response format from AI server.');
     }

    if (data.error) {
      const errorMessage = data.error.message || data.error || JSON.stringify(data.error);
      if (errorMessage.includes('credits') || errorMessage.includes('402') || response.status === 402) {
        throw new Error("402 - Credits limit exceeded. Please check your Cerebras account.");
      }
      if (errorMessage.includes('tokens') || errorMessage.includes('token')) {
        throw new Error("Token limit exceeded. Please try a shorter message.");
      }
      throw new Error("API Error: " + errorMessage);
    }

    if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
      const aiResponse = data.choices[0].message.content;
      messages.push({
        role: "assistant",
        content: aiResponse
      });
      return aiResponse;
    }

    // Handle unexpected response format
    console.error("Unexpected response format:", data);
    if (data.choices && data.choices[0] && data.choices[0].text) {
      // Fallback for older API format
      const aiResponse = data.choices[0].text;
      messages.push({
        role: "assistant",
        content: aiResponse
      });
      return aiResponse;
    }

    return "No response from AI. Please try again.";

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