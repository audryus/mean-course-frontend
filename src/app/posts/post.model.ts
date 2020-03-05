export interface Post {
  id?: string;
  title: string;
  content: string;
  image?: File
}
export interface PostMessage {
  message: string;
  posts: any;
}
