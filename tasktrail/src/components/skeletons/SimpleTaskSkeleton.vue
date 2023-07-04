<template lang="pug">

.card.item.task.prevent-drag
    header.card-header
        .card-header-icon
            i.fas.fa-solid.fa-grip-lines

        .task-content 
            .card-header-icon
                .tag.skeleton
            .card-header-icon
                .tag.skeleton

</template>

<script>
export default {
    name: 'SimpleTaskSkeleton',
}
</script>