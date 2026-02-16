<script setup lang="ts">
import { useResumeStore } from '../stores/resume'

const store = useResumeStore()

const props = defineProps<{
    sectionId: string
}>()

const getSection = () => store.resume.sections.find(s => s.id === props.sectionId)!
</script>

<template>
    <div class="text-editor">
        <textarea v-model="getSection().content" placeholder="Type your content here..."
            class="input text-area"></textarea>
    </div>
</template>

<style scoped>
.text-area {
    min-height: 140px;
    resize: vertical;
    line-height: 1.7;
}
</style>
