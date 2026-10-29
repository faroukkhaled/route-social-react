import {Navigate, Outlet, Route, Routes} from 'react-router-dom';
import {useSession} from './session.jsx';
import {ErrorPanel} from './components/UI.jsx';
import Layout from './components/Layout.jsx';
import AuthPage from './pages/AuthPage.jsx';
import FeedPage from './pages/FeedPage.jsx';
import PostPage from './pages/PostPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

function ProtectedRoute() {
  const {token, isDemo, user, loading, profileError, refreshUser, logout, notify} = useSession();
  if (!token && !isDemo) return <Navigate to="/login" replace />;
  if (profileError && !user) return <main className="boot"><ErrorPanel message={profileError} retry={() => refreshUser().catch(err => notify(err.message))} /><button className="text-button" onClick={logout}>Sign out</button></main>;
  if (!user || loading && !user) return <main className="boot">◌ <b>Finding your circle…</b></main>;
  return <Outlet />;
}
export default function App() {
  return <Routes>
    <Route path="/login" element={<AuthPage />} />
    <Route path="/signup" element={<AuthPage signup />} />
    <Route element={<ProtectedRoute />}><Route element={<Layout />}>
      <Route index element={<FeedPage key="feed" />} />
      <Route path="/profile" element={<FeedPage key="profile" profile />} />
      <Route path="/post/:postId" element={<PostPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route></Route>
  </Routes>;
}
