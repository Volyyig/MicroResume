import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export interface Section {
    id: string
    title: string
    type: 'list' | 'tags' | 'text'
    content: any[]
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
    sections: [
        {
            id: 'experience',
            title: 'Experience',
            type: 'list',
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
            type: 'list',
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
            content: ['Vue.ts', 'TypeScript', 'Node.js', 'AI Integration']
        }
    ]
}

export const useResumeStore = defineStore('resume', () => {
    const savedData = localStorage.getItem('micro-resume-data')
    const initialData: ResumeData = savedData
        ? JSON.parse(savedData)
        : DEFAULT_RESUME

    // Migration: Ensure new fields (like styles) exist even for old saved data
    const resume = ref<ResumeData>({
        ...DEFAULT_RESUME,
        ...initialData,
        header: { ...DEFAULT_RESUME.header, ...initialData.header },
        styles: { ...DEFAULT_RESUME.styles, ...initialData.styles }
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
            type: 'list',
            content: []
        })
    }

    const removeSection = (sectionId: string) => {
        resume.value.sections = resume.value.sections.filter(s => s.id !== sectionId)
    }

    const addItem = (sectionId: string) => {
        const section = resume.value.sections.find(s => s.id === sectionId)
        if (!section) return

        if (section.type === 'list') {
            section.content.push({
                id: Date.now().toString(),
                company: 'New Item',
                role: 'Description',
                period: 'Period',
                description: 'Details go here...'
            })
        } else if (section.type === 'tags') {
            section.content.push('New Skill')
        }
    }

    const removeItem = (sectionId: string, itemId: string | number) => {
        const section = resume.value.sections.find(s => s.id === sectionId)
        if (!section) return

        if (section.type === 'list') {
            section.content = section.content.filter((item: any) => item.id !== itemId)
        } else if (section.type === 'tags') {
            section.content.splice(itemId as number, 1)
        }
    }

    return {
        resume,
        updateHeader,
        addSection,
        removeSection,
        addItem,
        removeItem
    }
})
