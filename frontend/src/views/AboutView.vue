<template>
  <div class="about">
    <textarea
      v-model="message"
      placeholder="enter your task to add"
      rows="8"
      cols="70"
    />
    <br />
    <button :style="{ height: '40px', width: '100px' }" @click="onAdd">
      Add
    </button>
    <EachCardComponent :data="data.todos" />
  </div>
</template>
<script lang="ts" setup>
import EachCardComponent from "@/components/EachCardComponent.vue";
import { onMounted, PropType, ref, defineProps, watch } from "vue";
import { useTodoStore } from "@/store/StoringData";

const message = ref<string>("");
const data = useTodoStore();

async function onAdd() {
  if (message.value.trim() === "") {
    alert("Please Enter a task");
    return;
  }
  await data.addTodo(message.value);
  message.value = "";
}

onMounted(async () => {
  await data.getAllTodos();
});
</script>
