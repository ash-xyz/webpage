// A rat that chases your cursor. Adapted from oneko.js
// (https://github.com/adryd325/oneko.js), with a fixed reduced-motion
// check and a runtime listener that removes the rat if you opt out.
(function onerat() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduceMotion.matches) return;

  const ratEl = document.createElement("div");
  let persistPosition = true;

  let ratPosX = 32;
  let ratPosY = 32;

  let mousePosX = 0;
  let mousePosY = 0;

  let frameCount = 0;
  let idleTime = 0;
  let idleAnimation = null;
  let idleAnimationFrame = 0;

  const ratSpeed = 10;
  const spriteSets = {
    idle: [[-3, -3]],
    alert: [[-7, -3]],
    scratchSelf: [
      [-5, 0],
      [-6, 0],
      [-7, 0],
    ],
    scratchWallN: [
      [0, 0],
      [0, -1],
    ],
    scratchWallS: [
      [-7, -1],
      [-6, -2],
    ],
    scratchWallE: [
      [-2, -2],
      [-2, -3],
    ],
    scratchWallW: [
      [-4, 0],
      [-4, -1],
    ],
    tired: [[-3, -2]],
    sleeping: [
      [-2, 0],
      [-2, -1],
    ],
    N: [
      [-1, -2],
      [-1, -3],
    ],
    NE: [
      [0, -2],
      [0, -3],
    ],
    E: [
      [-3, 0],
      [-3, -1],
    ],
    SE: [
      [-5, -1],
      [-5, -2],
    ],
    S: [
      [-6, -3],
      [-7, -2],
    ],
    SW: [
      [-5, -3],
      [-6, -1],
    ],
    W: [
      [-4, -2],
      [-4, -3],
    ],
    NW: [
      [-1, 0],
      [-1, -1],
    ],
  };

  function removeRat() {
    ratEl.remove();
  }

  function init() {
    let ratFile = "rat.png";
    const curScript = document.currentScript;
    if (curScript && curScript.dataset.cat) {
      ratFile = curScript.dataset.cat;
    }
    if (curScript && curScript.dataset.persistPosition) {
      persistPosition =
        curScript.dataset.persistPosition === ""
          ? true
          : JSON.parse(curScript.dataset.persistPosition.toLowerCase());
    }

    if (persistPosition) {
      const stored = JSON.parse(window.localStorage.getItem("onerat"));
      if (stored !== null) {
        ratPosX = stored.ratPosX;
        ratPosY = stored.ratPosY;
        mousePosX = stored.mousePosX;
        mousePosY = stored.mousePosY;
        frameCount = stored.frameCount;
        idleTime = stored.idleTime;
        idleAnimation = stored.idleAnimation;
        idleAnimationFrame = stored.idleAnimationFrame;
        ratEl.style.backgroundPosition = stored.bgPos;
      }
    }

    ratEl.id = "onerat";
    ratEl.ariaHidden = true;
    ratEl.style.width = "32px";
    ratEl.style.height = "32px";
    ratEl.style.position = "fixed";
    ratEl.style.pointerEvents = "none";
    ratEl.style.imageRendering = "pixelated";
    ratEl.style.left = `${ratPosX - 16}px`;
    ratEl.style.top = `${ratPosY - 16}px`;
    ratEl.style.zIndex = 2147483647;
    ratEl.style.backgroundImage = `url(${ratFile})`;

    document.body.appendChild(ratEl);

    document.addEventListener("mousemove", function (event) {
      mousePosX = event.clientX;
      mousePosY = event.clientY;
    });

    // If the visitor opts into reduced motion while the page is open, leave.
    reduceMotion.addEventListener("change", function (event) {
      if (event.matches) removeRat();
    });

    if (persistPosition) {
      window.addEventListener("beforeunload", function () {
        window.localStorage.setItem(
          "onerat",
          JSON.stringify({
            ratPosX,
            ratPosY,
            mousePosX,
            mousePosY,
            frameCount,
            idleTime,
            idleAnimation,
            idleAnimationFrame,
            bgPos: ratEl.style.backgroundPosition,
          }),
        );
      });
    }

    window.requestAnimationFrame(onAnimationFrame);
  }

  let lastFrameTimestamp;

  function onAnimationFrame(timestamp) {
    // Stop if the rat element is removed from the DOM.
    if (!ratEl.isConnected) return;
    if (!lastFrameTimestamp) lastFrameTimestamp = timestamp;
    if (timestamp - lastFrameTimestamp > 100) {
      lastFrameTimestamp = timestamp;
      frame();
    }
    window.requestAnimationFrame(onAnimationFrame);
  }

  function setSprite(name, frame) {
    const sprite = spriteSets[name][frame % spriteSets[name].length];
    ratEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
  }

  function resetIdleAnimation() {
    idleAnimation = null;
    idleAnimationFrame = 0;
  }

  function idle() {
    idleTime += 1;

    // every ~ 20 seconds
    if (
      idleTime > 10 &&
      Math.floor(Math.random() * 200) == 0 &&
      idleAnimation == null
    ) {
      const availableIdleAnimations = ["sleeping", "scratchSelf"];
      if (ratPosX < 32) availableIdleAnimations.push("scratchWallW");
      if (ratPosY < 32) availableIdleAnimations.push("scratchWallN");
      if (ratPosX > window.innerWidth - 32)
        availableIdleAnimations.push("scratchWallE");
      if (ratPosY > window.innerHeight - 32)
        availableIdleAnimations.push("scratchWallS");
      idleAnimation =
        availableIdleAnimations[
          Math.floor(Math.random() * availableIdleAnimations.length)
        ];
    }

    switch (idleAnimation) {
      case "sleeping":
        if (idleAnimationFrame < 8) {
          setSprite("tired", 0);
          break;
        }
        setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
        if (idleAnimationFrame > 192) resetIdleAnimation();
        break;
      case "scratchWallN":
      case "scratchWallS":
      case "scratchWallE":
      case "scratchWallW":
      case "scratchSelf":
        setSprite(idleAnimation, idleAnimationFrame);
        if (idleAnimationFrame > 9) resetIdleAnimation();
        break;
      default:
        setSprite("idle", 0);
        return;
    }
    idleAnimationFrame += 1;
  }

  function frame() {
    frameCount += 1;
    const diffX = ratPosX - mousePosX;
    const diffY = ratPosY - mousePosY;
    const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

    if (distance < ratSpeed || distance < 48) {
      idle();
      return;
    }

    idleAnimation = null;
    idleAnimationFrame = 0;

    if (idleTime > 1) {
      setSprite("alert", 0);
      // count down after being alerted before moving
      idleTime = Math.min(idleTime, 7);
      idleTime -= 1;
      return;
    }

    let direction = "";
    direction += diffY / distance > 0.5 ? "N" : "";
    direction += diffY / distance < -0.5 ? "S" : "";
    direction += diffX / distance > 0.5 ? "W" : "";
    direction += diffX / distance < -0.5 ? "E" : "";
    setSprite(direction, frameCount);

    ratPosX -= (diffX / distance) * ratSpeed;
    ratPosY -= (diffY / distance) * ratSpeed;

    ratPosX = Math.min(Math.max(16, ratPosX), window.innerWidth - 16);
    ratPosY = Math.min(Math.max(16, ratPosY), window.innerHeight - 16);

    ratEl.style.left = `${ratPosX - 16}px`;
    ratEl.style.top = `${ratPosY - 16}px`;
  }

  init();
})();
