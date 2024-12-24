import { useState } from "react";


interface AddTodoProps {
  onAdd: () => void;
}

const AddTodo: React.FC<AddTodoProps> = ({ onAdd }) => {
  const [title, setTitle] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) {
      alert("Title is required");
      return;
    }

    const response = await fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    if (response.ok) {
      const newTodo = await response.json();
      console.log("New todo added:", newTodo);
      setTitle("");
      onAdd();
    } else {
      console.error("Failed to add todo");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Todo</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter todo title"
      />
      <button type="submit">Add</button>
    </form>
  );
};

export default AddTodo;