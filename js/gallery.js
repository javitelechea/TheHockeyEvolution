(() => {
  const FOLDER_URL =
    "https://drive.google.com/drive/folders/1nj_XfFgsui3swYb8S31uUWMSkWCw6qqd";

  /* IDs públicos de la carpeta de Drive (compartida). */
  const PHOTO_IDS = [
    "1auEDF0TCTSqQ7k5_Rya2rynWx_Y_87xB",
    "1sgiAOwial_njd-lv5SneuWm1rDPuoJ1b",
    "1l4jG_ermaP5kaa0ms6g-wg4ZpK4GDF05",
    "1euCyWr_CFVY3yeaakNFTVT3HtKeSG15o",
    "192__S45J8N1N2YlBm-emI2L90M3KX-3f",
    "1bn2LHoQ1WS7Sxfud10Rvuv6vS6r93iGH",
    "14-WMsStdqnelUcnBLsfkUWgzLvY8P5qf",
    "1Z8IG92JYR6y4XVwBJwsOGgsqPKNjw43z",
    "1M8eSh8VPYAq3EEE9hTLpw_390OByyFMb",
    "1Us3HiT7_W7aRlB2fTHb9VHFZBvgadneI",
    "1LfolftpuPiKp_Aa7RfNMSH6LVhanUNGi",
    "1pks8vSt90OP4EfbpM3PexRvE6oZIgUcC",
    "1RKZlBQZsBHuY9FpUD3Eh0Kl2A1_GhuF0",
    "1PWvvzPazzz16cWU0DXp86_QsHZEovzIQ",
    "1WLf3HBgssUOgTroEBs0w1t1d47Q_QlAr",
    "1ZgtOAHQ0u_Vi1w30lyztYx--ElGn4en9",
    "1uYRfKSBTmiA0eYJi1pHkdrpa0lRjHVNZ",
    "1awMPMyJND8KS5GwA5hs5Tnkg43_wZbMQ",
    "1hNN1myj7VSwWf-Ml_0sZln4CneUyjhrB",
    "1VHHhtfdPgAqT_xv7MV7c97KDyGGOZ6e_",
    "19N56n_yQPDwJKRIA_wMQF1qadlixRZoJ",
    "1okQFRbWPPQLH5YDPSKgz4WEqn6X45wGh",
    "1WDyep0H6yXZsXeQSTqqOZq-5aaEvea7y",
    "1rwbOpPhabQfONQhX61eRM8WNU4RBkV2o",
    "1siccUB1GudqhYTauehz575rPohZqjmcj",
    "16jX23jgQFH6MR1wqCo39Qk_ao2iqcW4J",
    "1i1IUWHWPL6sa71G-IeT6pyQApXRwdrCp",
    "14Cvr_JNInITxjZSaNFDzufQNuJtAbNDO",
    "1IgaNS4SN2xqKwf3j_UihclhAkD8SX6OW",
    "1_AG6--d3B0EtvjDdIE-vvwU6iPZoQGDX",
    "1Zzhyhp7NU_RWYSwCiH0WU83q__1n35qw",
    "1CcQOiFQvqJtTN3aeT13CJlhKzXVkLRni",
    "1VlcFpfW5DwEfPZj34eUXG1EEzO0sl1ED",
    "1rDYelI6jvFvJ_azO0lFn1F-O9prb86qC",
    "1Cohbk3uXiCdMWkPbUIXjIyPjL4dKkTBX",
    "1cyA69wngCuHXlGHKTayEPMKgqBBcJh93",
    "1BMZ-S8kw9cRTGnjDxiR4Mwf8Ha_K5njS",
    "1Y_BNEM2XxdbCpYW4JvAjjkOt3eqalAqB",
    "1kQNei9RXbt0eYMpvheVi9Qw7GHKpBASW",
    "1eDRERtWx6BYUso938ziBA6at5wcIgFGk",
    "1sxiRm_wav1ISHbnBYLzLHmtB-er6vMLv",
    "1QD0dnk9_03bEVXw0QJcPRpqU9CQ-eTTF",
    "1MJY4IN73mky1cRj1xnAUr9P_Y9WLHsG2",
    "1oOHHG2LnyYi_d0w3EDnXCPh7X0HD_moS",
    "15YA7zVyUvnkuhupJWPFBwE1wXdus8EXd",
    "1zhiZimeHDCgWyl_da1_klabZJwVc5StC",
    "1z5zQu6RifTd2xf3SIOc6Qwkt-TB8j503",
    "1ib_N1di9KjQxBVxS5VOg06PX7OczMXm_",
    "1lHni-UMwWA2_VkgvFCJTMWkE4f7GCM0M",
    "1TB8ZJaE5-OMChcSkA3Bga0OabNsC4tBR",
  ];

  const HERO_ID = "1PWvvzPazzz16cWU0DXp86_QsHZEovzIQ";

  function driveUrl(id, size) {
    return `https://lh3.googleusercontent.com/d/${id}=w${size}`;
  }

  window.CAMP_DRIVE = {
    folderUrl: FOLDER_URL,
    heroId: HERO_ID,
    photoIds: PHOTO_IDS,
    url: driveUrl,
  };

  const gallery = document.getElementById("gallery");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  if (!gallery || !lightbox || !lightboxImg) return;

  const sources = PHOTO_IDS.map((id) => ({
    id,
    thumb: driveUrl(id, 900),
    full: driveUrl(id, 2000),
    alt: "Foto del Camp Julio 2026",
  }));

  gallery.innerHTML = "";
  sources.forEach((photo, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "gallery__item";
    if (photo.id === HERO_ID || photo.id === "1ib_N1di9KjQxBVxS5VOg06PX7OczMXm_") {
      btn.classList.add("gallery__item--wide");
    } else if (photo.id === "1rDYelI6jvFvJ_azO0lFn1F-O9prb86qC") {
      btn.classList.add("gallery__item--tall");
    }
    btn.dataset.index = String(index);

    const img = document.createElement("img");
    img.src = photo.thumb;
    img.alt = photo.alt;
    img.loading = "lazy";
    img.decoding = "async";
    img.width = 900;
    img.height = 600;
    btn.appendChild(img);
    gallery.appendChild(btn);
  });

  let current = 0;
  const items = [...gallery.querySelectorAll(".gallery__item")];

  function open(index) {
    current = index;
    const photo = sources[current];
    lightboxImg.src = photo.full;
    lightboxImg.alt = photo.alt;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function close() {
    lightbox.hidden = true;
    lightboxImg.src = "";
    document.body.style.overflow = "";
  }

  function show(delta) {
    current = (current + delta + sources.length) % sources.length;
    const photo = sources[current];
    lightboxImg.src = photo.full;
    lightboxImg.alt = photo.alt;
  }

  items.forEach((item, index) => {
    item.addEventListener("click", () => open(index));
  });

  lightbox.querySelector(".lightbox__close")?.addEventListener("click", close);
  lightbox
    .querySelector(".lightbox__nav--prev")
    ?.addEventListener("click", () => show(-1));
  lightbox
    .querySelector(".lightbox__nav--next")
    ?.addEventListener("click", () => show(1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(-1);
    if (e.key === "ArrowRight") show(1);
  });
})();
