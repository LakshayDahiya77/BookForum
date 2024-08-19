const axios = require("axios");

class HuggingFaceClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: "https://api-inference.huggingface.co/models/",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
    });
  }

  async summarize(text, model = "facebook/bart-large-cnn") {
    try {
      const response = await this.client.post(model, {
        inputs: text,
        parameters: {
          max_length: 500, // Adjust based on your needs
          min_length: 200, // Adjust based on your needs
          length_penalty: 2.0, // Adjust to encourage longer summaries
        },
      });
      return response.data[0].summary_text;
    } catch (error) {
      throw new Error(`Error summarizing text: ${error.message}`);
    }
  }
}

module.exports = HuggingFaceClient;
