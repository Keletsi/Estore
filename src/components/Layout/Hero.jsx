import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import heroImg from "../../assets/TBW Fam 2.jpg.jpeg";
import { getHeroSettings } from "../../services/siteSettingsService";

const ROTATE_MS = 2500;

const Hero = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    getHeroSettings().then((settings) => {
      if (!mounted) return;
      setVideoUrl(settings.videoUrl || "");
      setVideoEnabled(Boolean(settings.videoEnabled && settings.videoUrl));
    });
    return () => { mounted = false; };
  }, []);

  const hasVideoAd = Boolean(videoEnabled && videoUrl);

  // Share the same hero box: alternate image <-> video every 2.5s.
  // If no video ad is configured, the hero picture simply stays as-is.
  useEffect(() => {
    if (!hasVideoAd) {
      setShowVideo(false);
      return;
    }
    const id = setInterval(() => {
      setShowVideo((prev) => !prev);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [hasVideoAd]);

  useEffect(() => {
    if (showVideo && videoRef.current) {
      videoRef.current.play?.().catch(() => {});
    }
  }, [showVideo, videoUrl]);

  return (
    <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Hero picture (default slide) */}
      <img
        src={heroImg}
        alt="TallBoy Clothing Fam"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          showVideo && hasVideoAd ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Admin-posted short video ad (shares the same div box, 2.5s each) */}
      {hasVideoAd && (
        <video
          ref={videoRef}
          key={videoUrl}
          src={videoUrl}
          muted
          loop
          autoPlay
          playsInline
          preload="metadata"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            showVideo ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        />
      )}

      <div className="absolute inset-0 bg-gray-800/60 flex items-center justify-center pointer-events-none">
        <div className="text-center text-white p-6 pointer-events-auto">
          <h1 className="text-4xl md:text-7xl font-bold tracking-tighter uppercase mb-4">
            THE KING OF <br /> STREETWEAR
          </h1>
          <p className="text-sm md:text-lg tracking-tight mb-6">
            IT IS AN HONOR TO BE WORN BE AN ORIGINAL
          </p>
          <Link
            to="/shop"
            className="bg-white text-gray-800 px-8 py-3 rounded-sm text-lg font-medium hover:bg-gray-200 transition inline-block"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Slide indicators (only when a video ad exists) */}
      {hasVideoAd && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          <button
            aria-label="Show image"
            onClick={() => setShowVideo(false)}
            className={`h-2 w-6 rounded-full transition-colors ${!showVideo ? "bg-white" : "bg-white/40"}`}
          />
          <button
            aria-label="Show video"
            onClick={() => setShowVideo(true)}
            className={`h-2 w-6 rounded-full transition-colors ${showVideo ? "bg-white" : "bg-white/40"}`}
          />
        </div>
      )}
    </section>
  );
};

export default Hero;
