import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { title } from "process";
import { useEffect, useState } from "react";
import { Button } from "@kuma-ui/core";
import AddTodo from "@/components/AddTodo";

const inter = Inter({ subsets: ["latin"] });


interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

// 一旦雑にindex.tsxで作る
export default function Home() {

  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await fetch('/api/todos');
    if(response.ok){
      const data = await response.json();
      setTodos(data);
    } else {
      console.error("Failed to fetch todos")
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodos(todos.map((todo) => {
      if(todo.id === event.target.id){
        return  {
          ...todo,
          completed: !todo.completed
        }
      } else {
        return todo;
      }
    }
    ));
  };

  // ①　DBからデータをとってくる
  // ②　表示する
  // できたらテスト書く

  return (
    <>
      <Head>
        <title>TODOAPP</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <AddTodo onAdd={fetchTodos}/>
      
      {todos.length === 0 ? (
        <p>タスクなし</p>
      ) : (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>タイトル</th>
              <th>完了</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.title}</td>
                <td><input id={row.id} type="checkbox" checked={row.completed} onChange={handleCheckboxChange}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      </div>
    </>
  );
}
