import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromTodos from "./store";
import { TodoListSide } from './models/todoListSide.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private _store: Store<fromTodos.MainState>) { }

  public leftSide: TodoListSide = { side: "leftTodo" };
  public rightSide: TodoListSide = { side: "rightTodo" };

  ngOnInit(): void {
    if (localStorage.getItem("leftTodo") && localStorage.getItem("rightTodo")) {
      this._store.dispatch(new fromTodos.ImportTodoLists(
        {
          leftTodo: JSON.parse(localStorage.getItem("leftTodo")),
          rightTodo: JSON.parse(localStorage.getItem("rightTodo"))
        }));
    } else {
      this._store.dispatch(new fromTodos.GetAllTasks());
    }
    
  }
}
