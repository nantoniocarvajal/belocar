package cl.belocar.backend.web;

import cl.belocar.backend.dto.SiteConfigDto;
import cl.belocar.backend.dto.SiteConfigRequest;
import cl.belocar.backend.service.SiteConfigService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/config")
public class AdminSiteConfigController {

    private final SiteConfigService siteConfigService;

    public AdminSiteConfigController(SiteConfigService siteConfigService) {
        this.siteConfigService = siteConfigService;
    }

    @GetMapping
    public SiteConfigDto get() {
        return siteConfigService.get();
    }

    @PutMapping
    public SiteConfigDto update(@Valid @RequestBody SiteConfigRequest request) {
        return siteConfigService.update(request);
    }
}
