const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";

function getApiKey() {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing EXPO_PUBLIC_GEMINI_API_KEY in environment variables.",
    );
  }

  return apiKey;
}

function extractTextFromResponse(data) {
  const parts = data?.candidates?.[0]?.content?.parts || [];
  const outputText = parts
    .map((part) => part?.text || "")
    .join("\n")
    .trim();

  if (!outputText) {
    throw new Error("Gemini returned an empty response.");
  }

  return outputText;
}

export async function generateGeminiContent(prompt) {
  const apiKey = getApiKey();

  const response = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data?.error?.message || "Gemini request failed.";
    throw new Error(message);
  }

  const outputText = extractTextFromResponse(data);

  return {
    text: outputText,
    raw: data,
  };
}

export async function generateGeminiImageSummary(
  base64Data,
  mimeType = "image/jpeg",
) {
  const apiKey = getApiKey();

  const response = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: "Summarize this image in 1-2 concise sentences. Focus on what is visible and useful as a memory note.",
            },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Data,
              },
            },
          ],
        },
      ],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const message =
      data?.error?.message || "Gemini image summary request failed.";
    throw new Error(message);
  }

  return {
    text: extractTextFromResponse(data),
    raw: data,
  };
}
