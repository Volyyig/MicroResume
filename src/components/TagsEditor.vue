<script setup lang="ts">
import { useResumeStore } from '../stores/resume'

const store = useResumeStore()

const props = defineProps<{
    sectionId: string
}>()

const getSection = () => store.resume.sections.find(s => s.id === props.sectionId)!
</script>

<template>
    <div class="tags-editor">
        <div class="tags-grid">
            <div v-for="(_tag, idx) in getSection().content" :key="idx" class="tag-chip">
                <input v-model="getSection().content[idx]" class="tag-input" />
                <button @click="store.removeItem(sectionId, idx)" class="tag-remove" title="Remove">×</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.tags-grid {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
}

.tag-chip {
    display: flex;
    align-items: center;
    background: var(--color-accent-bg);
    border: 1px solid rgba(79, 70, 229, 0.15);
    border-radius: var(--radius-full);
    padding: 4px 6px 4px 14px;
    gap: 4px;
    transition: all var(--transition-fast);
}

.tag-chip:hover {
    border-color: var(--color-accent);
}

.tag-input {
    border: none;
    background: transparent;
    color: var(--color-accent-text);
    font-size: 0.825rem;
    font-weight: 500;
    font-family: inherit;
    width: 80px;
    padding: 2px 0;
    outline: none;
}

.tag-remove {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    color: var(--color-accent);
    border-radius: 50%;
    cursor: pointer;
    font-size: 1rem;
    opacity: 0.5;
    transition: all var(--transition-fast);
}

.tag-remove:hover {
    opacity: 1;
    background: rgba(79, 70, 229, 0.15);
}
</style>
