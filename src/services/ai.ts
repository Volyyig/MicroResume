import { GoogleGenAI } from '@google/genai'

// Environment variables
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''
const ZHIPU_API_KEY = import.meta.env.VITE_ZHIPU_API_KEY || ''

// Clients
const geminiClient = new GoogleGenAI({ apiKey: GEMINI_API_KEY })

/**
 * Universal router for AI content improvement
 */
export const improveResumeContent = async (text: string, provider: 'gemini' | 'zhipu' = 'gemini'): Promise<string> => {
    if (provider === 'zhipu') {
        return improveWithZhipu(text)
    }
    return improveWithGemini(text)
}

/**
 * Internal: Gemini Implementation
 */
async function improveWithGemini(text: string): Promise<string> {
    if (!GEMINI_API_KEY) {
        throw new Error('Gemini API Key missing.')
    }

    try {
        const response = await geminiClient.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: `As a professional resume expert, improve this bullet point to be more impactful and result-oriented: "${text}"`
        })
        return response.text?.trim() || ''
    } catch (error: any) {
        console.error('Gemini API Error:', error)
        throw new Error(`Gemini Error: ${error.message || 'API call failed'}`)
    }
}

/**
 * Internal: Zhipu AI Implementation (OpenAI-compatible)
 */
async function improveWithZhipu(text: string): Promise<string> {
    if (!ZHIPU_API_KEY) {
        throw new Error('Zhipu AI API Key missing.')
    }

    try {
        // Zhipu AI supports OpenAI-compatible API at: https://open.bigmodel.cn/api/paas/v4/chat/completions
        const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ZHIPU_API_KEY}`
            },
            body: JSON.stringify({
                model: 'glm-4-flash', // Cost-effective flash model
                messages: [
                    {
                        role: 'user',
                        content: `As a professional resume expert, improve this bullet point to be more impactful and result-oriented: "${text}"`
                    }
                ],
                temperature: 0.7
            })
        })

        if (!response.ok) {
            const err = await response.json()
            throw new Error(err.error?.message || 'Zhipu API request failed')
        }

        const data = await response.json()
        return data.choices[0]?.message?.content?.trim() || ''
    } catch (error: any) {
        console.error('Zhipu AI Error:', error)
        throw new Error(`Zhipu Error: ${error.message || 'API call failed'}`)
    }
}
