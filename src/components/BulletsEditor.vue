<script setup lang="ts">
import { useResumeStore } from '../stores/resume'

const store = useResumeStore()

const props = defineProps<{
    sectionId: string
}>()

const getSection = () => store.resume.sections.find(s => s.id === props.sectionId)!
</script>

<template>
    <div class="bullets-list">
        <div v-for="(_point, idx) in getSection().content" :key="idx" class="bullet-row">
            <span class="bullet-marker">•</span>
            <textarea v-model="getSection().content[idx]" placeholder="Achievement / Point..."
                class="input bullet-input"></textarea>
            <button @click="store.removeItem(sectionId, idx)" class="btn-remove" title="Remove">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>
        </div>
    </div>
</template>

<style scoped>
.bullets-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
}

.bullet-row {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-sm);
}

.bullet-marker {
    color: var(--color-accent);
    font-size: 1.1rem;
    line-height: 38px;
    flex-shrink: 0;
    width: 14px;
    text-align: center;
}

.bullet-input {
    flex: 1;
    min-height: 42px;
    resize: vertical;
}

.btn-remove {
    flex-shrink: 0;
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
    margin-top: 4px;
}

.btn-remove:hover {
    background: var(--color-danger-bg);
    color: var(--color-danger);
}
</style>
