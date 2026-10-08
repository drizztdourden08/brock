/* @layer renderer-shell @kind types */
interface NotesBodyProps {
  source: string;
  markdown: boolean;
  onOpenLink: (href: string) => void;
}

export type { NotesBodyProps };
