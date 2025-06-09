import { defineStore } from "pinia";
import axios from "axios";

export const useTodoStore = defineStore("todos", {
  state: () => ({
    todos: [],
  }),
  actions: {
    async getAllTodos() {
      try {
        const response = await axios.get("http://localhost:3000");
        this.todos = response.data;
      } catch (err) {
        statusCodeValidation(err);
      }
    },

    async addTodo(task: any) {
      try {
        const response = await axios.post(
          "http://localhost:3000/add-item",
          {
            data: task,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          this.getAllTodos();
          return alert(response.data); // Reload the page to fetch updated data
        } else {
          alert("Failed to add task. Please try again.");
        }
      } catch (error) {
        statusCodeValidation(error);
        console.error("Error while sending the data to the server : ", error);
      }
    },

    async updateTodo(number: number, description: string) {
      try {
        const updateResponse = await axios.put(
          "http://localhost:3000/update-item",
          {
            data: {
              id: number,
              description: description,
            },
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (updateResponse.status === 200) {
          return alert(updateResponse.data); // Show success message
          // Optionally, you can trigger a refresh of the data here
        } else {
          alert("Failed to update task. Please try again.");
        }
      } catch (error) {
        statusCodeValidation(error);
        console.error("Error while updating the data to the server : ", error);
      }
    },

    async deleteTodo(number: number) {
      const deletedResponse = await axios.delete(
        "http://localhost:3000/delete-item",
        {
          data: { id: number },
          headers: { "Content-Type": "application/json" },
        }
      );
      if (deletedResponse.status === 200) {
        this.getAllTodos();
        return alert(deletedResponse.data);
      } else {
        alert("Failed to delete the task, Please try again after sometime");
      }
    },
  },
});

function statusCodeValidation(err: any) {
  if ((err as any).status === 404) {
    console.log("Error: Resource not found. Please check the server URL.");
    alert("Resource not found. Please check the server URL.");
  } else if ((err as any).response && (err as any).response.status === 500) {
    console.log("Error: Internal server error. Please try again later.");
    alert("Internal server error. Please try again later.");
  } else {
    console.log("An unexpected error occurred:", (err as any).message);
    alert("An unexpected error occurred. Please try again.");
  }
}
