import {useState} from 'react';
import {Link, useOutletContext} from 'react-router-dom';
import {useSession} from '../session.jsx';
import {usePaged} from '../usePaged.js';
import {id} from '../api.js';
import {Avatar, Empty, ErrorPanel, Heading, Icon, Loading} from '../components/UI.jsx';
import PostCard from '../components/PostCard.jsx';

export default function FeedPage({profile = false}) {
  const {user} = useSession();
  const {edit, revision} = useOutletContext();
  const [filter, setFilter] = useState('all'), [search, setSearch] = useState('');
  const pager = usePaged(`/posts/feed?only=${profile ? 'me' : filter}`, 'posts', revision);
  const filtered = pager.items.filter(post => `${post.body || ''} ${post.user?.name || ''}`.toLowerCase().includes(search.toLowerCase()));
  const update = post => pager.setItems(items => items.map(item => id(item) === id(post) ? post : item));
  return <>
    <Heading kicker={profile ? 'YOUR CORNER OF THE CIRCLE' : 'YOUR DAILY DOSE OF CONNECTION'} title={profile ? 'My profile' : <>The home feed<span className="heading-star">✳</span></>} subtitle={profile ? 'A little about you. Everything you share.' : 'A place for your thoughts, your people, and everything in between.'} />
    {profile ? <><section className="card profile-card"><div className="profile-cover"><span>keep growing ✳</span></div><div className="profile-info"><Avatar user={user} size="large" /><Link className="secondary compact" to="/settings">Edit photo &amp; security</Link><h2>{user.name}</h2><p>@{user.username || 'member'}</p><small>{user.email}</small></div></section><h3 className="section-title">Your moments</h3></> : <>
      <section className="card composer"><div className="compose-start"><Avatar user={user} /><button onClick={() => edit({type:'post'})}>What’s on your mind, {user.name?.split(' ')[0]}?</button></div><div className="composer-bottom"><button className="text-button" onClick={() => edit({type:'post'})}><Icon name="image" />Photo / moment</button><span>Big ideas. Little updates. All welcome.</span><button className="primary compact" onClick={() => edit({type:'post'})}>Post<Icon name="plus" /></button></div></section>
      <div className="feed-controls"><div className="feed-tabs">{[['all','Everyone'],['following','Following']].map(([value,label]) => <button key={value} className={filter === value ? 'selected' : ''} onClick={() => setFilter(value)}>{label}</button>)}</div><label className="search"><span aria-hidden="true">⌕</span><input aria-label="Search loaded posts" placeholder="Search this feed" value={search} onChange={event => setSearch(event.target.value)} /></label></div>
    </>}
    {filtered.map(post => <PostCard key={id(post)} post={post} onUpdate={update} />)}
    {pager.loading && !pager.items.length && <Loading />}
    {!pager.loading && !pager.error && !filtered.length && <Empty title={search ? 'No matching moments.' : undefined} message={search ? 'Try another name or word.' : undefined} />}
    {pager.error && <ErrorPanel message={pager.error} retry={pager.items.length ? pager.loadMore : pager.retry} />}
    {pager.more && <button className="secondary load-more" disabled={pager.loading} onClick={pager.loadMore}>{pager.loading ? 'Loading…' : 'Load more moments'}</button>}
  </>;
}
