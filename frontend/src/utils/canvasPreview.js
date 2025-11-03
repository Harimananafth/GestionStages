/**
 * Utilitaire pour dessiner l'image recadrée sur un canvas.
 * (Basé sur la documentation de react-image-crop)
 * * Le problème venait de la logique de translation/centrage incorrecte.
 * On doit simplement dessiner la partie recadrée de l'image (source)
 * vers la zone entière du canvas (destination).
 */
export async function canvasPreview(image, canvas, crop) {
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  // 1. Calculer les facteurs d'échelle pour passer des dimensions affichées
  //    (image.width/height) aux dimensions naturelles (image.naturalWidth/height)
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const pixelRatio = window.devicePixelRatio || 1;

  // 2. Définir la taille du canvas (destination)
  //    La taille du canvas doit correspondre à la taille de la zone recadrée en pixels naturels
  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  // 3. Appliquer le ratio de pixels pour les écrans Retina
  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = "high";

  // 4. Définir la zone source à découper dans l'image originale (en pixels naturels)
  const sourceX = crop.x * scaleX;
  const sourceY = crop.y * scaleY;
  const sourceWidth = crop.width * scaleX;
  const sourceHeight = crop.height * scaleY;

  // 5. Définir la zone de destination sur le canvas (en pixels du canvas)
  const destX = 0;
  const destY = 0;
  // Les dimensions de destination doivent être ajustées par le pixelRatio
  const destWidth = canvas.width / pixelRatio;
  const destHeight = canvas.height / pixelRatio;

  ctx.clearRect(0, 0, canvas.width, canvas.height); // Nettoyage de sécurité

  // CORRECTION : Utiliser drawImage(source, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    destX,
    destY,
    destWidth,
    destHeight
  );

  // Pas besoin de ctx.save() / ctx.restore() ni de translations complexes pour un simple crop
}
