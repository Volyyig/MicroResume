import { GoogleGenAI } from '@google/genai'
import { PROMPTS } from './prompts'
import type { AIService, AIImproveOptions } from './types'

export class GeminiService implements AIService {
    async improve(options: AIImproveOptions): Promise<string> {
        const apiKey = options.apiKey || import.meta.env.VITE_GEMINI_API_KEY || ''

        if (!apiKey) {
            throw new Error('Gemini API Key missing.')
        }

        const genAI = new GoogleGenAI({ apiKey })

        try {
            const response = await genAI.models.generateContent({
                model: 'gemini-1.5-flash',
                contents: PROMPTS.improveBulletPoint(options.text)
            })
            return response.text?.trim() || ''
        } catch (error: any) {
            console.error('Gemini API Error:', error)
            throw new Error(`Gemini Error: ${error.message || 'API call failed'}`)
        }
    }
}
