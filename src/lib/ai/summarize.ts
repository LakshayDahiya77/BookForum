import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient(process.env.HF_TOKEN!);

export async function generateBookSummary(
  reviews: { content: string; rating: number }[],
): Promise<string> {
  const reviewsText = reviews
    .map((r, i) => `Review ${i + 1} (${r.rating}/5): ${r.content}`)
    .join("\n");

  const response = await client.chatCompletion({
    model: "meta-llama/Llama-3.1-8B-Instruct",
    provider: "cerebras",
    messages: [
      {
        role: "system",
        content: `You are a book review analyst. Summarize reader reviews in 4-5 sentences. 
          Write in third person. Do not introduce yourself or your analysis. 
          Do not start with phrases like "Based on", "Here is", or "Summary:". 
          Start directly with what readers think. Be concise and specific.`,
      },
      {
        role: "user",
        content: `Summarize these book reviews. Highlight common praise, common criticism, and overall sentiment.\n\nReviews:\n${reviewsText}`,
      },
    ],
    max_tokens: 300,
    temperature: 0.4,
  });

  return response.choices[0].message.content?.trim() ?? "";
}
