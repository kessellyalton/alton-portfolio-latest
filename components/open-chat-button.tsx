"use client";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function OpenChatButton({ children, className }: Props) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("open-chat"))}
      className={className}
    >
      {children}
    </button>
  );
}
