/* @layer renderer-shell @kind logic */
const titleBarClassName = (concealed: boolean, menuOpen: boolean, peeking: boolean, className: string): string => {
  const tucked = concealed && !menuOpen;
  return ['titlebar', tucked && 'titlebar--hidden', tucked && peeking && 'titlebar--peek', className]
    .filter(Boolean)
    .join(' ');
};

export { titleBarClassName };
