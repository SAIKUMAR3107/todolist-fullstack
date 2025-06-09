<template>
  <div class="card-component" v-for="(item, index) in props.data" :key="index">
    <input
      v-model="item.itemDescription"
      type="text"
      :style="{ marginBottom: '20px' }"
    />
    <br />
    <button
      :style="{ color: 'white', background: 'green' }"
      @click="onUpadte(item.ID, item.itemDescription)"
    >
      update
    </button>
    <button
      :style="{ color: 'white', background: 'red' }"
      @click="onDelete(item.ID)"
    >
      delete
    </button>
  </div>
</template>
<script lang="ts" setup>
import { useTodoStore } from "@/store/StoringData";
import { defineProps, PropType, ref } from "vue";

const props = defineProps({
  data: {
    type: Object as PropType<any>,
    required: true,
  },
});

const data = useTodoStore();

async function onUpadte(number: number, description: string) {
  await data.updateTodo(number, description);
  await data.getAllTodos(); // Refresh the list after update
}

async function onDelete(number: number) {
  await data.deleteTodo(number);
}
</script>
<style scoped>
.card-component {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px;
  border-radius: 5px;
  width: 300px;
}
</style>
