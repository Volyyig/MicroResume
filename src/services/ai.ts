import { GoogleGenAI } from '@google/genai'

// Vite uses VITE_ prefix for env vars
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''

// The SDK can take an apiKey in the constructor if not set in environment
const ai = new GoogleGenAI({ apiKey: API_KEY })

export const improveResumeContent = async (text: string): Promise<string> => {
    if (!API_KEY) {
        throw new Error('API Key missing. Please set VITE_GEMINI_API_KEY in your .env file.')
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: `As a professional resume expert, improve this bullet point to be more impactful and result-oriented: "${text}"`
        })

        return response.text?.trim() || ''
    } catch (error: any) {
        console.error('Gemini API Error:', error)
        throw new Error(`AI Error: ${error.message || 'Check your API Key and network.'}`)
    }
}
