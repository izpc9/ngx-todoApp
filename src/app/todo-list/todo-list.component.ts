import { Component, ViewChild, ElementRef, Renderer2, HostListener, OnInit, Input } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { Store, select } from '@ngrx/store';

import * as fromTodos from "../store";
import { TodoListSide } from '../models/todoListSide.model';

export class Task {
  public completed;
  public editing;
  public timestamp;

  constructor(public name: string) {
    this.name = name;
    this.completed = false;
    this.editing = false;
    this.timestamp = new Date();
  }
}

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  @ViewChild("newTodo") newTodo: ElementRef;
  @ViewChild("todoListUl") todoListUl: ElementRef;

  public todoList: Task[];

  @Input()
  id: number;

  @Input()
  mySide: TodoListSide;

  @Input()
  otherSide: TodoListSide;

  public displayedTodoLists: Task[] = [];
  public remainingTasks = 0;
  public taskEditIndex = null;
  public view = "all";

  @HostListener('document:click', ['$event'])
  public onClick(event) {
    if (event.srcElement.attributes.class && !event.srcElement.classList.contains("edit")) {
      if ((this.taskEditIndex != null || this.taskEditIndex != undefined) && this.taskEditIndex < this.todoList.length) {
        this._store.dispatch(new fromTodos.EditTask({ newName: this.todoList[this.taskEditIndex].name, index: this.taskEditIndex, todoListSide: this.mySide })); // TODO ng model
        this.taskEditIndex = null;
      }
    }
  }

  constructor(private renderer2: Renderer2, private _store: Store<fromTodos.MainState>) { }

  ngOnInit(): void {
    if (this.mySide.side == "leftTodo") {
      const todoList$ = this._store.pipe(select(fromTodos.getLeftTodoList));
      todoList$.subscribe((todoList: Task[]) => {
        // this.todoList = res;
        this.todoList = JSON.parse(JSON.stringify(todoList)); // TODO ng model
        this.updateTodosView();
        localStorage.setItem(this.mySide.side, JSON.stringify(todoList));
      })
    } else {
      const todoList$ = this._store.pipe(select(fromTodos.getRightTodoList));
      todoList$.subscribe((todoList: Task[]) => {
        // this.todoList = res;
        this.todoList = JSON.parse(JSON.stringify(todoList)); // TODO ng model
        this.updateTodosView();
        localStorage.setItem(this.mySide.side, JSON.stringify(todoList));
      })
    }

  }

  moveTaskEvent(task: Task) {
    this._store.dispatch(new fromTodos.MoveTask(
      { 
        index: this.todoList.indexOf(task), 
        todoListSide: this.mySide, 
        sendToSide: this.otherSide.side }));
  }

  addTask() {
    if (this.newTodo.nativeElement.value == "") return;
    let newTask = new Task(this.newTodo.nativeElement.value);
    this.newTodo.nativeElement.value = "";

    this._store.dispatch(new fromTodos.AddTask({ task: newTask, todoListSide: this.mySide }));
  }

  edit(index) {
    this.taskEditIndex = index;

    this._store.dispatch(new fromTodos.ToggleTaskEditing({ index, todoListSide: this.mySide }));
    setTimeout(() => {
      this.renderer2.selectRootElement("#myInput" + index + "_" + this.id).focus();
    }, 0);
  }

  finishedEditing(e, index) {
    this._store.dispatch(new fromTodos.EditTask({ newName: e.srcElement.value, index, todoListSide: this.mySide })); // TODO ng model
  }

  toggleAllTasks() {
    this._store.dispatch(new fromTodos.ToggleCompleteAllTasks({ todoListSide: this.mySide }));
  }

  toggleCompletedTask(index) {
    this._store.dispatch(new fromTodos.ToggleCompleteTask({ index, todoListSide: this.mySide }));
  }

  allTasksCompleted() {
    if (!this.todoList.length) return;

    let completed = true;

    this.todoList.forEach(task => {
      if (!task.completed) {
        completed = false;
      }
    });

    this.remainingTasks = this.getRemainingTasks();

    return completed;
  }

  getRemainingTasks() {
    let uncompletedTasks = 0;

    this.todoList.forEach(task => {
      if (!task.completed) uncompletedTasks++;
    });

    return uncompletedTasks;
  }

  removeTask(index) {
    this._store.dispatch(new fromTodos.RemoveTask({ index, todoListSide: this.mySide }));
  }

  clearCompletedTasks() {
    this._store.dispatch(new fromTodos.RemoveAllCompletedTasks({ todoListSide: this.mySide }));
  }

  updateTodosView() {
    switch (this.view) {
      case "active":
        this.showActiveTodos();
        break;
      case "completed":
        this.showCompletedTodos();
        break;
      default:
        this.showAllTodos();
        break;
    }
  }

  showAllTodos() {
    this.displayedTodoLists = this.todoList;
  }

  showActiveTodos() {
    this.displayedTodoLists = this.todoList.filter(task => {
      return !task.completed;
    });
  }

  showCompletedTodos() {
    this.displayedTodoLists = this.todoList.filter(task => {
      return task.completed;
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.container.id === event.previousContainer.id) {
      this._store.dispatch(new fromTodos.DragTaskWithinList(
        { fromIndex: event.previousIndex, currentIndex: event.currentIndex, onSide: this.mySide }
      ));
    } else {
      this._store.dispatch(new fromTodos.DragTaskToAnotherList(
        { fromIndex: event.previousIndex, currentIndex: event.currentIndex, fromSide: this.otherSide, toSide: this.mySide }
      ));
    }
  }

}