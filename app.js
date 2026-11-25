"use strict";
const $ = (id) => document.getElementById(id);
const themes = [
  { name: "Coquette", bg: "#f9dce5", ink: "#79344d", mark: "♡" },
  { name: "Scrapbook", bg: "#f0e5ce", ink: "#735b3b", mark: "✿" },
  { name: "Y2K", bg: "#edcefa", ink: "#673093", mark: "✦" },
  { name: "Pastel", bg: "#e2e9de", ink: "#415a4d", mark: "✿" },
  { name: "Monochrome", bg: "#252129", ink: "#ffffff", mark: "♡" },
  { name: "Film", bg: "#ead7bc", ink: "#483d30", mark: "✦" },
  { name: "Cherry", bg: "#ffe2e8", ink: "#922b4f", mark: "♡" },
  { name: "Garden", bg: "#e3efd9", ink: "#385d41", mark: "✿" },
  { name: "Ocean", bg: "#d6ecfa", ink: "#285773", mark: "~" },
  { name: "Lavender", bg: "#eee0fb", ink: "#654187", mark: "✦" },
];
let photos = [],
  stream = null,
  facing = "user",
  busy = false,
  cancelled = false,
  retake = -1,
  history = [],
  future = [];
const status = (message) => ($("status").textContent = message);
function options() {
  return {
    theme: +$("theme").value || 0,
    layout: $("layout").value,
    caption: $("caption").value,
    date: $("date").checked,
    frame: $("frame").value,
    sticker: $("sticker").value,
    filter: $("filter").value,
    light: $("light").value,
  };
}
function remember() {
  history.push(options());
  if (history.length > 30) history.shift();
  future = [];
}
function restore(o) {
  Object.entries(o).forEach(([k, v]) => {
    if (k === "date") $(k).checked = v;
    else $(k).value = v;
  });
  render();
}
function syncGallery() {
  document
    .querySelectorAll(".theme-card")
    .forEach((b, i) =>
      b.setAttribute("aria-pressed", String(i === +$("theme").value)),
    );
}
function draw(canvas, imgs, o, illustration = false) {
  const theme = themes[o.theme];
  const grid = o.layout === "grid" && imgs.length === 4;
  const n = illustration ? 3 : imgs.length || Number($("shots").value);
  const w = 720,
    pad = 44,
    gap = 22,
    pw = grid ? 305 : 632,
    ph = grid ? 305 : 440;
  canvas.width = w;
  canvas.height = grid ? 940 : pad + n * (ph + gap) + 160;
  const c = canvas.getContext("2d");
  c.fillStyle = o.frame || theme.bg;
  c.fillRect(0, 0, w, canvas.height);
  for (let i = 0; i < (grid ? 4 : n); i++) {
    let x = pad + (grid ? (i % 2) * (pw + gap) : 0),
      y = pad + (grid ? Math.floor(i / 2) : i) * (ph + gap);
    c.save();
    c.beginPath();
    c.rect(x, y, pw, ph);
    c.clip();
    const im = imgs[i];
    if (im) {
      c.filter = `${o.filter} brightness(${o.light}%)`;
      const crop = illustration ? null : im.boothCrop;
      const scale = Math.max(pw / im.width, ph / im.height) * (crop?.zoom || 1);
      c.drawImage(
        im,
        x + (pw - im.width * scale) * (crop?.x ?? .5),
        y + (ph - im.height * scale) * (crop?.y ?? .5),
        im.width * scale,
        im.height * scale,
      );
      c.filter = "none";
    } else {
      c.fillStyle = ["#eab6c5", "#dfd2e7", "#eee2ce"][i % 3];
      c.fillRect(x, y, pw, ph);
      c.fillStyle = theme.ink;
      c.textAlign = "center";
      c.font = "72px Georgia";
      c.fillText(
        illustration ? ["smile", "a little", "moment"][i % 3] : "♡",
        x + pw / 2,
        y + ph / 2,
      );
      c.font = "20px sans-serif";
      c.fillText(
        illustration ? "ILLUSTRATIVE THEME PREVIEW" : `FOTO ${i + 1}`,
        x + pw / 2,
        y + ph / 2 + 45,
      );
    }
    c.restore();
    c.save(); c.strokeStyle=theme.ink; c.fillStyle=theme.ink;
    if(o.theme===0){c.lineWidth=3;c.beginPath();c.ellipse(x+pw/2-19,y,22,9,-.4,0,Math.PI*2);c.ellipse(x+pw/2+19,y,22,9,.4,0,Math.PI*2);c.stroke();c.beginPath();c.moveTo(x+pw/2,y);c.lineTo(x+pw/2-16,y+30);c.moveTo(x+pw/2,y);c.lineTo(x+pw/2+16,y+30);c.stroke();}
    if(o.theme===2){c.lineWidth=4;c.strokeRect(x-8,y-8,pw+16,ph+16);c.font='28px Arial';c.fillText('✦',x+12,y+28);c.fillText('✦',x+pw-40,y+ph-12);}
    if(o.theme===3){c.lineWidth=5;c.strokeStyle=['#c686ca','#61a6a1','#dc8a56','#db719b'][i%4];c.strokeRect(x-7,y-7,pw+14,ph+14);}
    if(o.theme===4){c.font='16px Arial';c.textAlign='right';c.fillText(String(i+1).padStart(2,'0'),x+pw,y+ph+18);}
    c.restore();
    if(o.theme>=6){c.save();c.strokeStyle=theme.ink;c.fillStyle=theme.ink;c.lineWidth=3;for(let z=0;z<6;z++){let px=x+30+z*(pw-60)/5;if(o.theme===6){c.beginPath();c.arc(px,y-8,7,0,Math.PI*2);c.arc(px+11,y-5,7,0,Math.PI*2);c.fill();c.beginPath();c.moveTo(px,y-15);c.lineTo(px+7,y-25);c.stroke();}else if(o.theme===7){c.beginPath();c.ellipse(px,y-6,12,5,-.6,0,Math.PI*2);c.fill();}else if(o.theme===8){c.beginPath();c.arc(px,y-4,18,0,Math.PI);c.stroke();}else{c.font='24px Arial';c.fillText('✦',px,y+2);}}c.restore();}
    if (o.theme === 5) {
      c.fillStyle = theme.ink;
      for (let j = 0; j < 5; j++) {
        c.fillRect(10, y + 20 + j * 85, 18, 35);
        c.fillRect(692, y + 20 + j * 85, 18, 35);
      }
    }
    if (o.theme === 1) {
      c.save();
      c.globalAlpha = 0.5;
      c.fillStyle = "#ffffff";
      c.translate(x + pw / 2, y);
      c.rotate(-0.08);
      c.fillRect(-65, -12, 130, 28);
      c.restore();
    }
  }
  c.fillStyle = theme.ink;
  c.textAlign = "center";
  c.font = "32px Georgia";
  c.fillText("melania booth", 360, canvas.height - 112);
  c.font = "19px sans-serif";
  c.fillText(o.caption, 360, canvas.height - 73, 620);
  if (o.date) {
    c.font = "14px sans-serif";
    c.fillText(
      new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      360,
      canvas.height - 35,
    );
  }
  if (o.sticker !== "none") {
    const mark =
      { heart: "♡", star: "✦", flower: "✿" }[o.sticker] || theme.mark;
    c.font = "38px Georgia";
    c.fillText(mark, 65, canvas.height - 90);
    c.fillText(mark, 655, canvas.height - 90);
  }
}
function render() {
  const o = options();
  draw($("result"), photos, o);
  syncGallery();
  $("layout").querySelector("[value=grid]").disabled = photos.length !== 4;
  for (const id of ["download", "story", "share"])
    $(id).disabled = !photos.length || busy;
  $("undo").disabled = !history.length;
  $("redo").disabled = !future.length;
  $("camera").style.transform = $("mirror").checked ? "scaleX(-1)" : "none";
  $("camera").style.filter = `${o.filter} brightness(${o.light}%)`;
}
async function startCamera() {
  if (busy) return;
  if (!navigator.mediaDevices?.getUserMedia) {
    status(
      "Kamera membutuhkan HTTPS dan browser yang mendukung. Coba Chrome/Safari atau upload foto.",
    );
    return;
  }
  if (stream) {
    stream.getTracks().forEach((t) => t.stop());
    stream = null;
  }
  $("start-camera").disabled = true;
  status("Menunggu izin kamera…");
  try {
    const next = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: facing },
        width: { ideal: 1280 },
        height: { ideal: 960 },
      },
      audio: false,
    });
    stream = next;
    $("camera").srcObject = stream;
    await $("camera").play();
    $("camera-empty").hidden = true;
    $("capture").disabled = false;
    status("Kamera siap. Foto hanya diproses di perangkat ini.");
  } catch (e) {
    $("camera-empty").hidden = false;
    $("capture").disabled = true;
    const messages = {
      NotAllowedError:
        "Izin kamera ditolak. Izinkan kamera lewat ikon situs di browser, atau pilih foto.",
      NotFoundError:
        "Tidak ada kamera terdeteksi. Kamu masih bisa upload foto.",
      NotReadableError:
        "Kamera sedang dipakai aplikasi lain. Tutup aplikasi itu, lalu coba lagi.",
    };
    status(
      messages[e.name] ||
        "Kamera belum bisa dibuka. Coba browser lain atau upload foto.",
    );
  } finally {
    $("start-camera").disabled = false;
  }
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
function shutter() {
  if (!$("sound").checked) return;
  try {
    const ac = new (window.AudioContext || window.webkitAudioContext)(),
      osc = ac.createOscillator(),
      g = ac.createGain();
    osc.frequency.value = 850;
    g.gain.value = 0.06;
    osc.connect(g);
    g.connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + 0.07);
    osc.onended = () => ac.close();
  } catch {}
}
function snapshot() {
  const v = $("camera"),
    c = document.createElement("canvas");
  c.width = v.videoWidth;
  c.height = v.videoHeight;
  const x = c.getContext("2d");
  if ($("mirror").checked) {
    x.translate(c.width, 0);
    x.scale(-1, 1);
  }
  x.drawImage(v, 0, 0);
  return imageFrom(c.toDataURL("image/jpeg", 0.92));
}
function imageFrom(url) {
  return new Promise((resolve, reject) => {
    const im = new Image();
    im.onload = () => resolve(im);
    im.onerror = reject;
    im.src = url;
  });
}
function lock(on) {
  busy = on;
  for (const id of [
    "capture",
    "upload",
    "shots",
    "delay",
    "switch-camera",
    "start-camera",
    "reset",
  ])
    $(id).disabled = on;
  $("capture").disabled = on || !stream;
  $("cancel").hidden = !on;
  document.querySelectorAll(".thumb button").forEach((b) => (b.disabled = on));
  render();
}
async function capture() {
  if (busy || !stream || !$("camera").videoWidth) return;
  if (
    retake < 0 &&
    photos.length &&
    !confirm("Sesi baru akan mengganti foto yang belum diunduh. Lanjut?")
  )
    return;
  cancelled = false;
  const old = [...photos],
    index = retake;
  retake = -1;
  const count = index >= 0 ? 1 : Number($("shots").value),
    fresh = [];
  lock(true);
  try {
    for (let i = 0; i < count; i++) {
      for (let n = +$("delay").value; n > 0; n--) {
        if (cancelled) break;
        $("countdown").textContent = n;
        status(`Foto ${i + 1} dari ${count}. Bersiap…`);
        await wait(1000);
      }
      if (cancelled) break;
      $("countdown").textContent = "♡";
      fresh.push(await snapshot());
      shutter();
      await wait(250);
    }
    if (!cancelled) {
      if (index >= 0) {
        photos = [...old];
        photos[index] = fresh[0];
      } else photos = fresh;
      status("Foto berhasil diambil. Silakan pilih tema, sesuaikan keterangan, dan unduh hasilnya.");
    } else status("Sesi dibatalkan. Foto sebelumnya tetap ada.");
  } catch {
    status("Pengambilan foto gagal. Foto sebelumnya tetap ada.");
  } finally {
    $("countdown").textContent = "";
    lock(false);
    thumbs();
    render();
  }
}
function thumbs() {
  $("thumbnails").replaceChildren();
  photos.forEach((im, i) => {
    const el = document.createElement("div");
    el.className = "thumb";
    const img = document.createElement("img");
    img.src = im.src;
    img.alt = `Foto ${i + 1}`;
    const b = document.createElement("button");
    b.textContent = `Ulang foto ${i + 1}`;
    b.onclick = async () => {
      if (!stream) {
        status("Aktifkan kamera dulu untuk mengulang satu foto.");
        return;
      }
      retake = i;
      await capture();
    };
    el.append(img, b);
    $("thumbnails").append(el);
  });
}
async function upload(e) {
  if (busy) return;
  const files = [...e.target.files];
  if (!files.length) return;
  if (
    files.length > 4 ||
    files.some(
      (f) =>
        f.size > 15 * 1024 * 1024 ||
        !["image/jpeg", "image/png", "image/webp"].includes(f.type),
    )
  ) {
    status(
      "Pilih maksimal 4 foto JPG, PNG atau WebP, masing-masing maksimal 15 MB.",
    );
    e.target.value = "";
    return;
  }
  if (photos.length && !confirm("Ganti foto sesi saat ini dengan pilihanmu?")) {
    e.target.value = "";
    return;
  }
  lock(true);
  try {
    const next = [];
    for (const file of files) {
      const url = URL.createObjectURL(file);
      try {
        const source = await imageFrom(url),
          c = document.createElement("canvas");
        const scale = Math.min(1, 1600 / Math.max(source.width, source.height));
        c.width = Math.round(source.width * scale);
        c.height = Math.round(source.height * scale);
        c.getContext("2d").drawImage(source, 0, 0, c.width, c.height);
        next.push(await imageFrom(c.toDataURL("image/jpeg", 0.92)));
      } finally {
        URL.revokeObjectURL(url);
      }
    }
    photos = next;
    $("shots").value = photos.length === 3 ? "3" : "4";
    if (photos.length !== 4) $("layout").value = "strip";
    status(`${photos.length} foto siap diedit. Tidak diunggah ke server.`);
    thumbs();
  } catch {
    status("File foto tidak dapat dibaca. Coba foto lain.");
  } finally {
    lock(false);
    e.target.value = "";
    render();
  }
}
function output(story = false) {
  render();
  if (!story) return $("result");
  const c = document.createElement("canvas");
  c.width = 1080;
  c.height = 1920;
  const x = c.getContext("2d");
  x.fillStyle = $("frame").value;
  x.fillRect(0, 0, c.width, c.height);
  const src = $("result"),
    scale = Math.min(900 / src.width, 1720 / src.height);
  x.drawImage(
    src,
    (1080 - src.width * scale) / 2,
    (1920 - src.height * scale) / 2,
    src.width * scale,
    src.height * scale,
  );
  return c;
}
function download(story = false) {
  if (!photos.length) return;
  output(story).toBlob((blob) => {
    if (!blob) {
      status("Ekspor gagal. Coba lagi.");
      return;
    }
    const u = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = u;
    a.download = `melania-booth${story ? "-story" : ""}.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(u), 5000);
    status("Hasil PNG siap diunduh. Simpan sebelum menutup halaman.");
  }, "image/png");
}
$("start-camera").onclick = startCamera;
$("switch-camera").onclick = () => {
  facing = facing === "user" ? "environment" : "user";
  startCamera();
};
$("capture").onclick = capture;
$("cancel").onclick = () => {
  cancelled = true;
};
$("upload").onchange = upload;
$("fullscreen").onclick = async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.querySelector(".viewfinder").requestFullscreen();
  } catch {
    status(
      "Fullscreen tidak didukung di browser ini. Kamera tetap bisa digunakan.",
    );
  }
};
for (const id of [
  "theme",
  "layout",
  "caption",
  "date",
  "frame",
  "sticker",
  "filter",
  "light",
  "shots",
  "mirror",
]) {
  const el = $(id);
  el.addEventListener(
    "focus",
    () => (el.dataset.previous = JSON.stringify(options())),
  );
  el.addEventListener("change", () => {
    if (el.dataset.previous) {
      history.push(JSON.parse(el.dataset.previous));
      future = [];
      delete el.dataset.previous;
    }
    if (id === "theme") $("frame").value = themes[+$("theme").value].bg;
    if (id === "shots" && +$("shots").value !== 4) $("layout").value = "strip";
    render();
  });
  if (["caption", "light"].includes(id)) el.addEventListener("input", render);
}
$("undo").onclick = () => {
  if (history.length) {
    future.push(options());
    restore(history.pop());
  }
};
$("redo").onclick = () => {
  if (future.length) {
    history.push(options());
    restore(future.pop());
  }
};
$("download").onclick = () => download();
$("story").onclick = () => download(true);
$("share").onclick = async () => {
  const blob = await new Promise((r) => output().toBlob(r, "image/png"));
  if (!blob) return;
  const file = new File([blob], "melania-booth.png", { type: "image/png" });
  try {
    if (navigator.canShare?.({ files: [file] }))
      await navigator.share({ files: [file], title: "Melania Booth" });
    else {
      status(
        "Berbagi file tidak didukung di browser ini. Mengunduh PNG sebagai gantinya.",
      );
      download();
    }
  } catch (e) {
    if (e.name !== "AbortError")
      status("Belum bisa berbagi. Gunakan tombol unduh PNG.");
  }
};
$("reset").onclick = () => {
  if (
    photos.length &&
    !confirm("Hapus foto sesi ini? Unduh dulu jika ingin menyimpannya.")
  )
    return;
  photos = [];
  thumbs();
  render();
  status("Sesi kosong. Siap untuk momen berikutnya.");
};
themes.forEach((t, i) => {
  const op = document.createElement("option");
  op.value = i;
  op.textContent = t.name;
  $("theme").append(op);
  const button = document.createElement("button");
  button.className = "theme-card";
  button.setAttribute("aria-pressed", String(i === 0));
  const canvas = document.createElement("canvas");
  draw(
    canvas,
    [],
    {
      theme: i,
      layout: "strip",
      frame: t.bg,
      caption: t.name,
      date: false,
      sticker: "heart",
    },
    true,
  );
  const label = document.createElement("span");
  label.textContent = t.name;
  button.append(canvas, label);
  button.onclick = () => {
    remember();
    $("theme").value = i;
    $("frame").value = t.bg;
    render();
  };
  $("theme-gallery").append(button);
});
draw(
  $("hero-strip"),
  [],
  {
    theme: 0,
    frame: themes[0].bg,
    caption: "momen kecil, kenangan manis",
    date: false,
    sticker: "heart",
  },
  true,
);
render();
window.addEventListener("pagehide", () => {
  stream?.getTracks().forEach((t) => t.stop());
});
