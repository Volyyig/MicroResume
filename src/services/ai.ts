import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''
const genAI = new GoogleGenerativeAI(API_KEY)

export const improveResumeContent = async (text: string): Promise<string> => {
    if (!API_KEY) {
        throw new Error('Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file.')
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `
    You are a professional resume writer and career coach. 
    Review the following bullet point or description from a resume and rewrite it to be more impactful, 
    using strong action verbs and including metrics or results where possible. 
    Keep it concise and professional.
    
    Original Content: "${text}"
    
    Improved Content:
  `

    try {
        const result = await model.generateContent(prompt)
        const response = await result.response
        return response.text().trim()
    } catch (error) {
        console.error('Gemini API Error:', error)
        throw new Error('Failed to polish content with AI.')
    }
}
