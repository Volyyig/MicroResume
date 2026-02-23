<script setup lang="ts">
import { useResumeStore, type SectionType } from '../stores/resume'
import { computed, ref } from 'vue'
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

const section = computed(() => store.resume.sections.find(s => s.id === props.sectionId)!)

const TYPE_LABELS: Record<SectionType, string> = {
    professional: 'Professional',
    bullets: 'Bullet Points',
    text: 'Plain Text',
    tags: 'Skills / Tags'
}

const showAddMenu = ref(false)

const addBlock = (type: SectionType) => {
    store.addBlock(props.sectionId, type)
    showAddMenu.value = false
}
</script>

<template>
    <section class="section-card">
        <!-- Header bar -->
        <div class="card-header">
            <div class="header-left">
                <input v-model="section.title" class="title-input" placeholder="Section Title" />
            </div>
            <div class="header-actions">
                <!-- Move section up -->
                <button v-if="!isFirst" @click="store.moveSection(sectionId, 'up')" class="btn-icon"
                    title="Move Section Up">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="18 15 12 9 6 15" />
                    </svg>
                </button>
                <!-- Move section down -->
                <button v-if="!isLast" @click="store.moveSection(sectionId, 'down')" class="btn-icon"
                    title="Move Section Down">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </button>
                <!-- Add Block Menu -->
                <div class="add-block-container">
                    <button @click="showAddMenu = !showAddMenu" class="btn-icon btn-add" title="Add Content Block">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                    </button>
                    <div v-if="showAddMenu" class="add-menu">
                        <button v-for="(label, key) in TYPE_LABELS" :key="key" @click="addBlock(key as SectionType)"
                            class="menu-item">
                            {{ label }}
                        </button>
                    </div>
                </div>
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

        <!-- Content blocks -->
        <div class="card-body">
            <div v-for="(block, bIdx) in section.blocks" :key="block.id" class="block-wrapper">
                <div class="block-toolbar">
                    <span class="block-type">{{ TYPE_LABELS[block.type] }}</span>
                    <div class="block-actions">
                        <!-- Add item to block -->
                        <button v-if="block.type !== 'text'" @click="store.addItem(sectionId, block.id)"
                            class="btn-block-action" title="Add Item">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                        </button>
                        <!-- Move block up -->
                        <button v-if="bIdx > 0" @click="store.moveBlock(sectionId, block.id, 'up')"
                            class="btn-block-action" title="Move Block Up">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <polyline points="18 15 12 9 6 15" />
                            </svg>
                        </button>
                        <!-- Move block down -->
                        <button v-if="bIdx < section.blocks.length - 1"
                            @click="store.moveBlock(sectionId, block.id, 'down')" class="btn-block-action"
                            title="Move Block Down">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </button>
                        <!-- Remove block -->
                        <button @click="store.removeBlock(sectionId, block.id)" class="btn-block-action btn-danger-text"
                            title="Remove Block">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
                            </svg>
                        </button>
                    </div>
                </div>
                <ProfessionalEditor v-if="block.type === 'professional'" :section-id="sectionId" :block-id="block.id" />
                <BulletsEditor v-else-if="block.type === 'bullets'" :section-id="sectionId" :block-id="block.id" />
                <TextEditor v-else-if="block.type === 'text'" :section-id="sectionId" :block-id="block.id" />
                <TagsEditor v-else-if="block.type === 'tags'" :section-id="sectionId" :block-id="block.id" />
            </div>
            <div v-if="section.blocks.length === 0" class="empty-section">
                No content blocks yet. Click the + button to add one.
            </div>
        </div>
    </section>
</template>

<style scoped>
.section-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    overflow: visible;
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
    padding: var(--spacing-sm) var(--spacing-md) var(--spacing-md);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
}

.block-wrapper {
    position: relative;
    padding-top: var(--spacing-sm);
    border-top: 1px dashed var(--color-border);
}

.block-wrapper:first-child {
    border-top: none;
    padding-top: 0;
}

.block-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-xs);
}

.block-type {
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--color-text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.block-actions {
    display: flex;
    gap: 2px;
}

.btn-block-action {
    padding: 2px;
    background: transparent;
    border: none;
    color: var(--color-text-tertiary);
    cursor: pointer;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-fast);
}

.btn-block-action:hover {
    background: var(--color-surface-hover);
    color: var(--color-text-secondary);
}

.btn-danger-text:hover {
    color: var(--color-danger);
}

.add-block-container {
    position: relative;
}

.add-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
    z-index: 10;
    min-width: 140px;
    padding: 4px;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.menu-item {
    padding: 6px 12px;
    font-size: 0.8rem;
    text-align: left;
    background: transparent;
    border: none;
    color: var(--color-text-secondary);
    cursor: pointer;
    border-radius: var(--radius-sm);
    transition: background var(--transition-fast);
}

.menu-item:hover {
    background: var(--color-surface-hover);
    color: var(--color-text-primary);
}

.empty-section {
    padding: var(--spacing-lg);
    text-align: center;
    color: var(--color-text-tertiary);
    font-size: 0.85rem;
    font-style: italic;
    background: var(--color-surface-hover);
    border-radius: var(--radius-md);
    border: 2px dashed var(--color-border);
}
</style>
