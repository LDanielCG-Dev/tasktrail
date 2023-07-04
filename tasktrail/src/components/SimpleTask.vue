<template lang="pug">

.card.item.task(:style="{ borderLeft: `5px solid ${getColor(task)}` }")
    header.card-header
        button.card-header-icon.handle
            i.grab.fas.fa-solid.fa-grip-lines

        input.checkbox.mx-3(
            type="checkbox"
            v-model="task.done"
            @click="$emit('check', task)"
        )

        .task-content
            p.card-header-title(
                @click="$emit('edit', task)"
                :class="task.done ? 'strikethrough' : ''"
            ) {{ task.name }}

                .task-misc
                    .card-header-icon.date {{ new Date(task.date).toLocaleDateString("es-ES", { year: 'numeric', month: '2-digit', day: '2-digit' }) }}

                    .card-header-icon.tags
                        span.tag.is-success(v-if="task.done" @click="$emit('check', task)") {{ $t('tasks.status.done') }}
                        span.tag.is-danger(v-else @click="$emit('check', task)") {{ $t('tasks.status.toDo') }}

        .card-header-icon.actions
            span.icon
                i.fas.fa-edit.has-text-info(@click="$emit('edit', task)")
            span.icon
                i.fas.fa-trash.has-text-danger(@click="$emit('delete', task)")

    SimpleModal(mode="edit" :task="task" v-show="task.edit" @edit="$emit('edit', task)")
</template>

<script>
import SimpleModal from './modals/SimpleModal.vue'

export default {
    name: 'SimpleTask',
    components: {
        SimpleModal,
    },
    props: {
        task: {
            type: Object,
        }
    },
    methods: {
        getColor(task) {
            const COLORS = Object.freeze({
                'true': '#48c78e',
                'false': '#f14668',
            })

            return COLORS[task.done]
        }
    }
}
</script>