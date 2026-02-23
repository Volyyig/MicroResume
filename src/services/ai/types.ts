export type AIProvider = 'gemini' | 'zhipu'

export interface AIImproveOptions {
    text: string
    apiKey?: string
}

export interface AIService {
    improve(options: AIImproveOptions): Promise<string>
}
