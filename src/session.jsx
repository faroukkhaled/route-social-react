import {createContext, useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {createClient, data} from './api.js';
import {demoClient} from './demo.js';

const SessionContext = createContext(null);

export function SessionProvider({children}) {
  const [token, setToken] = useState(() => sessionStorage.getItem('circle-token') || '');
  const [isDemo, setIsDemo] = useState(() => sessionStorage.getItem('circle-demo') === 'true');
  const [user, setUser] = useState(null);
  const [profileError, setProfileError] = useState('');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const timer = useRef();
  const notify = useCallback(message => {
    setNotice(message);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setNotice(''), 4500);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);
  const logout = useCallback(() => {
    sessionStorage.removeItem('circle-token');
    sessionStorage.removeItem('circle-demo');
    setToken(''); setIsDemo(false); setUser(null); setProfileError('');
  }, []);
  const live = useMemo(() => createClient({token: () => token, onUnauthorized: () => {
    logout(); notify('Your session expired. Please sign in again.');
  }}), [token, logout, notify]);
  const demo = useMemo(() => demoClient(), []);
  const request = isDemo ? demo : live;
  const login = useCallback(result => {
    if (!result?.token) throw Error('Route did not return a login token.');
    sessionStorage.setItem('circle-token', result.token);
    sessionStorage.removeItem('circle-demo');
    setUser(null); setIsDemo(false); setToken(result.token);
  }, []);
  const refreshToken = useCallback(next => {
    sessionStorage.setItem('circle-token', next); setToken(next);
  }, []);
  const enterDemo = useCallback(() => {
    sessionStorage.removeItem('circle-token');
    sessionStorage.setItem('circle-demo', 'true');
    setToken(''); setUser(null); setIsDemo(true);
  }, []);
  const refreshUser = useCallback(async () => {
    const result = data(await request('/users/profile-data'));
    setUser(result.user || result);
  }, [request]);
  useEffect(() => {
    if (!token && !isDemo) return;
    let active = true;
    setLoading(true); setProfileError('');
    request('/users/profile-data').then(response => {
      if (active) {const result = data(response); setUser(result.user || result);}
    }).catch(error => {if (active) setProfileError(error.message);})
      .finally(() => {if (active) setLoading(false);});
    return () => {active = false;};
  }, [token, isDemo, request]);
  return <SessionContext.Provider value={{token, isDemo, user, loading, profileError, request, live, login, logout, enterDemo, refreshToken, refreshUser, notify}}>
    {children}
    <div id="toast" role="status" aria-live="polite" className={notice ? 'show' : ''}>{notice}</div>
  </SessionContext.Provider>;
}

export const useSession = () => useContext(SessionContext);
