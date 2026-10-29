import {useState} from 'react';
import {Link, Navigate} from 'react-router-dom';
import {useSession} from '../session.jsx';
import {data} from '../api.js';
import {AsyncForm, Icon} from '../components/UI.jsx';

export default function AuthPage({signup = false}) {
  const {token, isDemo, live, login, enterDemo} = useSession();
  const [show, setShow] = useState(false);
  if (token || isDemo) return <Navigate to="/" replace />;
  async function submit(form) {
    const fields = Object.fromEntries(new FormData(form));
    if (signup && fields.password !== fields.rePassword) throw Error('Passwords do not match.');
    login(data(await live(`/users/${signup ? 'signup' : 'signin'}`, {method:'POST', body:fields})));
  }
  return <main className="auth-layout">
    <section className="auth-story"><Link className="brand" to="/">◌ <span>circle</span></Link><div><span className="eyebrow">GOOD COMPANY. GREAT CONVERSATIONS.</span><h1>Your people.<br />A little <em>closer.</em></h1><p>A space for everyday moments, fresh ideas, and the people who make them matter.</p><div className="orbit"><span>✦</span><div className="orbit-circle">hello,<br /><b>connection.</b></div><i>☀</i></div></div><small>Made for connection. Built with care.</small></section>
    <section className="auth-panel"><div className="auth-box"><div className="pill">✦ YOUR NEXT CONVERSATION STARTS HERE</div><h2>{signup ? 'Find your circle.' : 'Welcome back.'}</h2><p className="muted">{signup ? 'A few details, and you’re one of us.' : 'Good to see you. Let’s catch up.'}</p>
      <AsyncForm key={signup ? 'signup' : 'login'} onSubmit={submit}>
        {signup && <><label>Full name<input name="name" autoComplete="name" required minLength={2} maxLength={50} placeholder="Your full name" /></label><label>Username<input name="username" autoComplete="username" required minLength={3} pattern="[A-Za-z0-9_]+" title="Letters, numbers, and underscores only — not your email" placeholder="e.g. farouk_khaled" /><small className="muted">Letters, numbers and _ only. Put your email in the next field.</small></label></>}
        <label>Email address<input type="email" name="email" autoComplete="email" required placeholder="you@example.com" /></label>
        <label>Password<div className="password-field"><input type={show ? 'text' : 'password'} name="password" autoComplete={signup ? 'new-password' : 'current-password'} required minLength={signup ? 8 : undefined} placeholder={signup ? 'Create a strong password' : 'Enter your password'} /><button type="button" className="reveal" aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow(!show)}>{show ? 'Hide' : 'Show'}</button></div></label>
        {signup && <><small className="muted">Use 8+ characters, uppercase, lowercase, a number and a symbol.</small><label>Confirm password<input type="password" name="rePassword" autoComplete="new-password" required placeholder="Repeat your password" /></label><div className="form-grid"><label>Date of birth<input type="date" name="dateOfBirth" required max={new Date().toISOString().slice(0,10)} /></label><label>Gender<select name="gender" required defaultValue=""><option value="">Choose</option><option value="male">Male</option><option value="female">Female</option></select></label></div></>}
        <button className="primary full" type="submit">{signup ? 'Create account' : 'Sign in'} <Icon name="arrow" /></button>
      </AsyncForm>
      <p className="switch-auth">{signup ? 'Already part of the circle?' : 'New around here?'} <Link to={signup ? '/login' : '/signup'}>{signup ? 'Sign in' : 'Create an account'}</Link></p><div className="divider"><span>just looking around?</span></div><button className="secondary full" onClick={enterDemo}>Explore the local demo <Icon name="arrow" /></button><small className="demo-note">Demo data stays in this browser. No Route account needed.</small>
    </div></section>
  </main>;
}
