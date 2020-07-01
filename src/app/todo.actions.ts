import { createAction, props } from '@ngrx/store';
import { Task } from './todo-list/todo-list.component';

export const addTaskLeft = createAction(
    '[LeftTodoApp] Add task left',
    props<Task>()
);

export const addTaskRight = createAction(
    '[RightTodoApp] Add task right',
    props<Task>()
);
