import { forwardRef, useState } from "react";


interface ModalProps {
  onCancel: () => void;
  dialogRef: React.Ref<HTMLDialogElement>;
}

const Modal: React.FC<ModalProps> = ({ onCancel, dialogRef }) => {
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
    } else {
      console.error("Failed to add todo");
    }
  };

  return (
    <div>
    <dialog ref={dialogRef}>
      <form onSubmit={handleSubmit}>
        <label>タイトル</label>
        <input type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)} />
        <button disabled={title.length === 0}>作成</button>
        <button type="button" onClick={onCancel}>キャンセル</button>
      </form>
    </dialog>
  </div>
  );
};

export default Modal;