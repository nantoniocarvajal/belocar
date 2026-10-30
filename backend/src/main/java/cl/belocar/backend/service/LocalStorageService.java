package cl.belocar.backend.service;

import cl.belocar.backend.config.BelocarProperties;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class LocalStorageService implements StorageService {

    private final Path baseDir;
    private final String publicBaseUrl;

    public LocalStorageService(BelocarProperties properties) {
        this.baseDir = Path.of(properties.storage().localDir());
        this.publicBaseUrl = properties.storage().publicBaseUrl();
        try {
            Files.createDirectories(baseDir);
        } catch (IOException ex) {
            throw new UncheckedIOException("No se pudo crear el directorio de almacenamiento local", ex);
        }
    }

    @Override
    public String store(MultipartFile file) {
        String extension = extractExtension(file.getOriginalFilename());
        String filename = UUID.randomUUID() + extension;
        Path target = baseDir.resolve(filename);

        try {
            file.transferTo(target);
        } catch (IOException ex) {
            throw new UncheckedIOException("No se pudo guardar el archivo subido", ex);
        }

        return publicBaseUrl + "/" + filename;
    }

    private String extractExtension(String originalFilename) {
        if (originalFilename == null || !originalFilename.contains(".")) {
            return "";
        }
        return originalFilename.substring(originalFilename.lastIndexOf('.'));
    }
}
