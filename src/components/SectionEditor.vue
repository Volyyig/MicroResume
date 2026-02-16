<script setup lang="ts">
import { useResumeStore, type SectionType } from '../stores/resume'
import ProfessionalEditor from './ProfessionalEditor.vue'
import BulletsEditor from './BulletsEditor.vue'
import TextEditor from './TextEditor.vue'
import TagsEditor from './TagsEditor.vue'

const store = useResumeStore()

const props = defineProps<{
    sectionId: string
    isFirst: boolean
    isLast: boolean
}>()

const getSection = () => store.resume.sections.find(s => s.id === props.sectionId)!

const TYPE_LABELS: Record<SectionType, string> = {
    professional: 'Professional',
    bullets: 'Bullet Points',
    text: 'Plain Text',
    tags: 'Skills / Tags'
}

const onTypeChange = (e: Event) => {
    store.changeSectionType(props.sectionId, (e.target as HTMLSelectElement).value as SectionType)
}
</script>

<template>
    <section class="section-card">
        <!-- Header bar -->
        <div class="card-header">
            <div class="header-left">
                <input v-model="getSection().title" class="title-input" placeholder="Section Title" />
                <select :value="getSection().type" @change="onTypeChange" class="input type-select">
                    <option v-for="(label, key) in TYPE_LABELS" :key="key" :value="key">{{ label }}</option>
                </select>
            </div>
            <div class="header-actions">
                <!-- Move up -->
                <button v-if="!isFirst" @click="store.moveSection(sectionId, 'up')" class="btn-icon" title="Move Up">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="18 15 12 9 6 15" />
                    </svg>
                </button>
                <!-- Move down -->
                <button v-if="!isLast" @click="store.moveSection(sectionId, 'down')" class="btn-icon" title="Move Down">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </button>
                <!-- Add item -->
                <button v-if="getSection().type !== 'text'" @click="store.addItem(sectionId)" class="btn-icon btn-add"
                    title="Add Item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                </button>
                <!-- Duplicate -->
                <button @click="store.duplicateSection(sectionId)" class="btn-icon" title="Duplicate Section">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                </button>
                <!-- Delete -->
                <button @click="store.removeSection(sectionId)" class="btn-icon btn-danger" title="Remove Section">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                </button>
            </div>
        </div>

        <!-- Content editor dispatched by type -->
        <div class="card-body">
            <ProfessionalEditor v-if="getSection().type === 'professional'" :section-id="sectionId" />
            <BulletsEditor v-else-if="getSection().type === 'bullets'" :section-id="sectionId" />
            <TextEditor v-else-if="getSection().type === 'text'" :section-id="sectionId" />
            <TagsEditor v-else-if="getSection().type === 'tags'" :section-id="sectionId" />
        </div>
    </section>
</template>

<style scoped>
.section-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    overflow: hidden;
    transition: border-color var(--transition-fast);
}

.section-card:hover {
    border-color: var(--color-text-tertiary);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-md);
    border-bottom: 1px solid var(--color-border);
    background: var(--color-surface-hover);
    gap: var(--spacing-sm);
}

.header-left {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    flex: 1;
    min-width: 0;
}

.title-input {
    border: none;
    background: transparent;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--color-text-primary);
    padding: 4px 0;
    flex: 1;
    min-width: 80px;
    outline: none;
    font-family: inherit;
    border-bottom: 2px solid transparent;
    transition: border-color var(--transition-fast);
}

.title-input:focus {
    border-bottom-color: var(--color-accent);
}

.type-select {
    width: auto;
    min-width: 100px;
    font-size: 0.75rem;
    padding: 4px 28px 4px 8px;
    color: var(--color-text-secondary);
    background-color: var(--color-surface);
}

.header-actions {
    display: flex;
    gap: 4px;
    flex-shrink: 0;
}

.btn-icon {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    color: var(--color-text-tertiary);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
}

.btn-icon:hover {
    background: var(--color-bg);
    color: var(--color-text-secondary);
}

.btn-add:hover {
    background: var(--color-accent-bg);
    color: var(--color-accent);
}

.btn-danger:hover {
    background: var(--color-danger-bg);
    color: var(--color-danger);
}

.card-body {
    padding: var(--spacing-md);
}
</style>
