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
    <div v-if="block" class="list-editor">
        <div v-for="(_, index) in block.content" :key="index" class="list-item">
            <span class="item-prefix">
                {{ block.type === 'list-ordered' ? (index as number) + 1 + '.' : '•' }}
            </span>
            <textarea v-model="block.content[index]" class="item-input" rows="1" placeholder="List item..." @input="(e) => {
                const el = e.target as HTMLTextAreaElement;
                el.style.height = 'auto';
                el.style.height = el.scrollHeight + 'px';
            }"></textarea>
            <button @click="store.removeItem(sectionId, blockId, index)" class="btn-icon btn-delete"
                title="Remove Item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                </svg>
            </button>
        </div>
    </div>
</template>

<style scoped>
.list-editor {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.list-item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
}

.item-prefix {
    width: 20px;
    padding-top: 6px;
    font-size: 0.9rem;
    color: var(--color-text-tertiary);
    text-align: right;
}

.item-input {
    flex: 1;
    padding: 6px 0;
    border: none;
    border-bottom: 1px solid transparent;
    background: transparent;
    font-size: 0.9rem;
    line-height: 1.5;
    resize: none;
    overflow: hidden;
    min-height: 1.5em;
}

.item-input:focus {
    outline: none;
    border-bottom-color: var(--color-accent);
}

.btn-delete {
    margin-top: 4px;
    color: var(--color-text-tertiary);
    opacity: 0;
}

.list-item:hover .btn-delete {
    opacity: 1;
}

.btn-delete:hover {
    color: #ef4444;
    background: #fef2f2;
}
</style>
