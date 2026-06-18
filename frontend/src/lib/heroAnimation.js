import gsap from "gsap";

export const heroAnimation = () => {

  // Main Timeline
  const tl = gsap.timeline();

  // Background Glow Animation
  tl.from(".hero-glow", {
    scale: 0,
    opacity: 0,
    duration: 1.5,
    ease: "power4.out",
  })

  // Title Animation
  .from(".hero-title", {
    y: 100,
    opacity: 0,
    duration: 1,
    ease: "power4.out",
  }, "-=1")

  // Description Animation
  .from(".hero-description", {
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out",
  }, "-=0.5")

  // Buttons Animation
  .from(".hero-buttons", {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out",
  }, "-=0.4")

  // Image Animation
  .from(".hero-image", {
    x: 120,
    opacity: 0,
    scale: 0.8,
    rotate: 5,
    duration: 1.2,
    ease: "power4.out",
  }, "-=1");

  // Floating Animation for Image
  gsap.to(".hero-image", {
    y: -20,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut",
  });

  // Smooth Glow Animation
  gsap.to(".hero-glow", {
    scale: 1.1,
    opacity: 0.6,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  // Button Hover Animation
  const buttons = document.querySelectorAll(".hero-btn");

  buttons.forEach((btn) => {

    btn.addEventListener("mouseenter", () => {

      gsap.to(btn, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out",
      });

    });

    btn.addEventListener("mouseleave", () => {

      gsap.to(btn, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });

    });

  });

};