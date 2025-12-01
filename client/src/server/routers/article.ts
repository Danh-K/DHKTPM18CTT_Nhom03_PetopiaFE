export type Article = {
  articleId: string; // ví dụ: "AR001"
  title: string;
  content: string;
  authorId?: string | null;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt?: string;
  comments: ArticleComment[]; 
};
export type ArticleComment = {
  commentId: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  articleId: string;
  username: string | null;
};