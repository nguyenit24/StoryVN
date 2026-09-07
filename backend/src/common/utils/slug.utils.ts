import { Model, Document } from 'mongoose';
import * as crypto from 'node:crypto';

export function slugify(str: string): string {
  if (!str) return '';

  return str
    .toLowerCase()
    .trim()
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateSlugWithSuffix(str?: string): string {
  const base = str ? slugify(str) : '';
  const randomSuffix = crypto.randomBytes(3).toString('hex');
  return base ? `${base}-${Date.now()}-${randomSuffix}` : `file-${Date.now()}-${randomSuffix}`;
}

export async function generateUniqueSlug<T extends Document>(
  input: string,
  model: Model<T>,
  field = 'slug',
): Promise<string> {
  const baseSlug = slugify(input) || 'item';
  let slug = baseSlug;
  let count = 1;

  while (await model.exists({ [field]: slug })) {
    slug = `${baseSlug}-${count}`;
    count++;
  }

  return slug;
}