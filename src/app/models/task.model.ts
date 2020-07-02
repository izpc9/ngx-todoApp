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