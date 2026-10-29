import {useEffect, useRef, useState} from 'react';

const icons = {home:'⌂', profile:'◉', settings:'⚙', logout:'↪', plus:'＋', image:'▧', arrow:'↗', heart:'♡', comment:'◯'};
export const Icon = ({name}) => <span className="icon" aria-hidden="true">{icons[name]}</span>;
export function Avatar({user, size = ''}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [user?.photo]);
  const safe = /^(https?:|data:image\/)/.test(user?.photo || '');
  return <span className={`avatar ${size}`}>{safe && !failed
    ? <img src={user.photo} alt="" loading="lazy" onError={() => setFailed(true)} />
    : (user?.name || '?').split(' ').map(word => word[0]).slice(0, 2).join('')}</span>;
}
export const Heading = ({kicker, title, subtitle}) => <div className="page-heading"><span className="eyebrow">{kicker}</span><h1>{title}</h1><p>{subtitle}</p></div>;
export const Loading = () => <div aria-label="Loading" role="status"><div className="skeleton" /><div className="skeleton" /></div>;
export const ErrorPanel = ({message, retry}) => <section className="card empty" role="alert"><span>☁</span><h3>Let’s try that again.</h3><p>{message}</p>{retry && <button className="secondary" onClick={retry}>Try again</button>}</section>;
export const Empty = ({title = 'Your next chapter starts here.', message = 'Share the first update and start a conversation.'}) => <section className="card empty"><span>✧</span><h3>{title}</h3><p>{message}</p></section>;
export function AsyncForm({onSubmit, children, className = '', ...props}) {
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  const inFlight = useRef(false);
  async function submit(event) {
    event.preventDefault();
    if (inFlight.current) return;
    const form = event.currentTarget;
    inFlight.current = true; setBusy(true); setError('');
    try {await onSubmit(form);} catch (err) {setError(err.message);}
    finally {inFlight.current = false; setBusy(false);}
  }
  return <form {...props} className={className} onSubmit={submit} aria-busy={busy}>
    <fieldset disabled={busy} className="form-fields">
      {children}
      <p className="form-error" role="alert">{error}</p>
    </fieldset>
  </form>;
}
export function Modal({children, onClose}) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    return () => {dialog.close();};
  }, []);
  return <dialog ref={ref} aria-label="Post or comment action" onCancel={event => {event.preventDefault(); onClose();}}>{children}</dialog>;
}
export function Photo({src, className = 'post-image', alt = 'Shared photo'}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  if (!src || !/^(https?:|data:image\/)/.test(src)) return null;
  return failed ? <p className="muted">This image is unavailable.</p> : <img className={className} src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />;
}
export const displayDate = value => {
  const date = new Date(value);
  return Number.isNaN(+date) ? 'Just now' : date.toLocaleString('en', {month:'short', day:'numeric', hour:'numeric', minute:'2-digit'});
};
