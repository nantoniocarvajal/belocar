-- Reemplaza el placeholder ilustrado y la descripción genérica por foto real y notas de cata
-- oficiales para los productos de las líneas Kolinas y Aves del Sur donde el usuario proporcionó
-- material de marca (presentaciones PDF en Escritorio/BELOCAR). El resto del catálogo sigue con
-- placeholder hasta contar con material similar.

UPDATE products SET
    main_image_url = '/products/real/kolinas-cabernet-sauvignon.jpeg'
WHERE slug = 'kolinas-cabernet-varietal';

UPDATE products SET
    main_image_url = '/products/real/kolinas-carmenere.jpeg'
WHERE slug = 'kolinas-carmenere-varietal';

UPDATE products SET
    main_image_url = '/products/real/asu-gran-reserva-carmenere.png',
    short_description = 'Color rojo rubí con tintes violáceos; cereza ácida, ciruela negra y toques tostados, con taninos maduros y final elegante.',
    full_description = 'De concentrado color rojo rubí con tintes violáceos. Despliega en la nariz aromas de cereza ácida y ciruela negra, con toques tostados. Estructura aterciopelada y taninos maduros, que sostienen las notas de frutos negros y chocolate amargo. Elegante y persistente final. Vendido exclusivamente por caja de 6 unidades de 750 ml.'
WHERE slug = 'aves-del-sur-gran-reserva-carmenere';

UPDATE products SET
    main_image_url = '/products/real/asu-gran-reserva-cabernet.png',
    short_description = 'Intensos aromas a casis y frutos negros, boca estructurada con taninos sabrosos y acentos de toffee y chocolate.',
    full_description = 'Limpio en nariz, con intensos aromas a casis y frutos negros característicos de la variedad. Boca estructurada, con taninos sabrosos y una fresca expresión de fruta roja madura subrayada por acentos de toffee y chocolate. Excelente equilibrio, con final intenso, largo y persistente. Vendido exclusivamente por caja de 6 unidades de 750 ml.'
WHERE slug = 'aves-del-sur-cabernet-gran-reserva';

UPDATE products SET
    main_image_url = '/products/real/asu-low-calories-cabernet.png',
    short_description = 'Rojo rubí, con aromas de cereza, mora y grosella; envolvente en boca, bajo en alcohol y calorías.',
    full_description = 'Cabernet Sauvignon de color rojo rubí, con intensos aromas de cereza, mora y grosella. En boca es envolvente, con taninos bien integrados y notas de frutos rojos, chocolate y café. De final elegante, es bajo en alcohol y calorías, manteniendo carácter y equilibrio. Vendido exclusivamente por caja de 6 unidades de 750 ml.'
WHERE slug = 'aves-del-sur-cabernet-low-calories';

UPDATE products SET
    main_image_url = '/products/real/asu-low-calories-sauvignon-blanc.png',
    short_description = 'Amarillo pálido, aromas cítricos y notas herbáceas; fresco y equilibrado, bajo en alcohol y calorías.',
    full_description = 'Sauvignon Blanc de color amarillo pálido, con intensos aromas cítricos y delicadas notas herbáceas. En boca es fresco y equilibrado, con una acidez vibrante y un final ágil. Bajo en alcohol y calorías, es una alternativa ligera y fácil de disfrutar, sin perder expresión ni carácter. Vendido exclusivamente por caja de 6 unidades de 750 ml.'
WHERE slug = 'aves-del-sur-sauvignon-blanc-low-calories';

UPDATE products SET
    main_image_url = '/products/real/asu-low-calories-rose.png',
    short_description = 'Rosa pálido, aromas de cereza, frambuesa y pétalos de rosa; fresco, ligero y bajo en alcohol y calorías.',
    full_description = 'De color rosa pálido, este rosé presenta intensos aromas de cereza, frambuesa y pétalos de rosa. En boca ofrece abundante fruta fresca, con notas tropicales, mandarina y lima, acompañadas de una acidez equilibrada y un final prolongado. Bajo en alcohol y calorías, es una opción fresca, ligera y muy fácil de disfrutar. Vendido exclusivamente por caja de 6 unidades de 750 ml.'
WHERE slug = 'aves-del-sur-rose-low-calories';

UPDATE products SET
    main_image_url = '/products/real/asu-fruit-splash-mango.png',
    short_description = 'Sabores de mango maduro y tropical en un vino blanco suave y vibrante, ideal bien frío.',
    full_description = 'Sabores de mango maduro y tropical en un vino blanco suave y vibrante. Mango Fruit Splash aporta una dulce distracción a tus momentos del día. Vendido exclusivamente por caja de 6 unidades de 750 ml.'
WHERE slug = 'aves-del-sur-frutal-mango';

UPDATE products SET
    main_image_url = '/products/real/asu-fruit-splash-pina.png',
    short_description = 'Notas tropicales de piña en un vino blanco fresco y vibrante, dulce y refrescante.',
    full_description = 'Notas tropicales de piña en un vino blanco fresco y vibrante. Pineapple Fruit Splash es una dulce y refrescante explosión de sol en cada copa. Vendido exclusivamente por caja de 6 unidades de 750 ml.'
WHERE slug = 'aves-del-sur-frutal-pina';

UPDATE products SET
    main_image_url = '/products/real/asu-fruit-splash-cranberries.png',
    short_description = 'Notas vivas y expresivas de cranberry en un vino blanco ligero y alegre.',
    full_description = 'Notas vivas y expresivas de cranberry en un vino blanco ligero y alegre. Cranberry Fruit Splash es un sorbo dulce y refrescante, ideal para cualquier día soleado. Vendido exclusivamente por caja de 6 unidades de 750 ml.'
WHERE slug = 'aves-del-sur-frutal-cranberries';

UPDATE products SET
    main_image_url = '/products/real/asu-fruit-splash-durazno.png',
    short_description = 'Aromas suaves y deliciosos de durazno en un vino blanco delicadamente dulce.',
    full_description = 'Aromas suaves y deliciosos en un vino blanco delicadamente dulce. Peach Fruit Splash es el acompañamiento perfecto para relajarse y desconectar. Vendido exclusivamente por caja de 6 unidades de 750 ml.'
WHERE slug = 'aves-del-sur-frutal-durazno';
