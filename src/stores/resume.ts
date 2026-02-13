import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export interface Section {
    id: string
    title: string
    content: string | any[]
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
    sections: [
        {
            id: 'experience',
            title: 'Experience',
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
            content: ['Vue.ts', 'TypeScript', 'Node.js', 'AI Integration']
        }
    ]
}

export const useResumeStore = defineStore('resume', () => {
    const resume = ref<ResumeData>(
        JSON.parse(localStorage.getItem('micro-resume-data') || JSON.stringify(DEFAULT_RESUME))
    )

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

    const updateSection = (sectionId: string, content: any) => {
        const section = resume.value.sections.find(s => s.id === sectionId)
        if (section) {
            section.content = content
        }
    }

    const addExperience = () => {
        const expSection = resume.value.sections.find(s => s.id === 'experience')
        if (expSection && Array.isArray(expSection.content)) {
            expSection.content.push({
                id: Date.now().toString(),
                company: 'New Company',
                role: 'Role Name',
                period: 'Period',
                description: 'Description of your achievements.'
            })
        }
    }

    return {
        resume,
        updateHeader,
        updateSection,
        addExperience
    }
})
