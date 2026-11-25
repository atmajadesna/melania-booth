// Illustrative editorial photos are only used for theme inspiration, never in user exports.
Promise.all(
  [0, 1, 2].map(
    (i) =>
      new Promise((resolve, reject) => {
        const im = new Image();
        im.onload = () => resolve(im);
        im.onerror = reject;
        im.src = `assets/editorial-${i}.webp`;
      }),
  ),
)
  .then((images) => {
    const paint = (canvas, index) => {
      const t = themes[index];
      draw(canvas, images, {
        theme: index,
        layout: "strip",
        frame: t.bg,
        caption: "a little moment with you",
        date: false,
        sticker: "heart",
      });
    };
    paint(document.getElementById("hero-strip"), 0);
    document.querySelectorAll(".theme-card canvas").forEach((c, i) => {
      c.setAttribute(
        "aria-label",
        `Contoh tema ${themes[i].name} dengan foto ilustratif`,
      );
      paint(c, i);
    });
  })
  .catch(() => {});
