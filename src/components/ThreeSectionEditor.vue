<script setup lang="ts">
import { useResumeStore } from '../stores/resume'
import { computed } from 'vue'

const props = defineProps<{
    sectionId: string
    blockId: string
}>()

const store = useResumeStore()
const block = computed(() => {
    const section = store.resume.sections.find(s => s.id === props.sectionId)
    return section?.blocks.find(b => b.id === props.blockId)
})
</script>

<template>
    <div v-if="block" class="three-section-editor">
        <div v-for="item in block.content" :key="item.id" class="item-row card">
            <div class="row-inputs">
                <input v-model="item.left" placeholder="Left (e.g. School)" class="input-field" />
                <input v-model="item.center" placeholder="Center (e.g. Major)" class="input-field" />
                <input v-model="item.right" placeholder="Right (e.g. Date)" class="input-field" />
            </div>
            <button @click="store.removeItem(sectionId, blockId, item.id)" class="btn-icon btn-delete"
                title="Remove Item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                </svg>
            </button>
        </div>
    </div>
</template>

<style scoped>
.three-section-editor {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
}

.item-row {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm);
    background: var(--color-bg);
}

.row-inputs {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: var(--spacing-sm);
}

.input-field {
    width: 100%;
    padding: 6px 8px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    font-size: 0.85rem;
    background: var(--color-surface);
}

.input-field:focus {
    border-color: var(--color-accent);
    outline: none;
}

.btn-delete {
    color: var(--color-text-tertiary);
    opacity: 0.5;
}

.btn-delete:hover {
    color: #ef4444;
    opacity: 1;
    background: #fef2f2;
}
</style>
