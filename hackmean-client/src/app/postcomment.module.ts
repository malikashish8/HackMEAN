export class PostComment {
  constructor(
    private _id: string, 
    private message: string, 
    private user: string, 
    private time: Date, 
    private postId: string) {}
}