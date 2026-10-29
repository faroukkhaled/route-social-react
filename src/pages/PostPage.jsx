import {useEffect, useState} from 'react';
import {Link, useOutletContext, useParams} from 'react-router-dom';
import {useSession} from '../session.jsx';
import {data, id} from '../api.js';
import {usePaged} from '../usePaged.js';
import {validatedForm} from '../forms.js';
import {AsyncForm, Avatar, ErrorPanel, Heading, Icon, Loading, Photo, displayDate} from '../components/UI.jsx';
import PostCard from '../components/PostCard.jsx';

export default function PostPage() {
  const {postId} = useParams();
  const safeId = encodeURIComponent(postId);
  const {request, user, notify} = useSession();
  const {revision, refresh, edit, remove} = useOutletContext();
  const [post, setPost] = useState(null), [error, setError] = useState(''), [loading, setLoading] = useState(true);
  const comments = usePaged(`/posts/${safeId}/comments`, 'comments', revision);
  useEffect(() => {
    let active = true; setLoading(true); setError('');
    request(`/posts/${safeId}`).then(response => {
      if (active) setPost(data(response).post);
    }).catch(err => {if (active) setError(err.message);})
      .finally(() => {if (active) setLoading(false);});
    return () => {active = false;};
  }, [safeId, request, revision]);
  async function comment(form) {
    await request(`/posts/${safeId}/comments`, {method:'POST', body:validatedForm(form, 'content')});
    form.reset(); notify('Your comment is in the conversation.'); refresh();
  }
  return <><Link to="/" className="back-link">← Back to feed</Link><Heading kicker="A LITTLE MORE CONVERSATION" title="The full story." subtitle="Good moments are even better when you join in." />
    {loading && !post && <Loading />}
    {error && <ErrorPanel message={error} retry={refresh} />}
    {post && !error && <><PostCard post={post} detail onUpdate={setPost} /><section className="card comments-section"><h3>The conversation</h3>
      <AsyncForm onSubmit={comment} className="comment-form"><div className="comment-form-row"><Avatar user={user} /><div><label className="sr-only" htmlFor="content">Write a comment</label><textarea id="content" name="content" maxLength={5000} placeholder="Add a little to the conversation…" /><div className="comment-toolbar"><label className="file-label"><Icon name="image" /><span>Add photo</span><input type="file" name="image" accept="image/*" /></label><button type="submit" className="primary compact">Send<Icon name="arrow" /></button></div></div></div></AsyncForm>
      {comments.items.map(item => {
        const author = item.commentCreator || item.user;
        return <article className="comment" key={id(item)}><Avatar user={author} size="small" /><div className="comment-content"><div><b>{author?.name || 'Member'}</b><small>{displayDate(item.createdAt)}</small></div><p dir="auto">{item.content}</p><Photo src={item.image} className="comment-image" alt="Comment attachment" /><div className="comment-actions">{id(author) === id(user) && <button onClick={() => edit({type:'comment', record:item, postId:safeId})}>Edit</button>}{(id(author) === id(user) || id(post.user) === id(user)) && <button className="danger" onClick={() => remove({type:'comment', record:item, postId:safeId})}>Delete</button>}</div></div></article>;
      })}
      {comments.loading && <p className="muted" role="status">Loading comments…</p>}
      {comments.error && <ErrorPanel message={comments.error} retry={comments.items.length ? comments.loadMore : comments.retry} />}
      {!comments.loading && !comments.error && !comments.items.length && <p className="no-comments">A fresh conversation. Be the first to say hello.</p>}
      {comments.more && <button className="secondary load-more" disabled={comments.loading} onClick={comments.loadMore}>More comments</button>}
    </section></>}
  </>;
}
