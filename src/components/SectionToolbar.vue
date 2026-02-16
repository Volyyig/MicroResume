<script setup lang="ts">
import { useResumeStore, type SectionType } from '../stores/resume'

const store = useResumeStore()

const sectionTypes: { type: SectionType; label: string; icon: string; desc: string }[] = [
    { type: 'professional', label: 'Professional', icon: '💼', desc: 'Company, role, description' },
    { type: 'bullets', label: 'Bullet Points', icon: '•', desc: 'List of achievements' },
    { type: 'text', label: 'Plain Text', icon: '¶', desc: 'Free-form paragraph' },
    { type: 'tags', label: 'Skills / Tags', icon: '🏷', desc: 'Comma-separated tags' }
]
</script>

<template>
    <div class="toolbar">
        <span class="toolbar-label">Add Section</span>
        <div class="type-buttons">
            <button v-for="item in sectionTypes" :key="item.type" @click="store.addSection(item.type)" class="type-btn"
                :title="item.desc">
                <span class="type-icon">{{ item.icon }}</span>
                <span class="type-name">{{ item.label }}</span>
            </button>
        </div>
    </div>
</template>

<style scoped>
.toolbar {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    padding: var(--spacing-md) 0;
}

.toolbar-label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-tertiary);
}

.type-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-sm);
}

.type-btn {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: 10px 14px;
    border: 1px dashed var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
    color: var(--color-text-secondary);
    font-family: inherit;
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
}

.type-btn:hover {
    border-color: var(--color-accent);
    border-style: solid;
    color: var(--color-accent);
    background: var(--color-accent-bg);
}

.type-icon {
    font-size: 1rem;
    width: 20px;
    text-align: center;
}
</style>
