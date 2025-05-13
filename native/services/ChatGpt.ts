const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const API_URL = "https://api.openai.com/v1/chat/completions";

export async function sendMessageToChatGPT(message: string): Promise<string> {
  try {
    if (!OPENAI_API_KEY) {
      throw new Error("API key não configurada");
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Você é o assistente virtual do SmartPreço, um aplicativo que ajuda usuários a comparar preços de produtos em diferentes mercados.

Informações sobre o SmartPreço:
- Os usuários podem cadastrar produtos, seus preços e em quais mercados os encontraram
- Existe uma função de scanner de código de barras para adicionar produtos facilmente
- Os usuários podem favoritar produtos e mercados para acesso rápido
- O aplicativo mostra mercados próximos com base na localização do usuário
- É possível comparar o mesmo produto em diferentes estabelecimentos

IMPORTANTE: Você DEVE responder APENAS perguntas relacionadas ao aplicativo SmartPreço, compras, economia doméstica, preços de produtos, mercados, e temas relacionados.

Se o usuário fizer perguntas sobre outros temas não relacionados (política, saúde, viagens, esportes, entretenimento, outros apps, etc.), você deve responder:
"Desculpe, só posso responder perguntas relacionadas ao SmartPreço, compras, produtos, preços, economia doméstica e uso do aplicativo. Como posso ajudar você com estas questões?"

Suas respostas devem ser curtas (3-4 frases), em português brasileiro, com tom amigável e focadas em ajudar os usuários a economizar dinheiro, encontrar promoções e otimizar suas compras. Seu nome é SmartPreço IA.`,
          },
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Erro na API do ChatGPT: ${errorData.error?.message || response.statusText}`
      );
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Erro ao enviar mensagem para ChatGPT:", error);
    throw error;
  }
}