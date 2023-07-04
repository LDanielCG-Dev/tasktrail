<template lang="pug">

.item.kanban-task(:style="{ borderLeft: `5px solid ${column.color}` }")
    .kanban-card
        span.card
            .kanban-action
                label
                    strong {{ `#${task.id}` }}
                span.icon.is-clickable
                    i.fas.fa-xmark(@click="$emit('delete', task)")

            label.label(@dblclick="focus")
                textarea.textarea.kanban-text(
                    v-model="task.name"
                    :disabled="edit ? false : true"
                    @blur="saveTask()"
                    @keyup.enter="saveTask()"
                    ref="input"
                    :placeholder="$t('kanban.placeholder')"
                    rows="3"
                )

            .kanban-action
                .kanban-button
                    .dropdown(:class="{ 'is-active': isOpen }")
                        .dropdown-trigger
                            button.button(aria-haspopup='true' aria-controls='dropdown-menu' @click='toggleDropdown' :style="{ backgroundColor: column.color }")
                                span {{ (this.task.priority !== null) ? this.getPriorityName(task.priority) : "" }}
                                span.icon.is-small
                                    i.fas.fa-angle-down(aria-hidden='true')
                        #dropdown-menu.dropdown-menu(role='menu')
                            .dropdown-content(:style="{ backgroundColor: column.color }")
                                a(v-for='priority, index in priorities' :key='index' :class="{ 'dropdown-item': true, 'is-active': task.priority === index }" @click='selectOption(index)')
                                    | {{ priority.name }}
</template>
<script>
export default {
    name: "KanbanTask",
    props: {
        task: {
            type: Object,
            required: true,
        },
        column: {
            type: Object,
            required: true,
        },
        editable: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    data() {
        return {
            edit: this.editable,

            isOpen: false,
            priorities: [
                {
                    name: this.$t("kanban.taskPriority.low"),
                },
                {
                    name: this.$t("kanban.taskPriority.normal"),
                },
                {
                    name: this.$t("kanban.taskPriority.high"),
                },
            ],
            selectedOption: "",
        };
    },
    created() {
        this.selectedOption = (this.task.priority !== null) ? this.getPriorityName(this.task.priority) : ""; 

        document.addEventListener("click", this.handleOutsideClick);
        document.addEventListener("mousedown", this.handleOutsideClick);
    },
    methods: {
        focus() {
            // console.log("edit")
            this.edit = !this.edit
            this.$nextTick(() => {
                this.$refs.input.focus();
            });
        },
        toggleDropdown() {
            this.isOpen = !this.isOpen;
        },
        saveTask() {
            this.edit = !this.edit
            this.$emit('blurTask')
        },
        selectOption(option) {
            this.task.priority = option;
            this.isOpen = false;
            this.$emit('selectPriority');
        },
        getPriorityName(id = 0) {
            return this.priorities[id].name;
        },
        handleOutsideClick(event) {
            const target = event.target;
            const dropdownElement = this.$el.querySelector(".dropdown");

            if (!dropdownElement.contains(target)) {
                this.isOpen = false;
            }
        },
    },
};
</script>