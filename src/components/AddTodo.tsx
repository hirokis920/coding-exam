import { useState } from "react";

const AddTodo = () => {
  const [title, setTitle] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) {
      alert("Title is required");
      return;
    }

    // API に新しい TODO を送信
    const response = await fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }), // 新しい TODO の title を送信
    });

    if (response.ok) {
      const newTodo = await response.json();
      console.log("New todo added:", newTodo);
      setTitle(""); // フォームをクリア
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