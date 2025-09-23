function toggleMenu() {
  document.getElementById("mobileMenu").classList.toggle("open");
}

// Team carousel: seamless infinite loop with touch support and two arrows
(function () {
  const track = document.getElementById("teamTrack");
  const prev = document.getElementById("teamPrev");
  const next = document.getElementById("teamNext");
  if (!track || !prev || !next) return;

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

  function slidePrev() {
    if (animating) return;
    const step = stepSize();
    if (!step) return;
    animating = true;

    // move last card to beginning
    const lastCard = track.lastElementChild;
    if (lastCard) track.insertBefore(lastCard, track.firstChild);

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

  // Touch/swipe functionality for mobile
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  function handleTouchStart(e) {
    startX = e.touches[0].clientX;
    isDragging = true;
  }

  function handleTouchMove(e) {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
    const diffX = startX - currentX;

    // Only allow horizontal swiping
    if (Math.abs(diffX) > 10) {
      e.preventDefault();
    }
  }

  function handleTouchEnd(e) {
    if (!isDragging) return;
    isDragging = false;

    const diffX = startX - currentX;
    const threshold = 50; // Minimum swipe distance

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        slideNext(); // Swipe left - go to next
      } else {
        slidePrev(); // Swipe right - go to previous
      }
    }
  }

  // Mouse drag functionality for desktop
  function handleMouseDown(e) {
    startX = e.clientX;
    isDragging = true;
    e.preventDefault();
  }

  function handleMouseMove(e) {
    if (!isDragging) return;
    currentX = e.clientX;
  }

  function handleMouseUp(e) {
    if (!isDragging) return;
    isDragging = false;

    const diffX = startX - currentX;
    const threshold = 50;

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        slideNext(); // Drag left - go to next
      } else {
        slidePrev(); // Drag right - go to previous
      }
    }
  }

  // Event listeners
  next.addEventListener("click", slideNext);
  prev.addEventListener("click", slidePrev);

  // Touch events for mobile
  track.addEventListener("touchstart", handleTouchStart, { passive: false });
  track.addEventListener("touchmove", handleTouchMove, { passive: false });
  track.addEventListener("touchend", handleTouchEnd);

  // Mouse events for desktop (optional)
  track.addEventListener("mousedown", handleMouseDown);
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);

  // keep layout consistent on resize
  window.addEventListener("resize", () => {
    // ensure we're at rest position after resize
    track.style.transition = "none";
    track.style.transform = "translateX(0)";
    void track.offsetHeight;
    track.style.transition = "transform 0.3s ease";
  });
})();

// Partners carousel: seamless infinite loop with auto-movement and touch support
(function () {
  const track = document.getElementById("partnersTrack");
  const prev = document.getElementById("partnersPrev");
  const next = document.getElementById("partnersNext");
  if (!track || !prev || !next) return;

  let animating = false;
  let autoMoveInterval;
  let isPaused = false;

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

  // Auto-movement functionality
  function startAutoMove() {
    autoMoveInterval = setInterval(() => {
      if (!isPaused && !animating) {
        slideNext();
      }
    }, 3000); // Move every 3 seconds
  }

  function stopAutoMove() {
    if (autoMoveInterval) {
      clearInterval(autoMoveInterval);
      autoMoveInterval = null;
    }
  }

  // Touch/swipe functionality
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  function handleTouchStart(e) {
    startX = e.touches[0].clientX;
    isDragging = true;
    isPaused = true;
    stopAutoMove();
  }

  function handleTouchMove(e) {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
    const diffX = startX - currentX;

    // Only allow horizontal swiping
    if (Math.abs(diffX) > 10) {
      e.preventDefault();
    }
  }

  function handleTouchEnd(e) {
    if (!isDragging) return;
    isDragging = false;

    const diffX = startX - currentX;
    const threshold = 50; // Minimum swipe distance

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        slideNext(); // Swipe left - go to next
      } else {
        slidePrev(); // Swipe right - go to previous
      }
    }

    // Resume auto-movement after a delay
    setTimeout(() => {
      isPaused = false;
      startAutoMove();
    }, 2000);
  }

  // Mouse drag functionality for desktop
  function handleMouseDown(e) {
    startX = e.clientX;
    isDragging = true;
    isPaused = true;
    stopAutoMove();
    e.preventDefault();
  }

  function handleMouseMove(e) {
    if (!isDragging) return;
    currentX = e.clientX;
  }

  function handleMouseUp(e) {
    if (!isDragging) return;
    isDragging = false;

    const diffX = startX - currentX;
    const threshold = 50;

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        slideNext();
      } else {
        slidePrev();
      }
    }

    setTimeout(() => {
      isPaused = false;
      startAutoMove();
    }, 2000);
  }

  // Event listeners
  next.addEventListener("click", () => {
    isPaused = true;
    stopAutoMove();
    slideNext();
    setTimeout(() => {
      isPaused = false;
      startAutoMove();
    }, 2000);
  });

  prev.addEventListener("click", () => {
    isPaused = true;
    stopAutoMove();
    slidePrev();
    setTimeout(() => {
      isPaused = false;
      startAutoMove();
    }, 2000);
  });

  // Touch events
  track.addEventListener("touchstart", handleTouchStart, { passive: false });
  track.addEventListener("touchmove", handleTouchMove, { passive: false });
  track.addEventListener("touchend", handleTouchEnd);

  // Mouse events for desktop
  track.addEventListener("mousedown", handleMouseDown);
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);

  // Pause auto-movement on hover
  track.addEventListener("mouseenter", () => {
    isPaused = true;
    stopAutoMove();
  });

  track.addEventListener("mouseleave", () => {
    isPaused = false;
    startAutoMove();
  });

  // Start auto-movement
  startAutoMove();

  // keep layout consistent on resize
  window.addEventListener("resize", () => {
    // ensure we're at rest position after resize
    track.style.transition = "none";
    track.style.transform = "translateX(0)";
    void track.offsetHeight;
    track.style.transition = "transform 0.3s ease";
  });
})();
