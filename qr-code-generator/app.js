// "use strict";

const lightBtn = document.querySelector(".light");
const darkBtn = document.querySelector(".dark");
const sizeSelector = document.querySelector(".size");
const shareBtn = document.querySelector(".share");
const downloadBtn = document.querySelector(".download");

const urlEl = document.querySelector(".qrcode__value");
const qrcodeEl = document.querySelector(".qrcode");

let colorLight = "#fff",
  colorDark = "#000",
  text = "https://mrgeex.com",
  size = 300;

[lightBtn, darkBtn].forEach((element) =>
  element.addEventListener("input", getColor),
);
sizeSelector.addEventListener("change", getSize);
urlEl.addEventListener("input", getURL);
shareBtn.addEventListener("click", handleShare);

function getURL(event) {
  text = event.target.value;
  if (!text) text = "https://mrgeex.com";
  downloadBtn.href = text;
  renderQrCode();
  console.log(text);
}

function getColor(event) {
  const color = event.target.value;
  if (event.target.classList.contains("light")) colorLight = color;
  if (event.target.classList.contains("dark")) colorDark = color;
  renderQrCode();
}

function getSize(event) {
  size = event.target.value;
  qrcodeEl.style.width = size + "px";

  renderQrCode();
  console.log(size);
}

async function handleShare() {
  setTimeout(async () => {
    try {
      const base64url = await resolveDataUrl();
      const blob = await (await fetch(base64url)).blob();
      const file = new File([blob], "QRCode.png", {
        type: blob.type,
      });
      await navigator.share({
        files: [file],
        title: text,
      });
    } catch (error) {
      alert("Your browser doesn't support sharing.");
    }
  }, 100);
}

async function generateQrCode() {
  qrcodeEl.innerHTML = "";
  new QRCode(qrcodeEl, {
    text,
    height: size,
    width: size,
    colorLight,
    colorDark,
  });
  downloadBtn.href = await resolveDataUrl();
}

function resolveDataUrl() {
  return new Promise((resolve, _) => {
    setTimeout(() => {
      const img = document.querySelector(".qrcode img");
      if (img.currentSrc) {
        resolve(img.currentSrc);
        return;
      }

      const canvas = document.createElement("canvas");
      resolve(canvas.toDataURL());
    }, 50);
  });
}

function timeout() {
  let id;
  const promise = new Promise((_, reject) => {
    id = setTimeout(() => {
      qrcodeEl.innerHTML = "Error: network timeout!";
      reject(new Error("timeout"));
    }, 2000);
  });
  promise.timerID = id;
  return promise;
}

async function renderQrCode() {
  try {
    const timeoutPromise = timeout();
    await Promise.race([generateQrCode(), timeoutPromise]);
    clearTimeout(timeoutPromise.timerID);
  } catch (error) {
    console.error(error);
  }
}
renderQrCode();
