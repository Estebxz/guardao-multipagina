"use client";

import { SpinnerIcon } from "@ico/spinner";
import { useIsMobile } from "@hooks/use-mobile";
import { useEffect, useState, useRef, useCallback } from "react";
import { cn } from "@lib/utils";
import { useRouter } from "next/navigation";

interface KeyProps {
  char: string;
  active?: boolean;
  onPress: () => void;
}

const Key: React.FC<KeyProps> = ({ char, active, onPress }) => {
  return (
    <div
      className={cn("key", active && "active")}
      onClick={onPress}
      role="button"
      tabIndex={0}
      aria-label="Press to continue"
    >
      <div className="side" />
      <div className="top">
        {active ? (
          <SpinnerIcon className="char size-10 animate-spin" />
        ) : (
          <div className="char">{char}</div>
        )}
      </div>
    </div>
  );
};

const useSound = (url: string) => {
  const audio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audio.current = new Audio(url);
  }, [url]);

  return () => {
    if (!audio.current) return;
    audio.current.currentTime = 0;
    audio.current.play().catch(() => {});
  };
};

const GKeyCap: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const play = useSound("/keytype.mp3");
  const isMobile = useIsMobile();

  const navigate = useCallback(() => {
    if (isLoading) return;

    setIsLoading(true);
    play();

    setTimeout(() => {
      router.push("/sign-in");
    }, 150);
  }, [isLoading, play, router]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "t") navigate();
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [navigate]);

  return (
    <div className="keyboard">
      <Key 
      char="T"
      active={isLoading} 
      onPress={navigate} />
      <div className="cover" />

      {isMobile && (
        <button
          className="absolute inset-0 z-10 bg-transparent"
          onClick={navigate}
          type="button"
          aria-label="Continua al inicio de sesion"
        />
      )}
    </div>
  );
};

export default GKeyCap;
