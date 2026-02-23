<script setup lang="ts">
import { useResumeStore } from '../stores/resume'

const store = useResumeStore()
</script>

<template>
    <div class="toolbar">
        <button @click="store.addSection()" class="add-section-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add New Section (Title)
        </button>
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

.add-section-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    padding: 12px;
    width: 100%;
    border: 1px dashed var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
    color: var(--color-text-secondary);
    font-family: inherit;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
}

.add-section-btn:hover {
    border-color: var(--color-accent);
    border-style: solid;
    color: var(--color-accent);
    background: var(--color-accent-bg);
}
</style>
