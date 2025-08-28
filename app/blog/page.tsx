import { getAllPosts } from "@/lib/notion";
import BlogClient from "./BlogClient";

export default async function BlogPage() {
  const posts = await getAllPosts();
  return <BlogClient posts={posts} />;
}
