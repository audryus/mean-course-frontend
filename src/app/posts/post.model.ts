export interface Post {
  id?: string;
  title: string;
  content: string;
}
export interface PostMessage {
  message: string;
  posts: any;
}
