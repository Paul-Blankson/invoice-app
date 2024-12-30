export type HeadingLevel = 'h1' | 'h2' | 'h3';
export type TextVariant = 'large' | 'small';
export type IconName =
  | 'icon-sun'
  | 'icon-moon'
  | 'icon-arrow-down'
  | 'icon-arrow-up'
  | 'icon-arrow-left'
  | 'icon-arrow-right'
  | 'icon-calendar'
  | 'icon-check'
  | 'icon-delete'
  | 'icon-plus'
  | 'illustration-empty'
  | 'image-avatar'
  | 'logo';
export type BadgeVariant = 'pending' | 'paid' | 'draft';
export interface FilterOption {
  title: string;
  value: string;
}
