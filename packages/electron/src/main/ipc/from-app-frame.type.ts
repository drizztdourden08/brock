/* @layer electron-main @kind types */
interface Frame {
  origin: string;
  url: string;
}

interface FrameEvent {
  sender: { mainFrame: unknown };
  senderFrame: Frame | null;
}

export type { Frame, FrameEvent };
