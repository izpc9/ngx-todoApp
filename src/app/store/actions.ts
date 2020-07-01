import { Action } from '@ngrx/store';
import { Task } from "../todo-list/todo-list.component";
import { TodoListSide } from '../models/todoListSide.model';
import { MainState } from './reducer';

export enum TodoActionTypes {
    AddTask = "[Todo] Add Task",
    RemoveTask = "[Todo] Remove Task",
    RemoveAllCompletedTasks = "[Todo] Remove All Tasks",
    EditTask = "[Todo] Edit Task",
    CancelEdit = "[Todo] Cancelled Editing",
    ToggleTaskEditing = "[Todo] Toggle Task Editing",
    MoveTask = "[Todo] Move Task",
    DragTaskToAnotherList = "[Todo] Drag Task to another list",
    DragTaskWithinList = "[Todo] Drag task within list",
    ToggleCompleteTask = "[Todo] Toggle Task Completion",
    ToggleCompleteAllTasks = "[Todo] Toggle Tasks Completion",
    GetAllTasks = "[Todo] Get Tasks",
    ImportTodoLists = "[Todo] Import Todo Lists"
}

export class AddTask implements Action {
    public readonly type = TodoActionTypes.AddTask;

    constructor(public payload: { task: Task; todoListSide: TodoListSide }) { }
}

export class RemoveTask implements Action {
    public readonly type = TodoActionTypes.RemoveTask;

    constructor(public payload: { index: number, todoListSide: TodoListSide }) { }
}

export class RemoveAllCompletedTasks implements Action {
    public readonly type = TodoActionTypes.RemoveAllCompletedTasks;

    constructor(public payload: { todoListSide: TodoListSide }) { }
}

export class EditTask implements Action {
    public readonly type = TodoActionTypes.EditTask;

    constructor(public payload: { newName: string, index: number, todoListSide: TodoListSide }) { }
}

export class CancelEdit implements Action {
    public readonly type = TodoActionTypes.CancelEdit;

    constructor(public payload: { index: number, todoListSide: TodoListSide }) { }
}

export class ToggleTaskEditing implements Action {
    public readonly type = TodoActionTypes.ToggleTaskEditing;

    constructor(public payload: { index: number, todoListSide: TodoListSide }) { }
}

export class MoveTask implements Action {
    public readonly type = TodoActionTypes.MoveTask;

    constructor(public payload: { index: number, todoListSide: TodoListSide, sendToSide: string }) { }
}

export class DragTaskToAnotherList implements Action {
    public readonly type = TodoActionTypes.DragTaskToAnotherList;

    constructor(public payload: { fromIndex: number, currentIndex: number, fromSide: TodoListSide, toSide: TodoListSide }) { }
}

export class DragTaskWithinList implements Action {
    public readonly type = TodoActionTypes.DragTaskWithinList;

    constructor(public payload: { fromIndex: number, currentIndex: number, onSide: TodoListSide }) { }
}

export class ToggleCompleteTask implements Action {
    public readonly type = TodoActionTypes.ToggleCompleteTask;

    constructor(public payload: { index: number, todoListSide: TodoListSide }) { }
}

export class ToggleCompleteAllTasks implements Action {
    public readonly type = TodoActionTypes.ToggleCompleteAllTasks;

    constructor(public payload: { todoListSide: TodoListSide }) { }
}

export class GetAllTasks implements Action {
    public readonly type = TodoActionTypes.GetAllTasks;
}

export class ImportTodoLists implements Action {
    public readonly type = TodoActionTypes.ImportTodoLists;

    constructor(public payload: MainState) {}
}

export type TodoActions = AddTask | RemoveTask | RemoveAllCompletedTasks | EditTask | DragTaskToAnotherList | DragTaskWithinList |
    MoveTask | ToggleCompleteTask | ToggleCompleteAllTasks | GetAllTasks | ToggleTaskEditing | CancelEdit | ImportTodoLists;