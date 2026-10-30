-- Corrige dos problemas detectados por el usuario en las fotos reales cargadas en V6:
-- 1) Las 9 fotos de Aves del Sur (Gran Reserva/Low Calories/Fruit Splash) se habían recortado con
--    fondo opaco que no calzaba con el color de la card y con texto suelto de la etiqueta rotada
--    visible en el borde. Se reemplazaron los archivos por versiones con fondo transparente y
--    recorte ajustado a la botella (mismos nombres de archivo, no requiere cambios de datos).
-- 2) Las 2 fotos de Kolinas tenían fondo negro sólido que se veía como un recuadro fuera de lugar
--    contra la card clara. Se les quitó el fondo con un modelo de segmentación (rembg/u2net), ya
--    que el vidrio oscuro de la botella se fundía con el negro y no era separable por color. Los
--    archivos nuevos son .png (con transparencia) en vez de .jpeg.

UPDATE products SET main_image_url = '/products/real/kolinas-cabernet-sauvignon.png'
WHERE slug = 'kolinas-cabernet-varietal';

UPDATE products SET main_image_url = '/products/real/kolinas-carmenere.png'
WHERE slug = 'kolinas-carmenere-varietal';
