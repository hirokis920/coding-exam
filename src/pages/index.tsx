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
  id: number;
  title: string;
  completed: boolean;
}

// 一旦雑にindex.tsxで作る
export default function Home() {

  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await fetch('/api/todos');
      if(response.ok){
        const data = await response.json();
        setTodos(data);
      } else {
        console.error("Failed to fetch todos")
      }
    };

    fetchTodos();
    console.log(todos)
  }, []);

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
        <AddTodo/>
      
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
                <td>{row.completed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      </div>
    </>
  );
}
