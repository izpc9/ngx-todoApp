import { Component, ViewChild, ElementRef, Renderer2, HostListener, OnInit, Input, } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { Store, select } from '@ngrx/store';
import * as fromTodos from "../store";

import { TodoListSide } from '../models/todoListSide.model';
import { Task } from '../models/task.model';

import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  @ViewChild("newTodo") newTodo: ElementRef;

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
  public taskEditName = null;
  public view = "all";

  @HostListener('document:click', ['$event'])
  public onClick(event) {
    if (event.srcElement.attributes.class && !event.srcElement.classList.contains("edit")) {
      if ((this.taskEditIndex != null || this.taskEditIndex != undefined) &&
        this.taskEditIndex < this.todoList.length &&
        (this.taskEditName != null || this.taskEditName != undefined)) {

        // console.log(this.taskEditIndex, this.taskEditName);
        this._store.dispatch(new fromTodos.EditTask(
          {
            newName: this.taskEditName,
            index: this.taskEditIndex,
            todoListSide: this.mySide
          }));

        this.taskEditIndex = null;
        this.taskEditName = null;
      }
    }
  }

  @HostListener("window:beforeunload", ["$event"])
  unloadHandler(event: Event) {
    if (this.taskEditIndex != null) {
      this._store.dispatch(new fromTodos.ToggleTaskEditing({ index: this.taskEditIndex, todoListSide: this.mySide }));
    }
  }

  tasksForm: FormGroup;

  constructor(private renderer2: Renderer2,
    private _store: Store<fromTodos.MainState>,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.tasksForm = this.formBuilder.group({
      tasks: this.formBuilder.array([])
    });

    this.tasksForm.valueChanges.subscribe((form) => {
      // console.log("value changes");
      if (this.taskEditIndex != null || this.taskEditIndex != undefined) {
        if (form.tasks.length > this.taskEditIndex) {
          this.taskEditName = form.tasks[this.taskEditIndex].name;
        }
      }
    });

    const todoList$ = this._store.pipe(select(fromTodos[this.mySide.side]));
    todoList$.subscribe((todoList: Task[]) => {
      this.todoList = todoList;

      this.updateTodosView();
      localStorage.setItem(this.mySide.side, JSON.stringify(todoList));
    })
  }

  emptyFormArray() {
    let arr = <FormArray>this.tasksForm.controls.tasks;
    arr.controls = [];
  }

  addTaskToForm(task: Task) {
    (this.tasksForm.get("tasks") as FormArray).push(this.formBuilder.group({
      name: task.name,
      completed: task.completed,
      editing: task.editing,
      timestamp: task.timestamp
    }));
  }

  moveTaskEvent(task: Task) {
    this._store.dispatch(new fromTodos.MoveTask(
      {
        index: this.myIndexOf(task),
        todoListSide: this.mySide,
        sendToSide: this.otherSide.side
      }));
  }

  myIndexOf(task: Task) {
    for (var i = 0; i < this.todoList.length; i++) {
      if (this.todoList[i].name == task.name && this.todoList[i].timestamp == task.timestamp &&
        this.todoList[i].editing == task.editing && this.todoList[i].completed == task.completed
      ) {
        return i;
      }
    }
    return -1;
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
    this._store.dispatch(new fromTodos.EditTask({ newName: e.srcElement.value, index, todoListSide: this.mySide }));
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

    this.emptyFormArray();
    for (let i = 0; i < this.displayedTodoLists.length; i++) {
      this.addTaskToForm(this.displayedTodoLists[i]);
    }
  }

  showActiveTodos() {
    this.displayedTodoLists = this.todoList.filter(task => {
      return !task.completed;
    });

    this.emptyFormArray();
    for (let i = 0; i < this.displayedTodoLists.length; i++) {
      this.addTaskToForm(this.displayedTodoLists[i]);
    }
  }

  showCompletedTodos() {
    this.displayedTodoLists = this.todoList.filter(task => {
      return task.completed;
    });

    this.emptyFormArray();
    for (let i = 0; i < this.displayedTodoLists.length; i++) {
      this.addTaskToForm(this.displayedTodoLists[i]);
    }
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