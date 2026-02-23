import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type SectionType = 'three-section' | 'text' | 'list-unordered' | 'list-ordered'

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
        geminiKey: string
        zhipuKey: string
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
        aiProvider: 'gemini',
        geminiKey: '',
        zhipuKey: ''
    },
    sections: [
        {
            id: 'experience',
            title: 'Experience',
            blocks: [
                {
                    id: 'exp-block-1',
                    type: 'three-section',
                    content: [
                        {
                            id: 'exp1',
                            left: 'Tech Corp',
                            center: 'Senior Developer',
                            right: '2021 - Present'
                        }
                    ]
                },
                {
                    id: 'exp-block-2',
                    type: 'list-unordered',
                    content: ['Leading the frontend team to build high-performance applications.']
                }
            ]
        },
        {
            id: 'education',
            title: 'Education',
            blocks: [
                {
                    id: 'edu-block-1',
                    type: 'three-section',
                    content: [
                        {
                            id: 'edu1',
                            left: 'University of Engineering',
                            center: 'B.S. in Computer Science',
                            right: '2017 - 2021'
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
                    type: 'text',
                    content: 'Vue.js, TypeScript, Node.js, AI Integration'
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
    const migrateBlock = (b: any): Block[] => {
        if (b.type === 'professional') {
            const threeSectionBlock: Block = {
                id: b.id + '-3s',
                type: 'three-section',
                content: (b.content || []).map((item: any) => ({
                    id: item.id || Date.now().toString() + Math.random(),
                    left: item.company || item.school || '',
                    center: item.role || item.degree || '',
                    right: item.period || ''
                }))
            }
            const descBlocks: Block[] = (b.content || [])
                .filter((item: any) => item.description)
                .map((item: any) => ({
                    id: item.id + '-desc',
                    type: 'list-unordered',
                    content: [item.description]
                }))
            return [threeSectionBlock, ...descBlocks]
        }
        if (b.type === 'bullets') {
            return [{ ...b, type: 'list-unordered' }]
        }
        if (b.type === 'tags') {
            return [{
                id: b.id,
                type: 'text',
                content: Array.isArray(b.content) ? b.content.join(', ') : b.content
            }]
        }
        return [b]
    }

    const sections = (initialData.sections || DEFAULT_RESUME.sections).map((s: any) => {
        // Old format (single level)
        if (s.type && s.content !== undefined && !s.blocks) {
            const blocks = migrateBlock({ id: Date.now().toString(), type: s.type, content: s.content })
            return { id: s.id, title: s.title, blocks }
        }
        // Intermediate format (blocks, but old types)
        if (s.blocks) {
            const newBlocks: Block[] = []
            s.blocks.forEach((b: any) => {
                newBlocks.push(...migrateBlock(b))
            })
            return { ...s, blocks: newBlocks }
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

    // History Management
    const historyStacks = ref<Record<string, { undo: string[], redo: string[] }>>({})
    const MAX_HISTORY = 20

    const findBlock = (blockId: string) => {
        for (const section of resume.value.sections) {
            const block = section.blocks.find(b => b.id === blockId)
            if (block) return { block, section }
        }
        return null
    }

    const recordHistory = (id: 'header' | string) => {
        if (!historyStacks.value[id]) {
            historyStacks.value[id] = { undo: [], redo: [] }
        }

        let content = ''
        if (id === 'header') {
            content = JSON.stringify(resume.value.header)
        } else {
            const section = resume.value.sections.find(s => s.id === id)
            if (section) {
                content = JSON.stringify(section)
            } else {
                const blockData = findBlock(id)
                if (blockData) {
                    content = JSON.stringify(blockData.block)
                }
            }
        }

        if (!content) return

        const stack = historyStacks.value[id]
        if (stack.undo.length > 0 && stack.undo[stack.undo.length - 1] === content) return

        stack.undo.push(content)
        if (stack.undo.length > MAX_HISTORY) {
            stack.undo.shift()
        }
        stack.redo = []
    }

    const undo = (id: 'header' | string) => {
        const stack = historyStacks.value[id]
        if (!stack || stack.undo.length === 0) return

        let currentContent = ''
        if (id === 'header') {
            currentContent = JSON.stringify(resume.value.header)
        } else {
            const section = resume.value.sections.find(s => s.id === id)
            if (section) {
                currentContent = JSON.stringify(section)
            } else {
                const blockData = findBlock(id)
                if (blockData) {
                    currentContent = JSON.stringify(blockData.block)
                }
            }
        }

        stack.redo.push(currentContent)

        const previousContent = JSON.parse(stack.undo.pop()!)
        if (id === 'header') {
            resume.value.header = previousContent
        } else {
            const sectionIdx = resume.value.sections.findIndex(s => s.id === id)
            if (sectionIdx !== -1) {
                resume.value.sections[sectionIdx] = previousContent
            } else {
                const blockData = findBlock(id)
                if (blockData) {
                    const bIdx = blockData.section.blocks.findIndex(b => b.id === id)
                    if (bIdx !== -1) {
                        blockData.section.blocks[bIdx] = previousContent
                    }
                }
            }
        }
    }

    const redo = (id: 'header' | string) => {
        const stack = historyStacks.value[id]
        if (!stack || stack.redo.length === 0) return

        let currentContent = ''
        if (id === 'header') {
            currentContent = JSON.stringify(resume.value.header)
        } else {
            const section = resume.value.sections.find(s => s.id === id)
            if (section) {
                currentContent = JSON.stringify(section)
            } else {
                const blockData = findBlock(id)
                if (blockData) {
                    currentContent = JSON.stringify(blockData.block)
                }
            }
        }

        stack.undo.push(currentContent)

        const nextContent = JSON.parse(stack.redo.pop()!)
        if (id === 'header') {
            resume.value.header = nextContent
        } else {
            const sectionIdx = resume.value.sections.findIndex(s => s.id === id)
            if (sectionIdx !== -1) {
                resume.value.sections[sectionIdx] = nextContent
            } else {
                const blockData = findBlock(id)
                if (blockData) {
                    const bIdx = blockData.section.blocks.findIndex(b => b.id === id)
                    if (bIdx !== -1) {
                        blockData.section.blocks[bIdx] = nextContent
                    }
                }
            }
        }
    }

    const canUndo = (id: 'header' | string) => !!historyStacks.value[id]?.undo.length
    const canRedo = (id: 'header' | string) => !!historyStacks.value[id]?.redo.length

    watch(
        resume,
        (newData) => {
            localStorage.setItem('micro-resume-data', JSON.stringify(newData))
        },
        { deep: true }
    )

    const updateHeader = (data: Partial<ResumeData['header']>) => {
        recordHistory('header')
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
        delete historyStacks.value[sectionId]
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
        'three-section': [],
        'text': '',
        'list-unordered': [],
        'list-ordered': []
    }

    const addBlock = (sectionId: string, type: SectionType) => {
        const section = resume.value.sections.find(s => s.id === sectionId)
        if (!section) return
        recordHistory(sectionId)
        section.blocks.push({
            id: Date.now().toString(),
            type,
            content: Array.isArray(BLOCK_TYPE_DEFAULTS[type]) ? [] : BLOCK_TYPE_DEFAULTS[type]
        })
    }

    const removeBlock = (sectionId: string, blockId: string) => {
        const section = resume.value.sections.find(s => s.id === sectionId)
        if (!section) return
        recordHistory(sectionId)
        section.blocks = section.blocks.filter(b => b.id !== blockId)
    }

    const moveBlock = (sectionId: string, blockId: string, direction: 'up' | 'down') => {
        const section = resume.value.sections.find(s => s.id === sectionId)
        if (!section) return
        recordHistory(sectionId)
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

        recordHistory(sectionId)
        if (block.type === 'three-section') {
            block.content.push({
                id: Date.now().toString(),
                left: 'Left',
                center: 'Center',
                right: 'Right'
            })
        } else if (block.type === 'list-unordered' || block.type === 'list-ordered') {
            block.content.push('New item...')
        }
    }

    const removeItem = (sectionId: string, blockId: string, indexOrId: string | number) => {
        const section = resume.value.sections.find(s => s.id === sectionId)
        if (!section) return
        const block = section.blocks.find(b => b.id === blockId)
        if (!block) return

        recordHistory(sectionId)
        if (block.type === 'three-section') {
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
        removeItem,
        undo,
        redo,
        recordHistory,
        canUndo,
        canRedo
    }
})

