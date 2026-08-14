"use client";

import { IAboutHeroBanner } from "@/models/widgets/IAboutHeroBanner";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useIntersectionEntry } from "@/hooks/useIntersectionEntry";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

const OBSERVER_OPTIONS: IntersectionObserverInit = { threshold: 0.25 };

const AboutHeroBanner = ({ image, alt, mediaType }: IAboutHeroBanner) => {
  const videoRef = useRef<HTMLVideoElement>(null!);
  const entry = useIntersectionEntry(videoRef, OBSERVER_OPTIONS);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    if (mediaType !== "video" || !videoRef.current) return;
    if (entry?.isIntersecting) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [entry?.isIntersecting, mediaType]);

  return (
    <div>
      <div className="relative h-[945px] w-full">
        {mediaType === "video" ? (
          <video ref={videoRef} className="h-full w-full object-cover" src={image} muted loop playsInline />
        ) : (
          <Image src={image} alt={alt} fill sizes="100vw" className="object-cover" priority />
        )}

        {mediaType === "video" && (
          <div className="absolute bottom-8 left-8 flex items-center gap-4 rounded-full bg-white/30 px-4 py-2 backdrop-blur-sm">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="flex h-6 w-6 items-center justify-center rounded-full border-[1.5px] border-black"
            >
              {isPlaying ? (
                <span className="flex items-center gap-[3px]">
                  <span className="h-[10px] w-[1.5px] bg-black" />
                  <span className="h-[10px] w-[1.5px] bg-black" />
                </span>
              ) : (
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth={2} strokeLinecap="butt" strokeLinejoin="miter">
                  <polygon points="6 3 20 12 6 21 6 3" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute" : "Mute"}
              className="flex items-center justify-center"
            >
              {isMuted ? (
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 1.5 9 1.5 15 6 15 11 19 11 5" />
                  <line x1={22} y1={9} x2={16} y2={15} />
                  <line x1={16} y1={9} x2={22} y2={15} />
                </svg>
              ) : (
                <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 1.5 9 1.5 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutHeroBanner;
