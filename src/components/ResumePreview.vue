<script setup lang="ts">
import { useResumeStore } from '../stores/resume'
import { ref, onMounted, onUnmounted } from 'vue'

const store = useResumeStore()
const previewScale = ref(1)
const previewContainer = ref<HTMLElement | null>(null)

const updateScale = () => {
    if (previewContainer.value) {
        const containerWidth = previewContainer.value.clientWidth - 64
        const paperWidth = 210 * 3.78 // mm to px approx
        previewScale.value = Math.min(1, containerWidth / paperWidth)
    }
}

onMounted(() => {
    updateScale()
    window.addEventListener('resize', updateScale)
})

onUnmounted(() => {
    window.removeEventListener('resize', updateScale)
})
</script>

<template>
    <div class="preview-container" ref="previewContainer">
        <div class="resume-paper" id="resume-preview" :style="{
            transform: `scale(${previewScale})`,
            fontSize: `${store.resume.styles.fontSize}px`,
            lineHeight: store.resume.styles.lineHeight,
            padding: `${store.resume.styles.pageMargin}mm`
        }">
            <!-- Resume Header -->
            <div class="resume-header">
                <h1>{{ store.resume.header.fullName }}</h1>
                <p class="resume-title">{{ store.resume.header.title }}</p>
                <div class="resume-contact">
                    <span v-if="store.resume.header.email">{{ store.resume.header.email }}</span>
                    <span v-if="store.resume.header.phone" class="sep">{{ store.resume.header.phone }}</span>
                    <span v-if="store.resume.header.location" class="sep">{{ store.resume.header.location }}</span>
                </div>
            </div>

            <!-- Sections -->
            <div v-for="section in store.resume.sections" :key="section.id" class="resume-section"
                :style="{ marginBottom: `${store.resume.styles.sectionSpacing}px` }">
                <h2 class="section-title">{{ section.title }}</h2>
                <div class="section-divider"></div>

                <div v-for="block in section.blocks" :key="block.id" class="resume-block">
                    <!-- Three Section -->
                    <div v-if="block.type === 'three-section'" class="three-section-list">
                        <div v-for="item in block.content" :key="item.id" class="three-section-item">
                            <span class="ts-left"><strong>{{ item.left }}</strong></span>
                            <span class="ts-center"><em>{{ item.center }}</em></span>
                            <span class="ts-right">{{ item.right }}</span>
                        </div>
                    </div>

                    <!-- Lists -->
                    <ul v-else-if="block.type === 'list-unordered'" class="resume-bullets">
                        <li v-for="(point, idx) in block.content" :key="idx">{{ point }}</li>
                    </ul>
                    <ol v-else-if="block.type === 'list-ordered'" class="resume-bullets ordered">
                        <li v-for="(point, idx) in block.content" :key="idx">{{ point }}</li>
                    </ol>

                    <!-- Text -->
                    <div v-else-if="block.type === 'text'" class="resume-text">{{ block.content }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.preview-container {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-lg);
    display: flex;
    justify-content: center;
    background: var(--color-bg);
    border-radius: var(--radius-md);
}

.resume-paper {
    background: white;
    color: #333;
    width: 210mm;
    min-height: 297mm;
    padding: 20mm;
    box-shadow: var(--shadow-lg);
    box-sizing: border-box;
    transform-origin: top center;
    position: relative;
    border-radius: 2px;
}

/* Resume inner styles (not affected by theme) */
.resume-header {
    text-align: center;
    margin-bottom: 24px;
}

.resume-header h1 {
    margin: 0;
    font-size: 2.2rem;
    color: #1a1a1a;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 700;
}

.resume-title {
    font-size: 1.1rem;
    color: #555;
    margin: 4px 0;
}

.resume-contact {
    font-size: 0.85rem;
    color: #777;
}

.resume-contact .sep::before {
    content: '  |  ';
    color: #bbb;
}

.resume-section {
    margin-bottom: 20px;
}

.section-title {
    font-size: 1.1rem;
    color: #1a1a1a;
    text-transform: uppercase;
    margin: 0;
    letter-spacing: 1px;
    font-weight: 700;
}

.section-divider {
    height: 1.5px;
    background: #333;
    margin: 4px 0 12px 0;
}

.three-section-item {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 4px;
    font-size: 0.95rem;
}

.ts-left {
    flex: 1;
    text-align: left;
}

.ts-center {
    flex: 1;
    text-align: center;
}

.ts-right {
    flex: 1;
    text-align: right;
}

.resume-bullets {
    padding-left: 1.2rem;
    margin: 4px 0;
}

.resume-bullets li {
    font-size: 0.85rem;
    line-height: 1.5;
    margin-bottom: 2px;
    color: #444;
}

.resume-bullets.ordered {
    padding-left: 1.5rem;
}

.resume-text {
    font-size: 0.9rem;
    line-height: 1.6;
    color: #444;
    white-space: pre-wrap;
}

.resume-block {
    margin-bottom: 8px;
}

.resume-block:last-child {
    margin-bottom: 0;
}
</style>
