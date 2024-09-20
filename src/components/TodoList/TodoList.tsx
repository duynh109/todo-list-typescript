import { useEffect, useState } from 'react'
import TaskInput from '../TaskInput'
import TaskList from '../TaskList'
import styles from './todoList.module.scss'
import { Todo } from '../../@types/todo.type'

export default function TodoList() {
  // const [todos, setTodos] = useState<Todo[]>([])
  const [todos, setTodos] = useState<Todo[]>(() => {
    const todosString = localStorage.getItem('todos')
    return todosString ? JSON.parse(todosString) : []
  })
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null)
  const doneTodos = todos.filter((todo) => todo.done)
  const notdoneTodos = todos.filter((todo) => !todo.done)

  // useEffect(() => {
  //   const todosString = localStorage.getItem('todos')
  //   const todosObj: Todo[] = JSON.parse(todosString || '[]')
  //   setTodos(todosObj)
  // }, [])

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  // useEffect(() => {
  //   if (todos.length > 0) {
  //     localStorage.setItem('todos', JSON.stringify(todos))
  //   }
  // }, [todos])

  const addTodo = (name: string) => {
    const todo: Todo = {
      done: false,
      name,
      id: new Date().toISOString()
    }
    setTodos((prev) => [...prev, todo])

    // const todosString = localStorage.getItem('todos')
    // const todosObj: Todo[] = JSON.parse(todosString || '[]')
    // const newTodosObj = [...todos, todo]
    // localStorage.setItem('todos', JSON.stringify(newTodosObj))
  }

  const handleDoneTodo = (id: string, done: boolean) => {
    setTodos((prev) => {
      return prev.map((todo) => {
        if (todo.id === id) {
          return { ...todo, done }
        }
        return todo
      })
    })
  }

  const startEditTodo = (id: string) => {
    const findedTodo = todos.find((todo) => todo.id === id)
    if (findedTodo) {
      setCurrentTodo(findedTodo)
    }
  }

  const editTodo = (name: string) => {
    setCurrentTodo((prev) => {
      if (prev) return { ...prev, name }
      return null
    })
  }

  const finishEditTodo = () => {
    setTodos((prev) => {
      return prev.map((todo) => {
        if (todo.id === currentTodo?.id) {
          return currentTodo
        }
        return todo
      })
    })
    setCurrentTodo(null)
  }

  const deleteTodo = (id: string) => {
    if (currentTodo) {
      setCurrentTodo(null)
    }
    setTodos((prev) => {
      const findedIndexTodo = prev.findIndex((todo) => todo.id === id)
      if (findedIndexTodo > -1) {
        const result = [...prev]
        result.splice(findedIndexTodo, 1)
        return result
      }
      return prev
    })
  }

  return (
    <div className={styles.todoList}>
      <div className={styles.todoListContainer}>
        <TaskInput addTodo={addTodo} currentTodo={currentTodo} editTodo={editTodo} finishEditTodo={finishEditTodo} />
        <TaskList
          todos={notdoneTodos}
          handleDoneTodo={handleDoneTodo}
          startEditTodo={startEditTodo}
          deleteTodo={deleteTodo}
        />
        <TaskList
          doneTaskList
          todos={doneTodos}
          handleDoneTodo={handleDoneTodo}
          startEditTodo={startEditTodo}
          deleteTodo={deleteTodo}
        />
      </div>
    </div>
  )
}
