package cl.belocar.backend.service;

import cl.belocar.backend.domain.SiteConfig;
import cl.belocar.backend.dto.SiteConfigDto;
import cl.belocar.backend.dto.SiteConfigRequest;
import cl.belocar.backend.exception.ResourceNotFoundException;
import cl.belocar.backend.repository.SiteConfigRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class SiteConfigService {

    private static final Long CONFIG_ID = 1L;

    private final SiteConfigRepository siteConfigRepository;

    public SiteConfigService(SiteConfigRepository siteConfigRepository) {
        this.siteConfigRepository = siteConfigRepository;
    }

    public SiteConfigDto get() {
        return toDto(getEntity());
    }

    @Transactional
    public SiteConfigDto update(SiteConfigRequest request) {
        SiteConfig config = getEntity();
        config.setWhatsappNumber(request.whatsappNumber());
        config.setContactEmail(request.contactEmail());
        config.setContactPhone(request.contactPhone());
        config.setContactAddress(request.contactAddress());
        config.setDispatchInfo(request.dispatchInfo());
        config.setPickupInfo(request.pickupInfo());
        return toDto(siteConfigRepository.save(config));
    }

    private SiteConfig getEntity() {
        return siteConfigRepository.findById(CONFIG_ID)
                .orElseThrow(() -> new ResourceNotFoundException("Configuración del sitio no inicializada"));
    }

    private SiteConfigDto toDto(SiteConfig config) {
        return new SiteConfigDto(
                config.getWhatsappNumber(),
                config.getContactEmail(),
                config.getContactPhone(),
                config.getContactAddress(),
                config.getDispatchInfo(),
                config.getPickupInfo());
    }
}
