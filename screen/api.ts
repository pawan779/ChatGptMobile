import axios from 'axios';

const API_KEY = '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';

export const generateText = async ({prompt = ''}) => {
  const response = await axios.post(
    'https://api.openai.com/v1/completions',
    {
      model: 'text-davinci-003',
      prompt,
      max_tokens: 1000,
      temperature: 0.7,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
    },
  );

  const text = response.data.choices[0].text;
  return text;
};
