import { createReducer, on, Action } from '@ngrx/store';
import { addTaskLeft, addTaskRight } from './todo.actions';

import { Task } from "./todo-list/todo-list.component";

export interface MainState {
    leftTodoList: Task[];
    rightTodoList: Task[];
}

export const initialState: MainState = {
    leftTodoList: [new Task("INITIAL LEFT")],
    rightTodoList: [new Task("INITIAL RIGHT")]
};

const _taskReducer = createReducer(
    initialState,
    on(addTaskLeft, state => ({ ...state, leftTodoList: state.leftTodoList.concat(new Task("LEFT: something random"))})),
    on(addTaskRight, state => ({ ...state, rightTodoList: state.rightTodoList.concat(new Task("RIGHT: something random")) }))
);

export function reducer(state: MainState | undefined, action: Action) {
    return _taskReducer(state, action);
}