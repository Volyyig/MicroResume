<script setup lang="ts">
import { useResumeStore } from '../stores/resume'
import { computed } from 'vue'

const store = useResumeStore()

const props = defineProps<{
    sectionId: string
    blockId: string
}>()

const block = computed(() => {
    const section = store.resume.sections.find(s => s.id === props.sectionId)
    return section?.blocks.find(b => b.id === props.blockId)
})
</script>

<template>
    <div v-if="block" class="pro-list">
        <div v-for="item in block.content" :key="item.id" class="pro-item">
            <div class="item-top-row">
                <input v-model="item.company" placeholder="Company / Organization / School" class="input" />
                <button @click="store.removeItem(sectionId, blockId, item.id)" class="btn-remove" title="Remove">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>
            <div class="input-row">
                <input v-model="item.role" placeholder="Role / Degree" class="input" />
                <input v-model="item.period" placeholder="Period (e.g. 2021 – 2023)" class="input" />
            </div>
            <textarea v-model="item.description" placeholder="Description / Achievements" class="input"></textarea>
        </div>
    </div>
</template>

<style scoped>
.pro-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
}

.pro-item {
    background: var(--color-surface-hover);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
}

.item-top-row {
    display: flex;
    gap: var(--spacing-sm);
    align-items: center;
}

.item-top-row .input {
    flex: 1;
}

.input-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-sm);
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
}

.btn-remove:hover {
    background: var(--color-danger-bg);
    color: var(--color-danger);
}

textarea.input {
    min-height: 70px;
}
</style>
