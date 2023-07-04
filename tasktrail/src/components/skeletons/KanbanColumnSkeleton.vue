<template lang="pug">

.kanban-board
    .kanban-column(v-for="i in numberOfColumns" :key="i")
        KanbanColumnButtonsSkeleton

        .kanban-cards 
            KanbanTaskSkeleton(v-for="j in numberOfTasks" :key="j")

</template>
<script>
import KanbanTaskSkeleton from './KanbanTaskSkeleton.vue'
import KanbanColumnButtonsSkeleton from './KanbanColumnButtonsSkeleton.vue'

export default {
    name: "KanbanColumnSkeleton",
    components: {
        KanbanColumnButtonsSkeleton,
        KanbanTaskSkeleton,
    },
    data() {
        return {
            numberOfColumns: 3,
            numberOfTasks: 3,
        }
    }
}
</script>