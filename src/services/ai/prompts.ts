/**
 * AI Prompts for Resume Improvement
 */

export const PROMPTS = {
    /**
     * Improve a resume bullet point
     */
    improveBulletPoint: (text: string) => {
        return `你是一位资深的简历专家和职业顾问。请优化以下简历描述，使其更具冲击力、结果导向且专业。

优化原则：
1. 使用强有力的动词（如：主导、设计、重构、提升）。
2. 强调成果和影响力，尽可能进行量化（如：提升了 30% 性能、节省了 500 小时/年）。
3. 遵循“动词 + 任务内容 + 结果/价值”的结构。
4. 语言精炼，避免啰嗦。
5. 必须使用简体中文回复。
6. **仅输出优化后的单条描述内容**，不要包含任何前言、解释、引号或转义字符。

原始描述：
"${text}"

优化后的描述：`.trim()
    }
}
