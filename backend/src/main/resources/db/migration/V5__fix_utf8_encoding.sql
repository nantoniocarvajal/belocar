-- V4 se aplico con una conexion JDBC que no forzaba UTF-8 (character_set_connection quedaba en
-- latin1 aunque la tabla es utf8mb4), lo que corrompio tildes/enies al guardar. Tras corregir
-- la URL de conexion (useUnicode=true&characterEncoding=UTF-8), se vuelve a cargar el mismo
-- inventario real para que quede guardado con el encoding correcto.

DELETE FROM products;
DELETE FROM categories;

INSERT INTO categories (id, name, slug, created_at, updated_at) VALUES
    (1, 'Tintos', 'tintos', NOW(), NOW()),
    (2, 'Blancos', 'blancos', NOW(), NOW()),
    (3, 'Rosados', 'rosados', NOW(), NOW()),
    (4, 'Frutales', 'frutales', NOW(), NOW());

INSERT INTO products (
    id, name, slug, brand, category_id, varietal, short_description, full_description,
    format, units_per_box, main_image_url, featured, published, display_order, created_at, updated_at
) VALUES
    (1, 'Sauvignon Blanc', 'las-palomitas-sauvignon-blanc', 'Las Palomitas', 2,
     'Sauvignon Blanc',
     'Sauvignon Blanc fresco y de acidez viva, ideal para acompañar mariscos.',
     'Sauvignon Blanc de Las Palomitas, fresco y de acidez viva, ideal para acompañar mariscos y comidas ligeras. Vendido exclusivamente por caja de 12 unidades de 750 ml.',
     '750 ml', 12, '/demo/products/blanco-1.svg', FALSE, TRUE, 1, NOW(), NOW()),

    (2, 'White Blend', 'simetria-white-blend', 'Simetría', 2,
     NULL,
     'Blend de blancos de perfil fresco y aromático.',
     'Blend de cepas blancas de Simetría, de perfil fresco y aromático. Vendido exclusivamente por caja de 12 unidades de 750 ml.',
     '750 ml', 12, '/demo/products/blanco-2.svg', FALSE, TRUE, 2, NOW(), NOW()),

    (3, 'Gran Reserva Carmenere', 'aves-del-sur-gran-reserva-carmenere', 'Aves del Sur', 1,
     'Carmenere',
     'Carmenere de perfil especiado, el varietal insignia de Chile.',
     'Gran reserva de Carmenere de Aves del Sur, el varietal insignia de la vitivinicultura chilena, de perfil especiado y con paso por barrica. Vendido exclusivamente por caja de 6 unidades de 750 ml.',
     '750 ml', 6, '/demo/products/tinto-1.svg', FALSE, TRUE, 3, NOW(), NOW()),

    (4, 'Cabernet Low Calories', 'aves-del-sur-cabernet-low-calories', 'Aves del Sur', 1,
     'Cabernet Sauvignon',
     'Cabernet Sauvignon de línea baja en calorías.',
     'Cabernet Sauvignon de Aves del Sur, línea baja en calorías, con cuerpo firme y taninos suaves. Vendido exclusivamente por caja de 6 unidades de 750 ml.',
     '750 ml', 6, '/demo/products/tinto-2.svg', FALSE, TRUE, 4, NOW(), NOW()),

    (5, 'Sauvignon Blanc Low Calories', 'aves-del-sur-sauvignon-blanc-low-calories', 'Aves del Sur', 2,
     'Sauvignon Blanc',
     'Sauvignon Blanc de línea baja en calorías.',
     'Sauvignon Blanc de Aves del Sur, línea baja en calorías, fresco y de acidez viva. Vendido exclusivamente por caja de 6 unidades de 750 ml.',
     '750 ml', 6, '/demo/products/blanco-3.svg', FALSE, TRUE, 5, NOW(), NOW()),

    (6, 'Rosé Low Calories', 'aves-del-sur-rose-low-calories', 'Aves del Sur', 3,
     NULL,
     'Rosado ligero de línea baja en calorías.',
     'Rosado de Aves del Sur, línea baja en calorías, ligero y afrutado, ideal para el verano. Vendido exclusivamente por caja de 6 unidades de 750 ml.',
     '750 ml', 6, '/demo/products/rosado-1.svg', FALSE, TRUE, 6, NOW(), NOW()),

    (7, 'Cabernet Gran Reserva', 'aves-del-sur-cabernet-gran-reserva', 'Aves del Sur', 1,
     'Cabernet Sauvignon',
     'Cabernet Sauvignon de gran reserva, cuerpo firme y taninos marcados.',
     'Gran reserva de Cabernet Sauvignon de Aves del Sur, de cuerpo firme y taninos marcados, ideal para acompañar carnes rojas. Vendido exclusivamente por caja de 6 unidades de 750 ml.',
     '750 ml', 6, '/demo/products/tinto-3.svg', FALSE, TRUE, 7, NOW(), NOW()),

    (8, 'Merlot Rosé', 'aves-del-sur-merlot-rose', 'Aves del Sur', 3,
     'Merlot',
     'Rosado de Merlot, ligero y afrutado, perfecto para el verano.',
     'Rosado de Merlot de Aves del Sur, ligero y afrutado, con un final fresco, perfecto para el verano y comidas informales. Vendido exclusivamente por caja de 12 unidades de 750 ml.',
     '750 ml', 12, '/demo/products/rosado-1.svg', TRUE, TRUE, 8, NOW(), NOW()),

    (9, 'Cabernet Varietal', 'kolinas-cabernet-varietal', 'Kolinas', 1,
     'Cabernet Sauvignon',
     'Cabernet Sauvignon varietal, de cuerpo firme y fácil de tomar.',
     'Cabernet Sauvignon varietal de Kolinas, de cuerpo firme y taninos amables, fácil de tomar. Vendido exclusivamente por caja de 6 unidades de 750 ml.',
     '750 ml', 6, '/demo/products/tinto-4.svg', TRUE, TRUE, 9, NOW(), NOW()),

    (10, 'Carmenere Varietal', 'kolinas-carmenere-varietal', 'Kolinas', 1,
     'Carmenere',
     'Carmenere varietal, especiado y de fácil maridaje.',
     'Carmenere varietal de Kolinas, especiado y de fácil maridaje, el sello distintivo de los tintos chilenos. Vendido exclusivamente por caja de 6 unidades de 750 ml.',
     '750 ml', 6, '/demo/products/tinto-1.svg', FALSE, TRUE, 10, NOW(), NOW()),

    (11, 'Syrah Gran Reserva', 'frison-syrah-gran-reserva', 'Frisón', 1,
     'Syrah',
     'Syrah de gran reserva, cuerpo intenso y notas especiadas.',
     'Gran reserva de Syrah de Frisón, de cuerpo intenso y notas especiadas, con paso por barrica. Vendido exclusivamente por caja de 6 unidades de 750 ml.',
     '750 ml', 6, '/demo/products/tinto-2.svg', FALSE, TRUE, 11, NOW(), NOW()),

    (12, 'Cabernet Gran Reserva', 'trisquel-cabernet-gran-reserva', 'Trisquel', 1,
     'Cabernet Sauvignon',
     'Cabernet Sauvignon de gran reserva, cuerpo firme y estructurado.',
     'Gran reserva de Cabernet Sauvignon de Trisquel, de cuerpo firme y estructurado, ideal para acompañar carnes rojas y comidas de celebración. Vendido exclusivamente por caja de 6 unidades de 750 ml.',
     '750 ml', 6, '/demo/products/tinto-3.svg', FALSE, TRUE, 12, NOW(), NOW()),

    (13, 'Carmenere Reserva', 'aresti-carmenere-reserva', 'Aresti', 1,
     'Carmenere',
     'Carmenere reserva, especiado y con paso por barrica.',
     'Reserva de Carmenere de Aresti, especiado y con paso por barrica que aporta complejidad y estructura. Vendido exclusivamente por caja de 6 unidades de 750 ml.',
     '750 ml', 6, '/demo/products/tinto-4.svg', FALSE, TRUE, 13, NOW(), NOW()),

    (14, 'Frutal Mango', 'aves-del-sur-frutal-mango', 'Aves del Sur', 4,
     NULL,
     'Bebida a base de vino con sabor a mango, para disfrutar bien fría.',
     'Bebida a base de vino con sabor a mango de Aves del Sur, ideal para disfrutar bien fría. Vendido exclusivamente por caja de 6 unidades de 750 ml.',
     '750 ml', 6, '/demo/products/frutal-1.svg', TRUE, TRUE, 14, NOW(), NOW()),

    (15, 'Frutal Piña', 'aves-del-sur-frutal-pina', 'Aves del Sur', 4,
     NULL,
     'Bebida a base de vino con sabor a piña, para disfrutar bien fría.',
     'Bebida a base de vino con sabor a piña de Aves del Sur, ideal para disfrutar bien fría. Vendido exclusivamente por caja de 6 unidades de 750 ml.',
     '750 ml', 6, '/demo/products/frutal-1.svg', FALSE, TRUE, 15, NOW(), NOW()),

    (16, 'Frutal Cranberries', 'aves-del-sur-frutal-cranberries', 'Aves del Sur', 4,
     NULL,
     'Bebida a base de vino con sabor a cranberries, para disfrutar bien fría.',
     'Bebida a base de vino con sabor a cranberries de Aves del Sur, ideal para disfrutar bien fría. Vendido exclusivamente por caja de 6 unidades de 750 ml.',
     '750 ml', 6, '/demo/products/frutal-1.svg', FALSE, TRUE, 16, NOW(), NOW()),

    (17, 'Frutal Durazno', 'aves-del-sur-frutal-durazno', 'Aves del Sur', 4,
     NULL,
     'Bebida a base de vino con sabor a durazno, para disfrutar bien fría.',
     'Bebida a base de vino con sabor a durazno de Aves del Sur, ideal para disfrutar bien fría. Vendido exclusivamente por caja de 6 unidades de 750 ml.',
     '750 ml', 6, '/demo/products/frutal-1.svg', FALSE, TRUE, 17, NOW(), NOW()),

    (18, 'Chardonnay Reserva', 'la-lejania-chardonnay-reserva', 'La Lejanía', 2,
     'Chardonnay',
     'Chardonnay reserva con paso sutil por barrica.',
     'Reserva de Chardonnay de La Lejanía, de perfil untuoso con un sutil paso por barrica. Vendido exclusivamente por caja de 6 unidades de 750 ml.',
     '750 ml', 6, '/demo/products/blanco-1.svg', TRUE, TRUE, 18, NOW(), NOW()),

    (19, 'Carmenere Reserva', 'tierra-del-fuego-carmenere-reserva', 'Tierra del Fuego', 1,
     'Carmenere',
     'Carmenere reserva, especiado y de fácil maridaje.',
     'Reserva de Carmenere de Tierra del Fuego, especiado y de fácil maridaje. Vendido exclusivamente por caja de 12 unidades de 750 ml.',
     '750 ml', 12, '/demo/products/tinto-1.svg', FALSE, TRUE, 19, NOW(), NOW()),

    (20, 'Merlot Reserva', 'cremaschi-merlot-reserva', 'Cremaschi', 1,
     'Merlot',
     'Merlot reserva, taninos suaves y perfil afrutado.',
     'Reserva de Merlot de Cremaschi, de taninos suaves y perfil afrutado, fácil de beber. Vendido exclusivamente por caja de 12 unidades de 750 ml.',
     '750 ml', 12, '/demo/products/tinto-2.svg', FALSE, TRUE, 20, NOW(), NOW()),

    (21, 'Sauvignon Blanc Light', 'espiritu-de-chile-sauvignon-blanc-light', 'Espíritu de Chile', 2,
     'Sauvignon Blanc',
     'Sauvignon Blanc de línea liviana (light).',
     'Sauvignon Blanc de Espíritu de Chile, línea liviana (light), fresco y de acidez viva. Vendido exclusivamente por caja de 6 unidades de 750 ml.',
     '750 ml', 6, '/demo/products/blanco-2.svg', FALSE, TRUE, 21, NOW(), NOW()),

    (22, 'Cabernet Light', 'espiritu-de-chile-cabernet-light', 'Espíritu de Chile', 1,
     'Cabernet Sauvignon',
     'Cabernet Sauvignon de línea liviana (light).',
     'Cabernet Sauvignon de Espíritu de Chile, línea liviana (light), de cuerpo suave y fácil de tomar. Vendido exclusivamente por caja de 6 unidades de 750 ml.',
     '750 ml', 6, '/demo/products/tinto-3.svg', FALSE, TRUE, 22, NOW(), NOW());
