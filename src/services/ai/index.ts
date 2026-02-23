import type { AIProvider } from './types'
import { GeminiService } from './gemini'
import { ZhipuService } from './zhipu'

const gemini = new GeminiService()
const zhipu = new ZhipuService()

export const improveResumeContent = async (
    text: string,
    provider: AIProvider = 'gemini',
    apiKey?: string
): Promise<string> => {
    const service = provider === 'zhipu' ? zhipu : gemini
    return service.improve({ text, apiKey })
}
