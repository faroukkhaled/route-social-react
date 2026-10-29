export function validatedForm(form, textKey) {
  const body = new FormData(form);
  if (textKey) {
    const text = String(body.get(textKey) || '').trim();
    body.set(textKey, text);
    if (!text && !body.get('image')?.size) throw Error('Add some text or a photo first.');
  }
  for (const key of ['image', 'photo']) {
    const file = body.get(key);
    if (!(file instanceof File)) continue;
    if (!file.size) {body.delete(key); continue;}
    if (!file.type.startsWith('image/')) throw Error('Please choose an image file.');
    if (file.size > 5 * 1024 * 1024) throw Error('Please choose an image smaller than 5 MB.');
  }
  return body;
}
