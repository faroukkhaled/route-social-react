import {useState} from 'react';
import {Link, NavLink, Outlet, useLocation, useNavigate} from 'react-router-dom';
import {useSession} from '../session.jsx';
import {Avatar, Icon} from './UI.jsx';
import {Editor, DeleteConfirmation} from './Editor.jsx';

export default function Layout() {
  const {user, isDemo, logout} = useSession();
  const [editor, setEditor] = useState(null), [deletion, setDeletion] = useState(null), [revision, setRevision] = useState(0);
  const navigate = useNavigate(), location = useLocation();
  function refresh() {setRevision(value => value + 1);}
  function deleted() {
    if (deletion.type === 'post' && location.pathname.startsWith('/post/')) navigate('/');
    setDeletion(null); refresh();
  }
  return <><div className="app-layout"><aside className="sidebar"><Link className="brand" to="/">◌ <span>circle</span><span className="brand-dot">●</span></Link><div className="space-label">YOUR SPACE</div><nav aria-label="Main navigation">
    {[[ '/', 'home', 'Home feed'], ['/profile', 'profile', 'My profile'], ['/settings', 'settings', 'Settings']].map(([path, icon, title]) => <NavLink key={path} to={path} end className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}><Icon name={icon} />{title}</NavLink>)}
    </nav><button className="primary new-post" onClick={() => setEditor({type:'post'})}><Icon name="plus" />Create a post</button><div className="sidebar-note"><span>✳</span><b>A little kindness<br />goes a long way.</b><p>Share something that makes someone’s day.</p></div><div className="sidebar-bottom"><div className="mini-user"><Avatar user={user} /><div><b>{user.name}</b><small>@{user.username || 'member'}</small></div></div><button className="text-button" onClick={logout}><Icon name="logout" />Sign out</button></div></aside>
    <div className="workspace"><header className="topbar"><span className="mobile-brand">◌ circle</span><span className="top-label">A LITTLE CLOSER, EVERY DAY</span><div className="top-right">{isDemo ? <span className="demo-badge">LOCAL DEMO</span> : <><span className="status-dot" /><span>Route community</span></>}<Link to="/profile" aria-label="My profile"><Avatar user={user} size="small" /></Link></div></header><div className="content-grid"><main id="main" tabIndex={-1}><Outlet context={{edit:setEditor, remove:setDeletion, revision, refresh}} /></main><aside className="rightbar"><section className="welcome-card"><span className="eyebrow">MAKE YOURSELF AT HOME</span><h2>More moments.<br />More connection.</h2><p>Your next great conversation could start with a simple hello.</p><div className="sun-art">✺</div><span className="tiny-tag">A SPACE TO BE YOU</span></section><section className="card community"><span className="section-kicker">THE CIRCLE WAY</span><h3>Good things grow together.</h3><p><span>✦</span> Share your everyday</p><p><span>♡</span> Be kind. Be curious.</p><p><span>↗</span> Keep the conversation going</p></section><p className="footer-note">Circle · Built with React<br />Built for the moments between.</p></aside></div></div>
    </div>{editor && <Editor target={editor} onClose={() => setEditor(null)} onSaved={() => {setEditor(null); refresh();}} />}{deletion && <DeleteConfirmation target={deletion} onClose={() => setDeletion(null)} onSaved={deleted} />}</>;
}
