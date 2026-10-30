package cl.belocar.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final BelocarProperties properties;

    public WebConfig(BelocarProperties properties) {
        this.properties = properties;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String publicPattern = properties.storage().publicBaseUrl() + "/**";
        String localDir = properties.storage().localDir();
        registry.addResourceHandler(publicPattern)
                .addResourceLocations("file:" + localDir + "/");
    }
}
