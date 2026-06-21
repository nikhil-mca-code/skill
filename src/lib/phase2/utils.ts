export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formValue(value: FormDataEntryValue | null) {
  if (typeof value !== 'string') return '';
  return value.trim();
}

export function optionalFormValue(value: FormDataEntryValue | null) {
  const normalized = formValue(value);
  return normalized.length > 0 ? normalized : undefined;
}

export function csvToArray(value: FormDataEntryValue | null) {
  const normalized = formValue(value);
  if (!normalized) return [];
  return normalized
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}
