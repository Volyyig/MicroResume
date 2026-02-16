import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type SectionType = 'professional' | 'text' | 'bullets' | 'tags'

export interface Section {
    id: string
    title: string
    type: SectionType
    content: any // Can be string, string[], or object[]
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
        },
        {
            id: 'education',
            title: 'Education',
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
        },
        {
            id: 'skills',
            title: 'Skills',
            type: 'tags',
            content: ['Vue.js', 'TypeScript', 'Node.js', 'AI Integration']
        }
    ]
}

export const useResumeStore = defineStore('resume', () => {
    const savedData = localStorage.getItem('micro-resume-data')
    const initialData: ResumeData = savedData
        ? JSON.parse(savedData)
        : DEFAULT_RESUME

    // Migration logic
    const resume = ref<ResumeData>({
        ...DEFAULT_RESUME,
        ...initialData,
        header: { ...DEFAULT_RESUME.header, ...initialData.header },
        styles: { ...DEFAULT_RESUME.styles, ...initialData.styles },
        settings: { ...DEFAULT_RESUME.settings, ...initialData.settings },
        sections: (initialData.sections || DEFAULT_RESUME.sections).map(s => {
            // Backward compatibility for old 'list' type
            if ((s.type as string) === 'list') s.type = 'professional'
            return s
        })
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

    const SECTION_TYPE_DEFAULTS: Record<SectionType, { title: string; content: any }> = {
        professional: { title: 'Experience', content: [] },
        bullets: { title: 'Highlights', content: [] },
        text: { title: 'Summary', content: '' },
        tags: { title: 'Skills', content: [] }
    }

    const addSection = (type: SectionType = 'professional') => {
        const defaults = SECTION_TYPE_DEFAULTS[type]
        resume.value.sections.push({
            id: Date.now().toString(),
            title: defaults.title,
            type,
            content: Array.isArray(defaults.content) ? [...defaults.content] : defaults.content
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
        
        const sections = resume.value.sections
            ;[sections[idx], sections[targetIdx]] = [sections[targetIdx]!, sections[idx]!]
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

    const changeSectionType = (sectionId: string, newType: SectionType) => {
        const section = resume.value.sections.find(s => s.id === sectionId)
        if (!section || section.type === newType) return

        section.type = newType
        if (newType === 'text') {
            section.content = ''
        } else if (newType === 'tags' || newType === 'bullets') {
            section.content = []
        } else if (newType === 'professional') {
            section.content = []
        }
    }

    const addItem = (sectionId: string) => {
        const section = resume.value.sections.find(s => s.id === sectionId)
        if (!section) return

        if (section.type === 'professional') {
            section.content.push({
                id: Date.now().toString(),
                company: 'New Item',
                role: 'Description',
                period: 'Period',
                description: 'Details go here...'
            })
        } else if (section.type === 'tags' || section.type === 'bullets') {
            section.content.push(section.type === 'tags' ? 'New Tag' : 'New point...')
        }
    }

    const removeItem = (sectionId: string, indexOrId: string | number) => {
        const section = resume.value.sections.find(s => s.id === sectionId)
        if (!section) return

        if (section.type === 'professional') {
            section.content = section.content.filter((item: any) => item.id !== indexOrId)
        } else if (Array.isArray(section.content)) {
            section.content.splice(indexOrId as number, 1)
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
        changeSectionType,
        addItem,
        removeItem
    }
})
