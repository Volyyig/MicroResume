import { GoogleGenAI } from '@google/genai'

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
// Note: In Vite, we map our VITE_GEMINI_API_KEY to the expected name or pass it explicitly.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''
const ai = new GoogleGenAI({ apiKey: API_KEY })

export const improveResumeContent = async (text: string): Promise<string> => {
    if (!API_KEY) {
        throw new Error('Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file.')
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash', // Keeping 1.5-flash as default stable, user can switch to gemini-2-flash-preview or similar if needed
            contents: `
                You are a professional resume writer. 
                Improve this resume bullet point to be more impactful and professional: 
                "${text}"
            `,
        })

        return response.text?.trim() || ''
    } catch (error: any) {
        console.error('Gemini API Error:', error)
        throw new Error('Failed to polish content with AI: ' + (error.message || 'Unknown error'))
    }
}
