
export interface Todo {
    _id: string;
    title: string;
    completed: boolean;
    statusId: string;
}

export interface NewTodo {
    title: string;
}