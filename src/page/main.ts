import { defaultImageSettings, defaultSettings, Image, Settings } from "../js/defaults.ts";

const el = {
  form: document.getElementById("form") as HTMLFormElement,
  formToggle: document.getElementById("formToggle") as HTMLElement,
  color: document.querySelector('input[name="color"]') as HTMLInputElement,
  colorHex: document.getElementById("colorHex") as HTMLElement,
  imageSettings: document.getElementById("imageSettings") as HTMLElement,
  imageChoose: document.getElementById("imageChoose") as HTMLElement,
  imageData: document.querySelector('input[name="imageData"]') as HTMLInputElement,
  imageSize: document.querySelector('input[name="imageSize"]') as HTMLInputElement,
  imageOpacity: document.querySelector('input[name="imageOpacity"]') as HTMLInputElement,
  imageHue: document.querySelector('input[name="imageHue"]') as HTMLInputElement,
  imageGrayscale: document.querySelector('input[name="imageGrayscale"]') as HTMLInputElement,
  imageBlur: document.querySelector('input[name="imageBlur"]') as HTMLInputElement,
  imageRemove: document.getElementById("imageRemove") as HTMLButtonElement,
  imageOverlay: document.getElementById("imageOverlay") as HTMLElement,
  shortcutLink: document.getElementById("shortcutLink") as HTMLLinkElement,
  tabShortcut: document.getElementById("tabShortcut") as HTMLElement,
  tabProtectPinned: document.querySelector('input[name="tabProtectPinned"]') as HTMLInputElement,
  tabProtectGroups: document.querySelector('input[name="tabProtectGroups"]') as HTMLInputElement,
  reset: document.getElementById("reset") as HTMLButtonElement,
};

let started = false;
let colorChanged = false;
let imageData: string = "";
let imageChanged = false;

function App() {
  function saveSettings() {
    const settings = structuredClone(defaultSettings);
    const data = new FormData(el.form);

    settings.color = colorChanged ? String(data.get("color")) : "";
    settings.image.data = imageData;
    settings.image.style = String(data.get("imageStyle"));
    settings.image.size = String(data.get("imageSize"));
    settings.image.opacity = String(data.get("imageOpacity"));
    settings.image.hue = String(data.get("imageHue"));
    settings.image.grayscale = String(data.get("imageGrayscale"));
    settings.image.blur = String(data.get("imageBlur"));
    settings.tab.protectPinned = el.tabProtectPinned.checked;
    settings.tab.protectGroups = el.tabProtectGroups.checked;

    chrome.storage.local.set({ settings });
  }

  function setColor(color: string = "") {
    if (!color || !colorChanged) {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) el.color.value = "#16191e";
      else el.color.value = "#e4e6e6";
      colorChanged = false;
    }
    document.documentElement.style.backgroundColor = colorChanged ? color : "";
    if (colorChanged) el.colorHex.innerText = color;
    else el.colorHex.innerText = chrome.i18n.getMessage("bgColorChoose");
  }

  function toggleImageSettings() {
    if (!imageData) {
      el.imageSettings.classList.add("hidden");
      el.imageChoose.classList.remove("hidden");
      el.imageData.disabled = false;
      el.imageRemove.classList.add("hidden");
    } else {
      el.imageSettings.classList.remove("hidden");
      el.imageChoose.classList.add("hidden");
      el.imageData.disabled = true;
      el.imageRemove.classList.remove("hidden");
    }
  }

  function setImageData(image: Blob | false) {
    if (image === false) {
      imageData = "";
      imageChanged = false;
    }
    toggleImageSettings();

    // Use existing image.
    if (!started && imageData) {
      el.imageOverlay.style.backgroundImage = `url("${imageData}")`;
    }
    // Remove existing image.
    else if ((!image || image.size === 0) && !imageChanged && !imageData) {
      el.imageOverlay.style.backgroundImage = "";
      el.imageData.value = "";
    }
    // Set new image.
    else if (image && imageChanged) {
      imageChanged = false;
      if (image.size === 0) return;
      if (image.size > 8000000) {
        alert(chrome.i18n.getMessage("bgImageTooLarge"));
        return;
      }

      // Base64 encode the image.
      const reader = new FileReader();
      reader.onloadend = () => {
        imageData = String(reader.result);
        el.imageOverlay.style.backgroundImage = `url("${imageData}")`;
        saveSettings();
        toggleImageSettings();
      };
      reader.readAsDataURL(image);
    }
  }

  function setImageStyle(props: Image = structuredClone(defaultImageSettings)) {
    if (props.style === "cover") {
      el.imageSize.disabled = true;
      el.imageOverlay.style.backgroundSize = props.style;
    } else {
      el.imageSize.disabled = false;
      el.imageOverlay.style.backgroundSize = `${props.size}%`;
    }
    el.imageOverlay.style.backgroundRepeat = props.style === "repeat" ? "repeat" : "";
    el.imageOverlay.style.opacity = `${props.opacity}%`;

    const styles = [];
    if (props.hue) styles.push(`hue-rotate(${props.hue}deg)`);
    if (props.grayscale) styles.push(`grayscale(${props.grayscale})`);
    if (props.blur) styles.push(`blur(${props.blur}px)`);

    el.imageOverlay.style.filter = styles.length ? styles.join(" ") : "";
    el.imageSize.value = props.size;
    el.imageOpacity.value = props.opacity;
    el.imageHue.value = props.hue;
    el.imageGrayscale.value = props.grayscale;
    el.imageBlur.value = props.blur;

    document.querySelectorAll<HTMLInputElement>('input[name="style"]').forEach((input) => {
      input.checked = input.value === props.style;
    });
  }

  function updateSettings(this: HTMLInputElement | void) {
    const data = new FormData(el.form);

    if (this?.name === "color") colorChanged = true;
    if (this?.name === "imageData") imageChanged = true;
    if (!data.get("style")) data.set("style", "center");

    setColor(String(data.get("color")));
    setImageData(data.get("imageData") as Blob);
    setImageStyle({
      data: imageData,
      style: String(data.get("imageStyle")),
      size: String(el.imageSize.value),
      opacity: String(data.get("imageOpacity")),
      hue: String(data.get("imageHue")),
      grayscale: String(data.get("imageGrayscale")),
      blur: String(data.get("imageBlur")),
    });

    // Helps prevent excessive style resetting.
    started = true;
  }

  document.querySelectorAll<HTMLFormElement>("input, select").forEach((input) => {
    input.addEventListener("input", updateSettings);
    // Colors are saved on input to workaround the default value limitation.
    if (input.name === "color") input.addEventListener("input", saveSettings);
    // Image are saved when encoding has finished.
    if (input.name !== "image") input.addEventListener("change", saveSettings);
  });

  // Shows current Close Tab shortcut combination.
  chrome.commands.getAll().then((result) => {
    const command = result.filter((a) => a.name === "close-tab");
    if (!command.length || !command[0].shortcut) return;
    el.tabShortcut.classList.add("text-primary");
    el.tabShortcut.innerText = command[0].shortcut.split("").join(" ");
  });

  // Reset the default background color or image settings.
  function resetSettings(type: string | null = null) {
    if (type === "color") setColor();
    else if (type === "image") {
      setImageData(false);
      setImageStyle();
    }
    saveSettings();
  }

  el.imageRemove.addEventListener("click", () => {
    if (window.confirm(chrome.i18n.getMessage("bgImageRemoveConfirm"))) resetSettings("image");
  });
  el.reset.addEventListener("click", () => {
    if (window.confirm(chrome.i18n.getMessage("bgColorResetConfirm"))) resetSettings("color");
  });

  // Set initial settings.
  updateSettings();
}

// Load the settings before initializing the app.
chrome.storage.local.get(["settings"]).then((result) => {
  if (result.settings) {
    let { settings } = result as { settings: Settings };
    settings = { ...defaultSettings, ...settings };

    colorChanged = !!settings.color;
    imageData = settings.image.data;

    if (settings.color) el.color.value = settings.color;
    el.imageSize.value = settings.image.size;
    el.imageOpacity.value = settings.image.opacity;
    el.imageHue.value = settings.image.hue;
    el.imageGrayscale.value = settings.image.grayscale;
    el.imageBlur.value = settings.image.blur;
    el.tabProtectPinned.checked = settings.tab.protectPinned;
    el.tabProtectGroups.checked = settings.tab.protectGroups;

    const style = document.querySelector<HTMLInputElement>(`input[name="imageStyle"][value="${settings.image.style}"]`);
    if (style) style.checked = true;
  }
  App();
});

// Open extension shortcuts page in a new tab.
el.shortcutLink.addEventListener("click", () => {
  chrome.tabs.create({ url: "chrome://extensions/shortcuts" });
});
