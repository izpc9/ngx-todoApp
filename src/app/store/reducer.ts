import { Task } from "../models/task.model";
import { TodoActions, TodoActionTypes } from "./actions";

export interface MainState {
    leftTodo: Task[];
    rightTodo: Task[];
}

const initialState: MainState = {
    leftTodo: [],
    rightTodo: []
};

export function reducer(state = initialState, action: TodoActions): MainState {
    switch (action.type) {
        case TodoActionTypes.AddTask: {
            const todoSide = action.payload.todoListSide.side;
            let updatedState = JSON.parse(JSON.stringify(state));
            updatedState[todoSide].push(action.payload.task);

            return {
                leftTodo: updatedState.leftTodo,
                rightTodo: updatedState.rightTodo
            }
        }

        case TodoActionTypes.RemoveTask: {
            const todoSide = action.payload.todoListSide.side;
            let updatedState = JSON.parse(JSON.stringify(state));
            updatedState[todoSide].splice(action.payload.index, 1);

            return {
                leftTodo: updatedState.leftTodo,
                rightTodo: updatedState.rightTodo
            }
        }

        case TodoActionTypes.RemoveAllCompletedTasks: {
            const todoSide = action.payload.todoListSide.side;
            let updatedState = JSON.parse(JSON.stringify(state));

            let filteredTodoList = updatedState[todoSide].filter(task => {
                return !task.completed
            });

            updatedState[todoSide] = filteredTodoList;

            return {
                leftTodo: updatedState.leftTodo,
                rightTodo: updatedState.rightTodo
            }
        }

        case TodoActionTypes.EditTask: {
            const todoSide = action.payload.todoListSide.side;
            let updatedState = JSON.parse(JSON.stringify(state));

            updatedState[todoSide][action.payload.index].name = action.payload.newName;
            updatedState[todoSide][action.payload.index].editing = false;

            return {
                leftTodo: updatedState.leftTodo,
                rightTodo: updatedState.rightTodo
            }
        }

        case TodoActionTypes.CancelEdit: {
            const todoSide = action.payload.todoListSide.side;
            let updatedState = JSON.parse(JSON.stringify(state));

            updatedState[todoSide][action.payload.index].editing = false;

            return {
                leftTodo: updatedState.leftTodo,
                rightTodo: updatedState.rightTodo
            }
        }

        case TodoActionTypes.ToggleTaskEditing: {
            const todoSide = action.payload.todoListSide.side;
            let updatedState = JSON.parse(JSON.stringify(state));

            updatedState[todoSide][action.payload.index].editing = !updatedState[todoSide][action.payload.index].editing;

            return {
                leftTodo: updatedState.leftTodo,
                rightTodo: updatedState.rightTodo
            }
        }

        case TodoActionTypes.MoveTask: {
            const todoSide = action.payload.todoListSide.side;
            const moveToSide = action.payload.sendToSide;
            let updatedState = JSON.parse(JSON.stringify(state));

            let taskToMove = JSON.parse(JSON.stringify(updatedState[todoSide][action.payload.index]));

            updatedState[moveToSide].push(taskToMove);
            updatedState[todoSide].splice(action.payload.index, 1);

            return {
                leftTodo: updatedState.leftTodo,
                rightTodo: updatedState.rightTodo
            }
        }

        case TodoActionTypes.DragTaskToAnotherList: {
            const fromSide = action.payload.fromSide.side;
            const toSide = action.payload.toSide.side;
            let updatedState = JSON.parse(JSON.stringify(state));

            let taskToMove = JSON.parse(JSON.stringify(updatedState[fromSide][action.payload.fromIndex]));
            updatedState[toSide].splice(action.payload.currentIndex, 0, taskToMove);

            updatedState[fromSide].splice(action.payload.fromIndex, 1);

            return {
                leftTodo: updatedState.leftTodo,
                rightTodo: updatedState.rightTodo
            }
        }


        case TodoActionTypes.DragTaskWithinList: {
            const onSide = action.payload.onSide.side;
            let updatedState = JSON.parse(JSON.stringify(state));

            let tmp = { ...updatedState[onSide][action.payload.fromIndex] };
            updatedState[onSide].splice(action.payload.fromIndex, 1);
            updatedState[onSide].splice(action.payload.currentIndex, 0, tmp);

            return {
                leftTodo: updatedState.leftTodo,
                rightTodo: updatedState.rightTodo
            }
        }

        case TodoActionTypes.ToggleCompleteTask: {
            const todoSide = action.payload.todoListSide.side;
            let updatedState = JSON.parse(JSON.stringify(state));

            updatedState[todoSide][action.payload.index].completed = !updatedState[todoSide][action.payload.index].completed;

            return {
                leftTodo: updatedState.leftTodo,
                rightTodo: updatedState.rightTodo
            }
        }

        case TodoActionTypes.ToggleCompleteAllTasks: {
            const todoSide = action.payload.todoListSide.side;
            let updatedState = JSON.parse(JSON.stringify(state));

            if (allTasksCompleted(updatedState[todoSide])) {
                setListToUncompleted(updatedState[todoSide]);
            } else {
                setListToCompleted(updatedState[todoSide]);
            }

            return {
                leftTodo: updatedState.leftTodo,
                rightTodo: updatedState.rightTodo
            }
        }

        case TodoActionTypes.GetAllTasks: {
            return {
                ...state
            }
        }

        case TodoActionTypes.ImportTodoLists: {
            const importedTodoLists = action.payload;

            return importedTodoLists;
        }
    }
}

function setListToUncompleted(todoList: Task[]) {
    todoList.forEach((task: Task) => {
        task.completed = false;
    });
}


function setListToCompleted(todoList: Task[]) {
    todoList.forEach((task: Task) => {
        task.completed = true;
    });
}

function allTasksCompleted(todoList: Task[]) {
    let completed = true;

    for (let i = 0; i < todoList.length; i++) {
        if (!todoList[i].completed) {
            completed = false;
            break;
        }
    }

    return completed;
}