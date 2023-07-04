<template lang="pug">

div
    .columns
        .column
            .kanban-text
                .skeleton
        .column.is-flex.is-justify-content-flex-end.is-align-items-center
            span.icon
                i.fas.fa-add
            span.icon
                i.fas.fa-edit
            span.icon
                i.fas.fa-trash
    .columns 
        .column 
            small.kanban__quantity

</template>
<script>
export default {
    name: 'KanbanColumnButtonsSkeleton',
}
</script>