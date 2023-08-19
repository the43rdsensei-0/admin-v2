export interface initStateType {
    status:"idle"|"loading"|"succeeded"|"failed",
    error:boolean,
    message:string
}

export interface ISuccessResponseType {
    code:number;
    message:string;
}