import {id} from '../api.js';
import {useSession} from '../session.jsx';
import {validatedForm} from '../forms.js';
import {AsyncForm, Avatar, Icon, Modal} from './UI.jsx';

export function Editor({target, onClose, onSaved}) {
  const {request, user, notify} = useSession();
  const {type, record, postId} = target;
  const post = type === 'post', editing = !!record;
  async function save(form) {
    const path = post ? `/posts${editing ? '/' + id(record) : ''}` : `/posts/${postId}/comments/${id(record)}`;
    await request(path, {method:editing ? 'PUT' : 'POST', body:validatedForm(form, post ? 'body' : 'content')});
    notify(editing ? 'Changes saved.' : 'Your moment is shared.');
    onSaved();
  }
  return <Modal onClose={onClose}><AsyncForm onSubmit={save}>
    <div className="modal-heading"><div><span className="eyebrow">{post ? 'A MOMENT WORTH SHARING' : 'KEEP THE CONVERSATION GOING'}</span><h2>{editing ? 'Edit' : 'Create'} {post ? 'a post' : 'comment'}</h2></div><button type="button" className="close" onClick={onClose} aria-label="Close">×</button></div>
    <div className="mini-user"><Avatar user={user} /><b>{user.name}</b><span className="visibility">Public</span></div>
    <label className="sr-only" htmlFor="editor-text">{post ? 'Post text' : 'Comment text'}</label><textarea id="editor-text" name={post ? 'body' : 'content'} maxLength={5000} defaultValue={record?.body || record?.content || ''} placeholder={post ? 'What’s on your mind?' : 'Your comment…'} />
    {record?.image && <p className="muted">Your existing image stays unless you choose a replacement.</p>}
    <label className="upload-zone"><Icon name="image" /><span>Add {editing ? 'or replace ' : ''}a photo<small>JPG, PNG, GIF or WebP · up to 5 MB</small></span><input type="file" name="image" accept="image/*" /></label>
    <div className="modal-footer"><button type="button" className="secondary" onClick={onClose}>Cancel</button><button className="primary" type="submit">{editing ? 'Save changes' : 'Share post'}<Icon name="arrow" /></button></div>
  </AsyncForm></Modal>;
}
export function DeleteConfirmation({target, onClose, onSaved}) {
  const {request, notify} = useSession();
  async function confirm() {
    const path = target.type === 'post' ? `/posts/${id(target.record)}` : `/posts/${target.postId}/comments/${id(target.record)}`;
    await request(path, {method:'DELETE'});
    notify(`${target.type === 'post' ? 'Post' : 'Comment'} deleted.`); onSaved();
  }
  return <Modal onClose={onClose}><AsyncForm onSubmit={confirm}><div className="modal-heading"><h2>Delete this {target.type}?</h2><button type="button" className="close" aria-label="Close" onClick={onClose}>×</button></div><p>This permanently removes {target.type === 'post' ? 'the post and its conversation' : 'the comment'}. This cannot be undone.</p><div className="modal-footer"><button type="button" className="secondary" onClick={onClose}>Keep it</button><button className="primary destructive" type="submit">Delete {target.type}</button></div></AsyncForm></Modal>;
}
