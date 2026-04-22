"use server";

export async function sendChatMessage(message: string) {
  try {
    const response = await fetch('http://172.21.113.220:8000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, answer: data.answer };
  } catch (error) {
    console.error("Chat API error in server action:", error);
    return { success: false, error: "Failed to connect to the AI service." };
  }
}
