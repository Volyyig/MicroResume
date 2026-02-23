import type { AIService, AIImproveOptions } from './types'

export class ZhipuService implements AIService {
    async improve(options: AIImproveOptions): Promise<string> {
        const apiKey = options.apiKey || import.meta.env.VITE_ZHIPU_API_KEY || ''

        if (!apiKey) {
            throw new Error('Zhipu AI API Key missing.')
        }

        try {
            const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'glm-4-flash',
                    messages: [
                        {
                            role: 'user',
                            content: `As a professional resume expert, improve this bullet point to be more impactful and result-oriented: "${options.text}"`
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
}
