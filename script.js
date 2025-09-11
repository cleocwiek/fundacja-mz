function toggleMenu() {
  document.getElementById("mobileMenu").classList.toggle("open");
}

// Team carousel: seamless infinite by rotating DOM nodes
(function () {
  const track = document.getElementById("teamTrack");
  const nextBtn = document.getElementById("teamNext");
  if (!track || !nextBtn) return;

  let animating = false;

  function stepSize() {
    const first = track.querySelector(".team-card");
    if (!first) return 0;
    const gap = parseFloat(getComputedStyle(track).gap || 0);
    return first.getBoundingClientRect().width + gap;
  }

  function slideNext() {
    if (animating) return;
    const step = stepSize();
    if (!step) return;
    animating = true;

    // animate left by one card width
    track.style.transition = "transform 0.3s ease";
    track.style.transform = `translateX(-${step}px)`;

    const handleEnd = () => {
      // move the first card to the end to maintain order
      const firstCard = track.firstElementChild;
      if (firstCard) track.appendChild(firstCard);

      // reset transform without visual jump
      track.style.transition = "none";
      track.style.transform = "translateX(0)";

      // force reflow to apply the no-transition state
      void track.offsetHeight; // trigger reflow

      // restore transition for next interaction
      track.style.transition = "transform 0.3s ease";
      track.removeEventListener("transitionend", handleEnd);
      animating = false;
    };

    track.addEventListener("transitionend", handleEnd);
  }

  nextBtn.addEventListener("click", slideNext);

  // keep layout consistent on resize
  window.addEventListener("resize", () => {
    // ensure we're at rest position after resize
    track.style.transition = "none";
    track.style.transform = "translateX(0)";
    void track.offsetHeight;
    track.style.transition = "transform 0.3s ease";
  });
})();
