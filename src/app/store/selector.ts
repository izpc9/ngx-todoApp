import { createFeatureSelector, createSelector } from "@ngrx/store";
import { MainState } from "./reducer";

const getMainState = createFeatureSelector<MainState>("todoLists");

export const getAllTodoLists = createSelector(getMainState, (state: MainState) => {
    return state;
});

export const leftTodo = createSelector(getMainState, (state: MainState) => {
    return state.leftTodo;
});

export const rightTodo = createSelector(getMainState, (state: MainState) => {
    return state.rightTodo;
});