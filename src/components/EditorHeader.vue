<script setup lang="ts">
import { useResumeStore } from '../stores/resume'
import { Undo2, Redo2 } from 'lucide-vue-next'

const store = useResumeStore()
</script>

<template>
    <section class="editor-section">
        <div class="section-header">
            <h3 class="section-label">Contact Info</h3>
            <div class="header-actions">
                <button @click="store.undo('header')" class="btn-icon" :disabled="!store.canUndo('header')"
                    title="Undo">
                    <Undo2 :size="14" />
                </button>
                <button @click="store.redo('header')" class="btn-icon" :disabled="!store.canRedo('header')"
                    title="Redo">
                    <Redo2 :size="14" />
                </button>
            </div>
        </div>
        <div class="field-group">
            <input v-model="store.resume.header.fullName" placeholder="Full Name" class="input"
                @focus="store.recordHistory('header')" />
            <input v-model="store.resume.header.title" placeholder="Job Title" class="input"
                @focus="store.recordHistory('header')" />
            <div class="input-row">
                <input v-model="store.resume.header.email" placeholder="Email" class="input"
                    @focus="store.recordHistory('header')" />
                <input v-model="store.resume.header.phone" placeholder="Phone" class="input"
                    @focus="store.recordHistory('header')" />
            </div>
            <input v-model="store.resume.header.location" placeholder="Location" class="input"
                @focus="store.recordHistory('header')" />
        </div>
    </section>
</template>

<style scoped>
.editor-section {
    margin-bottom: var(--spacing-lg);
}

.section-label {
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-secondary);
    margin: 0;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-md);
}

.header-actions {
    display: flex;
    gap: 4px;
}

.btn-icon {
    width: 28px;
    height: 28px;
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

.btn-icon:hover:not(:disabled) {
    background: var(--color-bg);
    color: var(--color-text-secondary);
}

.btn-icon:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.field-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
}

.input-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-sm);
}
</style>
