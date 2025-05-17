import { useEffect, useRef, useState } from "react";

export const useAudio = ({
  src,
  volume,
  isPlaying,
  onPlay,
  onPause,
  onEnded,
}) => {
  const audioRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute("src");
        audioRef.current.load();
  } }; }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;

    setIsReady(false);
    setError(null);
    audio.src = src;
    audio.load();

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsReady(true);
      if (isPlaying) {
        audio.play().catch((err) => {
          setError("Failed to play audio");
          console.error("Audio play error:", err);
    }); } };

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleError = () => setError("Error loading audio");

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("error", handleError);
    };
  }, [src, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isReady) return;

    if (isPlaying) {
      audio.play().catch((err) => {
        setError("Failed to play audio");
        console.error("Audio play error:", err);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, isReady]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => onPlay?.();
    const handlePause = () => onPause?.();
    const handleEnded = () => onEnded?.();

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [onPlay, onPause, onEnded]);

  const seek = (time) => {
    if (isReady && audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
  } };

  return {
    audioRef,
    isReady,
    duration,
    currentTime,
    seek,
    error,
}; };