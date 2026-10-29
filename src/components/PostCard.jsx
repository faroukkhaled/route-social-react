import {useState} from 'react';
import {Link, useOutletContext} from 'react-router-dom';
import {id, data} from '../api.js';
import {useSession} from '../session.jsx';
import {Avatar, Icon, Photo, displayDate} from './UI.jsx';

export default function PostCard({post, detail = false, onUpdate}) {
  const {user, request, notify} = useSession();
  const {edit, remove} = useOutletContext();
  const [busy, setBusy] = useState(false);
  const postId = id(post), own = id(post.user) === id(user);
  async function like() {
    if (busy) return;
    setBusy(true);
    try {
      await request(`/posts/${postId}/like`, {method:'PUT'});
      const updated = data(await request(`/posts/${postId}`)).post;
      onUpdate?.(updated);
    } catch (error) {notify(error.message);} finally {setBusy(false);}
  }
  async function copy() {
    try {await navigator.clipboard.writeText(`${location.origin}${location.pathname}#/post/${postId}`); notify('Post link copied.');}
    catch {notify('Open the post and copy its address from your browser.');}
  }
  return <article className="card post">
    <div className="post-header"><Avatar user={post.user} /><div className="post-author"><b>{post.user?.name || 'Community member'}</b><small>{displayDate(post.createdAt)} <span>· Public</span></small></div>
      {own && <details className="actions"><summary aria-label="Post options">•••</summary><div><button onClick={() => edit({type:'post', record:post})}>Edit post</button><button className="danger" onClick={() => remove({type:'post', record:post})}>Delete post</button></div></details>}
    </div>
    {post.body && <p className="post-body" dir="auto">{post.body}</p>}
    <Photo src={post.image} alt={`Photo shared by ${post.user?.name || 'a member'}`} />
    <div className="post-stats"><span>{Number(post.likesCount ?? post.likes?.length ?? 0)} appreciations</span><Link to={`/post/${postId}`}>{Number(post.commentsCount ?? post.comments?.length ?? 0)} comments</Link></div>
    <div className="post-footer"><button className={`text-button ${post.liked ? 'liked' : ''}`} onClick={like} disabled={busy}><Icon name="heart" />Appreciate</button><Link to={`/post/${postId}`} className="text-button"><Icon name="comment" />{detail ? 'Conversation' : 'Join the conversation'}</Link><button className="text-button share" onClick={copy}><Icon name="arrow" /><span>Copy link</span></button></div>
  </article>;
}
