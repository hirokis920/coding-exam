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
// 登録されているタスクを⼀覧形式で表⽰することができる。 OK
// タスクを新規作成することができる。 OK
// 1. タスク⼀覧の上部に『新規作成』ボタンを新設する。
// 2. 『新規作成』ボタンを押下すると、タスク作成⽤のモーダル（以下、作成モーダル）が表⽰される。
// 3. 作成モーダルの項⽬
//  a. 『タイトル』：テキストボックス
//    i. 初期値は空とする。
//  b. 『キャンセル』：ボタン
//    i. ボタンを押下すると作成モーダルが閉じられる
//  c. 『作成』：ボタン
//    i. 『タイトル』が空の場合、ボタンは⾮活性とする。
//    ii. ボタンを押下すると、API にタスク作成リクエストが投げられる。
//    iii. API から何らかのレスポンスが返ってくるまでは、画⾯上にローディングを表⽰させること。
// 4. タスクの作成に成功した場合
//   a. タスクを作成した旨の成功トーストを表⽰すること。
//   b. 作成モーダルが閉じられ、⼀覧に登録したタスクが表⽰されていること。
//    i. タスクの⼀覧は、API から再取得した値を表⽰するようにしてください。
// 5. タスクの作成に失敗した場合
//   a. 作成モーダルは閉じられないこと。
//   b. 作成モーダルの最下部にエラーメッセージを表⽰させること。
//登録済みのタスクを更新することができる。
// 1. ⼀覧表⽰している各タスクの末尾に『編集』ボタンを追加。
// 2. 『編集』ボタンをクリックすると、更新⽤のモーダル（以下、更新モーダル）が表⽰される。
// 3. 更新モーダルには以下の項⽬を表⽰させてください。
// a. 『タイトル』：テキストボックス
// i. 初期値は該当タスクの『タイトル』と同じ値とする。
// b. 『キャンセル』：ボタン
// i. ボタンを押下すると更新モーダルが閉じられる
// c. 『更新』：ボタン
// i. ボタンを押下すると、API にタスク更新リクエストが投げられる。
// 4. タスクの更新に成功した場合は、更新モーダルが閉じ、⼀覧に表⽰されてい
// るタスクが更新後の値となっている。
// 課題: TODO アプリケーション 5
// 5. タスクの更新に失敗した場合は、更新モーダルの最下部にエラーメッセージ
// を表⽰させる。
// 4. タスクを完了 ↔ 未完了にすることができる。
// 以下のような操作でタスクを完了 ↔ 未完了が切り替えできるできるようにして
// ください。
// 1. ⼀覧表⽰しているタスクの『完了』チェックボックス
// a. チェックを⼊れると
// i. 完了タスクとして API リクエストを送信。
// b. チェック済み状態でチェックを外すと
// i. 未完了タスクとして API リクエストを送信。
// 2. API リクエストに失敗した場合
// a. トーストで失敗した旨を表⽰すること。
// b. 完了状態は元に戻してください。（例：未完了 → 完了へ失敗した場合
// は、未完了のまま）
// 5. タスクを削除することができる。
// 1. ⼀覧表⽰している各タスクの末尾に『削除』ボタンを追加。
// 2. 『削除』ボタンをクリックすると、該当のタスクが削除され、削除した旨を
// トーストで表⽰すること。また、⼀覧からも消えること。
// 3. 削除に失敗した場合は、トーストで削除に失敗した旨を表⽰すること。



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
      if(todo.id == event.target.id){
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

  console.log("rendering");
  console.log(todos);
  

  return (
    <>
      <Head>
        <title>TODOAPP</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
       <AddTodo onAdd={fetchTodos}/>
       <Button>新規作成</Button>
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
