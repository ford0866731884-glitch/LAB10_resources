export type User = { id: number; username: string; password: string };
export type TodoItem = { id: number; name: string };

export const seedUsers: User[] = [
  { id: 1, username: "user1", password: "password1" },
  { id: 2, username: "user2", password: "password2" },
];

// In-memory ToDo items (shared for all users in this demo)
export let todoItems: TodoItem[] = [
  { id: 1, name: "Buy food" },
  { id: 2, name: "Read book" },
  { id: 3, name: "Do LAB12" },
];

export function addTodo(name: string) {
  const maxId = todoItems.reduce((m, it) => Math.max(m, it.id), 0);
  todoItems.push({ id: maxId + 1, name });
}

export function deleteTodo(id: number) {
  todoItems = todoItems.filter((it) => it.id !== id);
}
