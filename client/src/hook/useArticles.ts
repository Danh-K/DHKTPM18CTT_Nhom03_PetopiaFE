import { ArticleService } from "@/service/article.service";
import { useQuery } from "@tanstack/react-query";

export const useArticles = () => {
  return useQuery({
    queryKey: ["articles"],
    queryFn: ArticleService.getAll,
  });
};

export const useArticle = (id: number) => {
  return useQuery({
    queryKey: ["articles", id],
    queryFn: () => ArticleService.getById(id),
    enabled: !!id,
  });
};