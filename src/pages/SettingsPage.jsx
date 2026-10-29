import {useSession} from '../session.jsx';
import {data} from '../api.js';
import {validatedForm} from '../forms.js';
import {AsyncForm, Avatar, Heading} from '../components/UI.jsx';

export default function SettingsPage() {
  const {user, isDemo, request, refreshUser, refreshToken, logout, notify} = useSession();
  async function photo(form) {
    await request('/users/upload-photo', {method:'PUT', body:validatedForm(form)});
    await refreshUser(); form.reset(); notify('Profile photo updated.');
  }
  async function password(form) {
    const fields = Object.fromEntries(new FormData(form));
    if (fields.newPassword !== fields.confirm) throw Error('New passwords do not match.');
    if (fields.newPassword === fields.password) throw Error('Choose a different new password.');
    const result = data(await request('/users/change-password', {method:'PATCH', body:{password:fields.password, newPassword:fields.newPassword}}));
    form.reset();
    if (!isDemo && result.token) refreshToken(result.token);
    else if (!isDemo) {logout(); notify('Password changed. Please sign in again.'); return;}
    notify(isDemo ? 'Demo form validated. No real password changed.' : 'Password updated successfully.');
  }
  return <><Heading kicker="MAKE IT YOURS" title="Account settings" subtitle="Your profile. Your peace of mind." />
    <section className="card settings-card"><h3>Profile photo</h3><p className="muted">Put a face to the conversations.</p><AsyncForm onSubmit={photo}><div className="photo-row"><Avatar user={user} size="large" /><label>Choose a new photo<input type="file" name="photo" accept="image/*" required /></label></div><button type="submit" className="primary">Save photo</button></AsyncForm></section>
    <section className="card settings-card"><h3>Change password</h3><p className="muted">A fresh password keeps your circle yours.</p><AsyncForm onSubmit={password}><label>Current password<input type="password" name="password" autoComplete="current-password" required /></label><label>New password<input type="password" name="newPassword" autoComplete="new-password" required minLength={8} /></label><small className="muted">Use uppercase, lowercase, a number, a symbol and 8+ characters.</small><label>Confirm new password<input type="password" name="confirm" autoComplete="new-password" required /></label><button className="primary" type="submit">Update password</button></AsyncForm></section>
  </>;
}
