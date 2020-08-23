import React from "react";
import { Post } from "../blocks";

export function Blog(props) {
  function restorePost(id) {
    const postBackup = props.blog.restoreBackup(id);
    setPosts(
      posts.map((post) => {
        if (post.id !== postBackup.id) return post;
        return postBackup;
      })
    );
  }

  async function deletePost(id) {
    const { status } = await props.blog.deletePost(id);
    if (status === 200) {
      setPosts(posts.filter((post) => post.id !== id));
    }
  }

  async function updatePost(post) {
    const editedPost = await props.blog.editPost(post);

    setPosts(
      posts.map((post) => {
        if (post.id !== editedPost.id) return post;
        return editedPost;
      })
    );
  }

  function handleEditPost(editedPost) {
    props.blog.makeBackup(posts.find((post) => post.id === editedPost.id));

    setPosts(
      posts.map((post) => {
        if (post.id !== editedPost.id) return post;
        return editedPost;
      })
    );
  }

  const [posts, setPosts] = React.useState([]);

  async function loadPosts() {
    setPosts(await props.blog.getPosts());
  }

  React.useEffect(function () {
    loadPosts();
  }, []);

  return (
    <div className="container max-w-screen-md mx-auto pt-32">
      {posts.map((post) => (
        <Post
          key={post.id}
          id={post.id}
          title={post.title}
          body={post.body}
          handleEditPost={(post) => handleEditPost(post)}
          updatePost={() => updatePost(post)}
          cancelEdit={() => restorePost(post.id)}
          delete={() => deletePost(post.id)}
        />
      ))}
    </div>
  );
}
