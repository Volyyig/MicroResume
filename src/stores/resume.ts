import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type SectionType = 'professional' | 'text' | 'bullets' | 'tags'

export interface Block {
    id: string
    type: SectionType
    content: any // Can be string, string[], or object[]
}

export interface Section {
    id: string
    title: string
    blocks: Block[]
}

export interface ResumeData {
    header: {
        fullName: string
        title: string
        email: string
        phone: string
        location: string
        website: string
    }
    sections: Section[]
    styles: {
        fontSize: number
        lineHeight: number
        pageMargin: number
        sectionSpacing: number
    }
    settings: {
        aiProvider: 'gemini' | 'zhipu'
    }
}

const DEFAULT_RESUME: ResumeData = {
    header: {
        fullName: 'Your Name',
        title: 'Software Engineer',
        email: 'hello@example.com',
        phone: '+1 234 567 890',
        location: 'San Francisco, CA',
        website: 'linkedin.com/in/yourname'
    },
    styles: {
        fontSize: 14,
        lineHeight: 1.5,
        pageMargin: 20,
        sectionSpacing: 25
    },
    settings: {
        aiProvider: 'gemini'
    },
    sections: [
        {
            id: 'experience',
            title: 'Experience',
            blocks: [
                {
                    id: 'exp-block-1',
                    type: 'professional',
                    content: [
                        {
                            id: 'exp1',
                            company: 'Tech Corp',
                            role: 'Senior Developer',
                            period: '2021 - Present',
                            description: 'Leading the frontend team to build high-performance applications.'
                        }
                    ]
                }
            ]
        },
        {
            id: 'education',
            title: 'Education',
            blocks: [
                {
                    id: 'edu-block-1',
                    type: 'professional',
                    content: [
                        {
                            id: 'edu1',
                            school: 'University of Engineering',
                            degree: 'B.S. in Computer Science',
                            period: '2017 - 2021',
                            description: 'Specialized in Distributed Systems.'
                        }
                    ]
                }
            ]
        },
        {
            id: 'skills',
            title: 'Skills',
            blocks: [
                {
                    id: 'skills-block-1',
                    type: 'tags',
                    content: ['Vue.js', 'TypeScript', 'Node.js', 'AI Integration']
                }
            ]
        }
    ]
}

export const useResumeStore = defineStore('resume', () => {
    const savedData = localStorage.getItem('micro-resume-data')
    const initialData: any = savedData
        ? JSON.parse(savedData)
        : DEFAULT_RESUME

    // Migration logic
    const sections = (initialData.sections || DEFAULT_RESUME.sections).map((s: any) => {
        // If it's old format (has type/content instead of blocks)
        if (s.type && s.content !== undefined && !s.blocks) {
            let type = s.type
            if (type === 'list') type = 'professional'
            return {
                id: s.id,
                title: s.title,
                blocks: [
                    {
                        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                        type: type as SectionType,
                        content: s.content
                    }
                ]
            }
        }
        return s
    })

    const resume = ref<ResumeData>({
        ...DEFAULT_RESUME,
        ...initialData,
        header: { ...DEFAULT_RESUME.header, ...initialData.header },
        styles: { ...DEFAULT_RESUME.styles, ...initialData.styles },
        settings: { ...DEFAULT_RESUME.settings, ...initialData.settings },
        sections
    })

    watch(
        resume,
        (newData) => {
            localStorage.setItem('micro-resume-data', JSON.stringify(newData))
        },
        { deep: true }
    )

    const updateHeader = (data: Partial<ResumeData['header']>) => {
        resume.value.header = { ...resume.value.header, ...data }
    }

    const addSection = () => {
        resume.value.sections.push({
            id: Date.now().toString(),
            title: 'New Section',
            blocks: []
        })
    }

    const removeSection = (sectionId: string) => {
        resume.value.sections = resume.value.sections.filter(s => s.id !== sectionId)
    }

    const moveSection = (sectionId: string, direction: 'up' | 'down') => {
        const idx = resume.value.sections.findIndex(s => s.id === sectionId)
        if (idx === -1) return
        const targetIdx = direction === 'up' ? idx - 1 : idx + 1
        if (targetIdx < 0 || targetIdx >= resume.value.sections.length) return

        const sectionsArr = resume.value.sections
            ;[sectionsArr[idx], sectionsArr[targetIdx]] = [sectionsArr[targetIdx]!, sectionsArr[idx]!]
    }

    const duplicateSection = (sectionId: string) => {
        const section = resume.value.sections.find(s => s.id === sectionId)
        if (!section) return
        const idx = resume.value.sections.findIndex(s => s.id === sectionId)
        const clone: Section = {
            ...JSON.parse(JSON.stringify(section)),
            id: Date.now().toString(),
            title: `${section.title} (Copy)`
        }
        resume.value.sections.splice(idx + 1, 0, clone)
    }

    const changeAIProvider = (provider: 'gemini' | 'zhipu') => {
        resume.value.settings.aiProvider = provider
    }

    const BLOCK_TYPE_DEFAULTS: Record<SectionType, any> = {
        professional: [],
        bullets: [],
        text: '',
        tags: []
    }

    const addBlock = (sectionId: string, type: SectionType) => {
        const section = resume.value.sections.find(s => s.id === sectionId)
        if (!section) return
        section.blocks.push({
            id: Date.now().toString(),
            type,
            content: Array.isArray(BLOCK_TYPE_DEFAULTS[type]) ? [...BLOCK_TYPE_DEFAULTS[type]] : BLOCK_TYPE_DEFAULTS[type]
        })
    }

    const removeBlock = (sectionId: string, blockId: string) => {
        const section = resume.value.sections.find(s => s.id === sectionId)
        if (!section) return
        section.blocks = section.blocks.filter(b => b.id !== blockId)
    }

    const moveBlock = (sectionId: string, blockId: string, direction: 'up' | 'down') => {
        const section = resume.value.sections.find(s => s.id === sectionId)
        if (!section) return
        const idx = section.blocks.findIndex(b => b.id === blockId)
        if (idx === -1) return
        const targetIdx = direction === 'up' ? idx - 1 : idx + 1
        if (targetIdx < 0 || targetIdx >= section.blocks.length) return

        const blocksArr = section.blocks
            ;[blocksArr[idx], blocksArr[targetIdx]] = [blocksArr[targetIdx]!, blocksArr[idx]!]
    }

    const addItem = (sectionId: string, blockId: string) => {
        const section = resume.value.sections.find(s => s.id === sectionId)
        if (!section) return
        const block = section.blocks.find(b => b.id === blockId)
        if (!block) return

        if (block.type === 'professional') {
            block.content.push({
                id: Date.now().toString(),
                company: 'New Item',
                role: 'Description',
                period: 'Period',
                description: 'Details go here...'
            })
        } else if (block.type === 'tags' || block.type === 'bullets') {
            block.content.push(block.type === 'tags' ? 'New Tag' : 'New point...')
        }
    }

    const removeItem = (sectionId: string, blockId: string, indexOrId: string | number) => {
        const section = resume.value.sections.find(s => s.id === sectionId)
        if (!section) return
        const block = section.blocks.find(b => b.id === blockId)
        if (!block) return

        if (block.type === 'professional') {
            block.content = block.content.filter((item: any) => item.id !== indexOrId)
        } else if (Array.isArray(block.content)) {
            block.content.splice(indexOrId as number, 1)
        }
    }

    return {
        resume,
        updateHeader,
        addSection,
        removeSection,
        moveSection,
        duplicateSection,
        changeAIProvider,
        addBlock,
        removeBlock,
        moveBlock,
        addItem,
        removeItem
    }
})

