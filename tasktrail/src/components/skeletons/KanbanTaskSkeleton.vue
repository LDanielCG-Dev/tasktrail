<template lang="pug">

.item.kanban-task.prevent-drag
    .kanban-card
        span.card
            .kanban-action
                .kanban-text
                    .skeleton
                span.icon
                    i.fas.fa-xmark

            .kanban-text
                .skeleton
                .skeleton

            .kanban-action
                .kanban-button
                    .dropdown

</template>
<script>
export default {
    name: "KanbanTaskSkeleton",
}
</script>