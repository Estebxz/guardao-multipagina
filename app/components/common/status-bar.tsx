interface StatusBarProps {
  userName: string | null;
}

export function StatusBar({ userName }: StatusBarProps) {
  const displayName = userName && userName.trim().length > 0 ? userName : "visitante";
  return (
    <footer className="w-full border-border/40 border-t bg-background">
      <div className="flex h-8 w-full items-center justify-between px-4">
        <div className="text-muted-foreground text-xs items-center">
          {displayName} • <a href="/dashboard">GUARDAO</a>
        </div>
      </div>
    </footer>
  );
}
