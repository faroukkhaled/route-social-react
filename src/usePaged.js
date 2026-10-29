import {useCallback, useEffect, useRef, useState} from 'react';
import {list} from './api.js';
import {useSession} from './session.jsx';

export function usePaged(path, key, revision = 0) {
  const {request} = useSession();
  const [items, setItems] = useState([]), [loading, setLoading] = useState(true);
  const [error, setError] = useState(''), [more, setMore] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const generation = useRef(0), page = useRef(1), busy = useRef(false);
  const url = useCallback(number => `${path}${path.includes('?') ? '&' : '?'}page=${number}&limit=10`, [path]);
  useEffect(() => {
    const run = ++generation.current;
    busy.current = true; page.current = 1;
    setLoading(true); setError(''); setItems([]); setMore(false);
    request(url(1)).then(response => {
      if (run !== generation.current) return;
      const batch = list(response, key); setItems(batch); setMore(batch.length === 10);
    }).catch(err => {if (run === generation.current) setError(err.message);})
      .finally(() => {if (run === generation.current) {setLoading(false); busy.current = false;}});
    return () => {generation.current++;};
  }, [url, key, revision, retryCount, request]);
  async function loadMore() {
    if (busy.current || !more) return;
    const run = generation.current, next = page.current + 1;
    busy.current = true; setLoading(true); setError('');
    try {
      const batch = list(await request(url(next)), key);
      if (run !== generation.current) return;
      setItems(previous => [...previous, ...batch]); page.current = next; setMore(batch.length === 10);
    } catch (err) {if (run === generation.current) setError(err.message);}
    finally {if (run === generation.current) {setLoading(false); busy.current = false;}}
  }
  return {items, setItems, loading, error, more, loadMore, retry:() => setRetryCount(count => count + 1)};
}
