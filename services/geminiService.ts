import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AgentMode, LogicResult, ContextMap } from "../types";

// Initialize the client
// Note: In a real deployment, ensure process.env.API_KEY is set.
// For this generated code, we assume it is available.
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const MODEL_ID = "gemini-2.5-flash";

// Schema for NL -> CPC
const nlToCpcSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    formula: {
      type: Type.STRING,
      description: "The formal logic formula using standard symbols: ¬, ∧, ∨, →, ↔, and uppercase letters for propositions.",
    },
    propositions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          symbol: { type: Type.STRING, description: "The uppercase letter (P, Q, R...)" },
          meaning: { type: Type.STRING, description: "The natural language meaning of the atomic proposition" }
        },
        required: ["symbol", "meaning"]
      }
    },
    explanation: {
      type: Type.STRING,
      description: "A brief explanation of how the translation was derived, mentioning connectives identified."
    }
  },
  required: ["formula", "propositions", "explanation"]
};

// Schema for CPC -> NL
const cpcToNlSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    sentence: {
      type: Type.STRING,
      description: "The generated natural language sentence in Portuguese.",
    },
    explanation: {
      type: Type.STRING,
      description: "A brief explanation of the logical structure and how it mapped to the sentence."
    }
  },
  required: ["sentence", "explanation"]
};

export const translateLogic = async (
  mode: AgentMode,
  input: string,
  context?: ContextMap[]
): Promise<LogicResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please configure process.env.API_KEY.");
  }

  try {
    if (mode === AgentMode.NL_TO_CPC) {
      const prompt = `
        Você é um especialista em Lógica Proposicional Clássica (CPC).
        Sua tarefa é converter a seguinte frase em português para uma fórmula lógica formal.
        
        Regras:
        1. Identifique as proposições atômicas e atribua letras maiúsculas sequenciais (P, Q, R, S...).
        2. Identifique os conectivos lógicos:
           - E: ∧
           - OU: ∨
           - NÃO: ¬
           - SE...ENTÃO: →
           - SE E SOMENTE SE: ↔
        3. Gere a fórmula bem formada.
        4. Forneça a legenda das proposições.

        Frase de entrada: "${input}"
      `;

      const response = await ai.models.generateContent({
        model: MODEL_ID,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: nlToCpcSchema,
          temperature: 0.1, // Low temperature for precision
        }
      });

      const text = response.text;
      if (!text) throw new Error("Empty response from Gemini");
      
      return JSON.parse(text) as LogicResult;

    } else {
      // CPC -> NL
      let contextString = "Nenhum contexto fornecido. Invente significados criativos e coerentes para as variáveis (ex: temas cotidianos, científicos ou filosóficos).";
      
      if (context && context.length > 0) {
        contextString = "Contexto fornecido pelo usuário:\n" + 
          context.map(c => `${c.symbol} = "${c.meaning}"`).join("\n");
      }

      const prompt = `
        Você é um especialista em tradução de Lógica Proposicional para Português natural.
        Sua tarefa é converter a seguinte fórmula lógica em uma frase coerente e gramaticalmente correta em português.

        Fórmula de entrada: "${input}"

        ${contextString}

        Regras:
        1. Use os conectivos adequados em português (Se...então, e, ou, não, etc.).
        2. Se houver contexto, use estritamente os significados fornecidos.
        3. Se não houver contexto, crie uma frase fluida que faça sentido lógico.
        4. Mantenha a estrutura lógica da fórmula original.
      `;

      const response = await ai.models.generateContent({
        model: MODEL_ID,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: cpcToNlSchema,
          temperature: 0.7, // Higher temperature for creativity in sentence generation
        }
      });

      const text = response.text;
      if (!text) throw new Error("Empty response from Gemini");

      return JSON.parse(text) as LogicResult;
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};