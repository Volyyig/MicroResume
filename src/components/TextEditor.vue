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
    <div v-if="block" class="text-editor">
        <textarea v-model="block.content" placeholder="Type your content here..." class="input text-area"
            @focus="store.recordHistory(block.id)"></textarea>
    </div>
</template>

<style scoped>
.text-area {
    min-height: 140px;
    resize: vertical;
    line-height: 1.7;
}
</style>
