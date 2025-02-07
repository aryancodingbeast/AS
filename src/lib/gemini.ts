import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyAAwrvbb2lOa86COl61ZaEqC1OKreVEolE');

export async function generateProject(topic: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `Create a detailed Python project about "${topic}". Include:
1. A brief introduction explaining the topic
2. Step-by-step explanation of the concepts
3. Python code examples with the following format for each example:
   \`\`\`python
   # Your Python code here
   \`\`\`
4. Practice exercises with solutions in the same code block format
Make sure to use proper markdown formatting with code blocks.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

export async function generateAllTopics(topics: string[]) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `Create a comprehensive Python course covering the following topics:
${topics.map((topic, index) => `${index + 1}. ${topic}`).join('\n')}

For each topic include:
1. A brief introduction
2. Step-by-step explanation of concepts
3. Python code examples with the following format for each example:
   \`\`\`python
   # Your Python code here
   \`\`\`
4. Practice exercises with solutions in the same code block format

Make sure to use proper markdown formatting with code blocks and clear section headers for each topic.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}