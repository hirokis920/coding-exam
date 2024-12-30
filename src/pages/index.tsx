import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { title } from "process";
import { useEffect, useRef, useState } from "react";
import { Button } from "@kuma-ui/core";
import { CircularProgress, Box, Typography, Snackbar, Alert } from '@mui/material';

const inter = Inter({ subsets: ["latin"] });


interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

// 一旦雑にindex.tsxで作る
// 登録されているタスクを⼀覧形式で表⽰することができる。 OK
// タスクを新規作成することができる。 OK
// 1. タスク⼀覧の上部に『新規作成』ボタンを新設する。 OK
// 2. 『新規作成』ボタンを押下すると、タスク作成⽤のモーダル（以下、作成モーダル）が表⽰される。 OK
// 3. 作成モーダルの項⽬ OK
//  a. 『タイトル』：テキストボックス OK
//    i. 初期値は空とする。
//  b. 『キャンセル』：ボタン OK
//    i. ボタンを押下すると作成モーダルが閉じられる OK
//  c. 『作成』：ボタン  OK
//    i. 『タイトル』が空の場合、ボタンは⾮活性とする。 OK
//    ii. ボタンを押下すると、API にタスク作成リクエストが投げられる。 OK
//    iii. API から何らかのレスポンスが返ってくるまでは、画⾯上にローディングを表⽰させること。 OK
// 4. タスクの作成に成功した場合 
//   a. タスクを作成した旨の成功トーストを表⽰すること。  OK
//   b. 作成モーダルが閉じられ、⼀覧に登録したタスクが表⽰されていること。  OK
//    i. タスクの⼀覧は、API から再取得した値を表⽰するようにしてください。 OK
// 5. タスクの作成に失敗した場合
//   a. 作成モーダルは閉じられないこと。　OK
//   b. 作成モーダルの最下部にエラーメッセージを表⽰させること。　OK
//登録済みのタスクを更新することができる。
// 1. ⼀覧表⽰している各タスクの末尾に『編集』ボタンを追加。  OK
// 2. 『編集』ボタンをクリックすると、更新⽤のモーダル（以下、更新モーダル）が表⽰される。 OK
// 3. 更新モーダルには以下の項⽬を表⽰させてください。 OK
// a. 『タイトル』：テキストボックス ok
// i. 初期値は該当タスクの『タイトル』と同じ値とする。 OK
// b. 『キャンセル』：ボタン OK
// i. ボタンを押下すると更新モーダルが閉じられる OK
// c. 『更新』：ボタン OK
// i. ボタンを押下すると、API にタスク更新リクエストが投げられる。 OK
// 4. タスクの更新に成功した場合は、更新モーダルが閉じ、⼀覧に表⽰されているタスクが更新後の値となっている。 OK
// 課題: TODO アプリケーション 5
// 5. タスクの更新に失敗した場合は、更新モーダルの最下部にエラーメッセージを表⽰させる。 OK
// 4. タスクを完了 ↔ 未完了にすることができる。
// 以下のような操作でタスクを完了 ↔ 未完了が切り替えできるできるようにして
// ください。
// 1. ⼀覧表⽰しているタスクの『完了』チェックボックス OK
// a. チェックを⼊れると
// i. 完了タスクとして API リクエストを送信。 OK
// b. チェック済み状態でチェックを外すと     OK
// i. 未完了タスクとして API リクエストを送信。 OK
// 2. API リクエストに失敗した場合 OK
// a. トーストで失敗した旨を表⽰すること。 OK
// b. 完了状態は元に戻してください。（例：未完了 → 完了へ失敗した場合は、未完了のまま） OK
// 5. タスクを削除することができる。　OK
// 1. ⼀覧表⽰している各タスクの末尾に『削除』ボタンを追加。　OK
// 2. 『削除』ボタンをクリックすると、該当のタスクが削除され、削除した旨をトーストで表⽰すること。また、⼀覧からも消えること。　OK
// 3. 削除に失敗した場合は、トーストで削除に失敗した旨を表⽰すること。　OK



export default function Home() {

  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const newDialogRef = useRef<HTMLDialogElement>(null);
  const editDialogRef = useRef<HTMLDialogElement>(null);
  const [title, setTitle] = useState('');
  const [open, setOpen] = useState(false); 
  const [message, setMessage] = useState(''); 
  const [editId, setEditId] = useState('');
  const [editTitle, setEditTitle] = useState('');

  const handleTaskSuccess = () => {
    setMessage('登録しました'); 
    setOpen(true); 
  };

  const handleTaskError = () => {
    setMessage('失敗しました'); 
    setOpen(true); 
  };

  const handleTaskDelete = () => {
    setMessage('削除しました'); 
    setOpen(true); 
  };


  const handleClose = () => {
    setOpen(false);
  };


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

  const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>) => {

    event.preventDefault();

    setLoading(true);

    const response = await fetch("/api/todos/" + event.target.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: event.target.checked }),
    });

    if (response.ok) {
      const newTodo = await response.json();
      setLoading(false);
      handleTaskSuccess();
      fetchTodos();
    } else {
      setLoading(false);
      handleTaskError();
    }
  };

  const handleDelete = async (id:string) => {

    setLoading(true);

    const response = await fetch("/api/todos/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      setLoading(false);
      handleTaskDelete();
      fetchTodos();
    } else {
      setLoading(false);
      handleTaskError();
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert("Title is required");
      return;
    }

    setLoading(true);

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
      setLoading(false);
      newDialogRef.current?.close();
      handleTaskSuccess();
      fetchTodos();
    } else {
      console.error("Failed to add todo");
      setLoading(false);
      handleTaskError();
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle) {
      alert("Title is required");
      return;
    }

    setLoading(true);

    const response = await fetch("/api/todos/" + editId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: editTitle }),
    });

    if (response.ok) {
      const newTodo = await response.json();
      console.log("New todo added:", newTodo);
      setEditTitle("");
      setLoading(false);
      editDialogRef.current?.close();
      handleTaskSuccess();
      fetchTodos();
    } else {
      console.error("Failed to add todo",response);
      setLoading(false);
      handleTaskError();
    }
  }
  

  const openModal = () => {
    newDialogRef.current?.showModal();
  }
  const closeModal = () => {
    newDialogRef.current?.close();
  }

  const openEditModal = (id:string,title:string) => {
    setEditId(id);
    setEditTitle(title);
    editDialogRef.current?.showModal();
  }
  const closeEditModal = () => {
    editDialogRef.current?.close();
  }


  return (
    <>
      <Head>
        <title>TODOAPP</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Snackbar
        open={open}
        onClose={handleClose} // 閉じる処理
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // 画面下中央に表示
      >
        <Alert onClose={handleClose} severity="success">
          {message}
        </Alert>
      </Snackbar>
      <div>
       <Button onClick={openModal}>新規作成</Button>
      {todos.length === 0 ? (
        <p>タスクなし</p>
      ) : (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>タイトル</th>
              <th>完了</th>
              <th>編集</th>
              <th>削除</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.title}</td>
                <td><input id={row.id} type="checkbox" checked={row.completed} onChange={handleCheckboxChange}/></td>
                <td className="centered"><Button onClick={() =>openEditModal(row.id,row.title)}>編集</Button></td>
                <td className="centered"><Button onClick={() => handleDelete(row.id)}>削除</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      </div>
      <div>
        <dialog ref={newDialogRef}>
          <form onSubmit={handleSubmit}>
            <label>タイトル</label>
            <input type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)} />
            <button disabled={title.length === 0}>作成</button>
            <button type="button" onClick={closeModal}>キャンセル</button>
          </form>
        </dialog>
      </div>
      <div>
        <dialog ref={editDialogRef}>
          <form onSubmit={handleEdit}>
            <label>タイトル</label>
            <input type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)} />
            <button disabled={editTitle.length === 0}>保存</button>
            <button type="button" onClick={closeEditModal}>キャンセル</button>
          </form>
        </dialog>
      </div>
      {loading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3 }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading...
          </Typography>
        </Box>
      )}
    </>
  );
}
