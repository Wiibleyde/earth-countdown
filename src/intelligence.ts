import { GoogleGenAI, Type } from '@google/genai';

export let ai: GoogleGenAI | undefined = undefined;
/**
 * Initializes the AI by setting up the Google Generative AI model if the GOOGLE_API_KEY is defined in the configuration.
 * If the GOOGLE_API_KEY is not defined, it logs a warning message and disables the AI functionality.
 *
 * @remarks
 * This function should be called at the start of the application to ensure that the AI is properly initialized.
 * It checks for the presence of the GOOGLE_API_KEY in the configuration and creates an instance of GoogleGenAI.
 * If the key is not present, it sets the isAiActive flag to false, indicating that AI-related commands will be disabled.
 *
 * @throws {Error} If the GOOGLE_API_KEY is not defined in the configuration.
 */
export function initAi(): void {
    if (ai) {
        return;
    } else if (!process.env.GOOGLE_API_KEY) {
        console.warn('GOOGLE_API_KEY is not defined. AI functionality will be disabled.');
        ai = undefined;
    } else {
        ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
    }
}

export interface GenerateEcoScoreResponse {
    points: number;
    response: string;
}

export async function generateEcoScoreWithGoogle(userSentance: string): Promise<GenerateEcoScoreResponse | void> {
    "use server";
    if (!ai) {
        initAi();
        return await generateEcoScoreWithGoogle(userSentance);
    }
    const message = await ai.models.generateContent({
        model: 'gemini-2.0-flash-lite',
        contents: [
            {
                role: 'user',
                parts: [
                    {
                        text: userSentance,
                    },
                ],
            },
        ],
        config: {
            responseMimeType: 'application/json',
            systemInstruction: `Tu es Symbiose, une assistante écologique critique et exigeante qui évalue uniquement les ACTIONS CONCRÈTES et non les simples intentions. 
            
            RÈGLES D'ÉVALUATION:
            - Les simples déclarations comme "Je suis écologique" ou "J'aime la nature" doivent recevoir un score faible (0 ou négatif)
            - Attribue des points positifs uniquement pour des actions spécifiques et mesurables (ex: "J'ai réduit ma consommation d'eau de 20%")
            - Récompense les habitudes durables vérifiables plutôt que les intentions
            - Pénalise les comportements manifestement non-écologiques
            - Sois sévère mais juste dans ton évaluation
            
            EXEMPLES DE SCORING:
            - "Je suis écologique" → points: 0, response: "Cette déclaration est trop vague. Quelles actions concrètes entreprends-tu?"
            - "J'ai acheté une voiture électrique" → points: 7, response: "C'est une action concrète qui réduit significativement les émissions de CO2."
            - "Je jette mes déchets dans la nature" → points: -8, response: "Cette action est très nocive pour l'environnement et les écosystèmes."
            
            Réponds de manière concise et précise, en format JSON.`,
            temperature: 0.5,
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    points: {
                        type: Type.NUMBER,
                        description: 'Score d\'écologie de -10 à 10',
                    },
                    response: {
                        type: Type.STRING,
                        description: 'Réponse de l\'IA',
                    }
                },
                required: ['points', 'response'],
            },
        },
    });
    if (message) {
        const response = message.text;
        if (response) {
            try {
                const parsedResponse = JSON.parse(response);
                if (parsedResponse && typeof parsedResponse.points === 'number' && typeof parsedResponse.response === 'string') {
                    return parsedResponse as GenerateEcoScoreResponse;
                } else {
                    console.error('Invalid response format:', response);
                    return;
                }
            } catch (e) {
                console.error('Error parsing response:', e);
                return;
            }
        }
    }
    return;
}