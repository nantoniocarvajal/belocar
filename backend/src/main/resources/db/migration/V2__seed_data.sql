-- Datos de demostración (ficticios). No representan el inventario real de Distribuidora Belocar.

INSERT INTO categories (id, name, slug, created_at, updated_at) VALUES
    (1, 'Tintos', 'tintos', NOW(), NOW()),
    (2, 'Blancos', 'blancos', NOW(), NOW()),
    (3, 'Espumantes', 'espumantes', NOW(), NOW()),
    (4, 'Rosados', 'rosados', NOW(), NOW());

INSERT INTO products (
    id, name, slug, brand, category_id, varietal, short_description, full_description,
    format, units_per_box, main_image_url, featured, published, display_order, created_at, updated_at
) VALUES
    (1, 'Tinto Reserva Cabernet Sauvignon', 'tinto-reserva-cabernet-sauvignon', 'Viña Terrual', 1,
     'Cabernet Sauvignon',
     'Tinto reserva de cuerpo firme y taninos suaves.',
     'Vino tinto reserva elaborado con uvas Cabernet Sauvignon seleccionadas del Valle Central. Cuerpo firme, taninos suaves y notas a frutos rojos maduros. Ideal para acompañar carnes rojas y comidas de celebración. Producto de demostración.',
     '750 ml', 12, '/demo/products/tinto-1.svg', TRUE, TRUE, 1, NOW(), NOW()),

    (2, 'Tinto Gran Reserva Carmenere', 'tinto-gran-reserva-carmenere', 'Bodega Cantabria del Maule', 1,
     'Carmenere',
     'Gran reserva con notas especiadas, el varietal insignia de Chile.',
     'Gran reserva de Carmenere, el varietal insignia de la vitivinicultura chilena. Notas especiadas y a pimienta negra, con paso por barrica que aporta complejidad y estructura. Producto de demostración.',
     '750 ml', 12, '/demo/products/tinto-2.svg', TRUE, TRUE, 2, NOW(), NOW()),

    (3, 'Tinto Merlot Varietal', 'tinto-merlot-varietal', 'Viña Rocablanca', 1,
     'Merlot',
     'Merlot fresco y afrutado, fácil de tomar.',
     'Merlot varietal de perfil fresco y afrutado, con taninos redondos. Fácil de beber y muy versátil en maridajes. Producto de demostración.',
     '750 ml', 12, '/demo/products/tinto-3.svg', FALSE, TRUE, 3, NOW(), NOW()),

    (4, 'Tinto Pinot Noir Reserva', 'tinto-pinot-noir-reserva', 'Casa Nogal', 1,
     'Pinot Noir',
     'Pinot Noir elegante, de cuerpo ligero y aromas florales.',
     'Reserva de Pinot Noir de cuerpo ligero y elegante, con aromas florales y a frutos rojos. Producto de demostración.',
     '750 ml', 12, '/demo/products/tinto-4.svg', FALSE, TRUE, 4, NOW(), NOW()),

    (5, 'Blanco Sauvignon Blanc', 'blanco-sauvignon-blanc', 'Casa Nogal', 2,
     'Sauvignon Blanc',
     'Blanco fresco y cítrico, ideal para el verano.',
     'Sauvignon Blanc fresco, con notas cítricas y herbáceas. Acidez viva, ideal para mariscos y días calurosos. Producto de demostración.',
     '750 ml', 12, '/demo/products/blanco-1.svg', TRUE, TRUE, 5, NOW(), NOW()),

    (6, 'Blanco Chardonnay Reserva', 'blanco-chardonnay-reserva', 'Viña Puerto Azul', 2,
     'Chardonnay',
     'Chardonnay reserva con paso sutil por barrica.',
     'Chardonnay reserva de perfil untuoso, con notas a frutas tropicales y un sutil paso por barrica. Producto de demostración.',
     '750 ml', 12, '/demo/products/blanco-2.svg', FALSE, TRUE, 6, NOW(), NOW()),

    (7, 'Blanco Viognier Edición Limitada', 'blanco-viognier-edicion-limitada', 'Bodega Cantabria del Maule', 2,
     'Viognier',
     'Edición limitada de Viognier, aromática y floral.',
     'Edición limitada de Viognier, muy aromática, con notas florales y a durazno. Producción reducida. Producto de demostración.',
     '750 ml', 6, '/demo/products/blanco-3.svg', FALSE, FALSE, 7, NOW(), NOW()),

    (8, 'Espumante Brut Nature', 'espumante-brut-nature', 'Bodega Alto Sereno', 3,
     NULL,
     'Espumante brut nature, seco y elegante.',
     'Espumante brut nature elaborado con método tradicional. Burbuja fina y persistente, perfil seco y elegante. Producto de demostración.',
     '750 ml', 6, '/demo/products/espumante-1.svg', TRUE, TRUE, 8, NOW(), NOW()),

    (9, 'Espumante Rosé', 'espumante-rose', 'Viña Terrual', 3,
     'Pinot Noir',
     'Espumante rosé fresco, con notas a frutos rojos.',
     'Espumante rosé elaborado a base de Pinot Noir. Fresco, con notas a frutos rojos y burbuja delicada. Producto de demostración.',
     '750 ml', 6, '/demo/products/espumante-2.svg', FALSE, TRUE, 9, NOW(), NOW()),

    (10, 'Rosado Merlot Rosé', 'rosado-merlot-rose', 'Viña Rocablanca', 4,
     'Merlot',
     'Rosado ligero y afrutado, perfecto para el verano.',
     'Rosado de Merlot, ligero y afrutado, con un final fresco. Perfecto para el verano y comidas informales. Producto de demostración.',
     '750 ml', 12, '/demo/products/rosado-1.svg', FALSE, TRUE, 10, NOW(), NOW());

INSERT INTO site_config (
    id, whatsapp_number, contact_email, contact_phone, contact_address, dispatch_info, pickup_info, updated_at
) VALUES (
    1,
    '56900000000',
    'contacto@belocar.cl',
    '56900000000',
    'Dirección pendiente de confirmar',
    'Contamos con zonas de despacho gratuito y otras zonas donde el valor del transporte se cotiza según la comuna. Este texto es provisional y se edita desde el panel de administración.',
    'También puedes retirar tu pedido coordinando día y horario por WhatsApp. Este texto es provisional y se edita desde el panel de administración.',
    NOW()
);
