package cl.belocar.backend.web;

import cl.belocar.backend.service.StorageService;
import java.util.Map;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/uploads")
public class AdminUploadController {

    private final StorageService storageService;

    public AdminUploadController(StorageService storageService) {
        this.storageService = storageService;
    }

    @PostMapping
    public Map<String, String> upload(@RequestParam("file") MultipartFile file) {
        String url = storageService.store(file);
        return Map.of("url", url);
    }
}
