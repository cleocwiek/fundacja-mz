function toggleMenu() {
  document.getElementById("mobileMenu").classList.toggle("open");
}

// Partners carousel: seamless infinite loop like team section
(function () {
  const track = document.getElementById("partnersTrack");
  const prev = document.getElementById("partnersPrev");
  const next = document.getElementById("partnersNext");
  if (!track || !prev || !next) return;

  let animating = false;

  function stepSize() {
    const first = track.querySelector(".partner-item");
    if (!first) return 0;
    const gap = parseFloat(getComputedStyle(track).gap || 0);
    return first.getBoundingClientRect().width + gap;
  }

  function slideNext() {
    if (animating) return;
    const step = stepSize();
    if (!step) return;
    animating = true;

    // animate left by one logo width
    track.style.transition = "transform 0.3s ease";
    track.style.transform = `translateX(-${step}px)`;

    const handleEnd = () => {
      // move the first logo to the end to maintain order
      const firstLogo = track.firstElementChild;
      if (firstLogo) track.appendChild(firstLogo);

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

  function slidePrev() {
    if (animating) return;
    const step = stepSize();
    if (!step) return;
    animating = true;

    // move last logo to beginning
    const lastLogo = track.lastElementChild;
    if (lastLogo) track.insertBefore(lastLogo, track.firstChild);

    // start from -1 step position
    track.style.transition = "none";
    track.style.transform = `translateX(-${step}px)`;
    void track.offsetHeight; // force reflow

    // animate to 0
    track.style.transition = "transform 0.3s ease";
    track.style.transform = "translateX(0)";

    const handleEnd = () => {
      track.removeEventListener("transitionend", handleEnd);
      animating = false;
    };

    track.addEventListener("transitionend", handleEnd);
  }

  next.addEventListener("click", slideNext);
  prev.addEventListener("click", slidePrev);

  // keep layout consistent on resize
  window.addEventListener("resize", () => {
    // ensure we're at rest position after resize
    track.style.transition = "none";
    track.style.transform = "translateX(0)";
    void track.offsetHeight;
    track.style.transition = "transform 0.3s ease";
  });
})();
