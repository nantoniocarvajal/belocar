CREATE TABLE quotes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(150) NOT NULL,
    client_type VARCHAR(20) NOT NULL,
    company_name VARCHAR(150),
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(150),
    commune VARCHAR(100) NOT NULL,
    fulfillment_mode VARCHAR(20) NOT NULL,
    notes TEXT,
    total_boxes INT NOT NULL,
    created_at TIMESTAMP NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_quotes_created_at ON quotes (created_at);

-- product_id se guarda sin llave foranea: es solo referencia informativa.
-- Si el producto se edita o elimina despues, la cotizacion conserva los datos
-- (nombre, marca, formato) tal como se mostraron al cliente en su momento.
CREATE TABLE quote_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quote_id BIGINT NOT NULL,
    product_id BIGINT,
    product_name VARCHAR(180) NOT NULL,
    product_brand VARCHAR(120) NOT NULL,
    format VARCHAR(80) NOT NULL,
    units_per_box INT NOT NULL,
    boxes INT NOT NULL,
    CONSTRAINT fk_quote_items_quote FOREIGN KEY (quote_id) REFERENCES quotes (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
