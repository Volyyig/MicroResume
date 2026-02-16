<script setup lang="ts">
import { useResumeStore } from '../stores/resume'

const store = useResumeStore()
</script>

<template>
    <section class="editor-section">
        <h3 class="section-label">Contact Info</h3>
        <div class="field-group">
            <input v-model="store.resume.header.fullName" placeholder="Full Name" class="input" />
            <input v-model="store.resume.header.title" placeholder="Job Title" class="input" />
            <div class="input-row">
                <input v-model="store.resume.header.email" placeholder="Email" class="input" />
                <input v-model="store.resume.header.phone" placeholder="Phone" class="input" />
            </div>
            <input v-model="store.resume.header.location" placeholder="Location" class="input" />
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
    margin: 0 0 var(--spacing-md) 0;
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
