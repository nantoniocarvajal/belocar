package cl.belocar.backend.service;

import org.springframework.web.multipart.MultipartFile;

/**
 * Abstracción de almacenamiento de archivos. La implementación por defecto guarda en disco local;
 * para producción se puede reemplazar por una implementación que use Cloudinary, S3 u otro proveedor
 * sin tocar el resto de la aplicación.
 */
public interface StorageService {

    /**
     * Guarda el archivo recibido y retorna la URL pública desde la que se puede servir.
     */
    String store(MultipartFile file);
}
