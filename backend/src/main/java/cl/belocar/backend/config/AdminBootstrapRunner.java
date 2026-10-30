package cl.belocar.backend.config;

import cl.belocar.backend.domain.AdminUser;
import cl.belocar.backend.repository.AdminUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Crea el usuario administrador por defecto en el primer arranque si la tabla admin_users está vacía.
 * Pensado solo para bootstrap inicial: cambia la contraseña desde el panel o la base de datos apenas
 * tengas acceso, y no dependas de las credenciales por defecto en producción.
 */
@Component
public class AdminBootstrapRunner implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminBootstrapRunner.class);

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final BelocarProperties properties;

    public AdminBootstrapRunner(
            AdminUserRepository adminUserRepository,
            PasswordEncoder passwordEncoder,
            BelocarProperties properties) {
        this.adminUserRepository = adminUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.properties = properties;
    }

    @Override
    public void run(String... args) {
        if (adminUserRepository.count() > 0) {
            return;
        }

        String username = properties.admin().defaultUsername();
        String password = properties.admin().defaultPassword();

        AdminUser adminUser = AdminUser.builder()
                .username(username)
                .passwordHash(passwordEncoder.encode(password))
                .build();
        adminUserRepository.save(adminUser);

        log.warn("Usuario administrador por defecto creado ('{}'). "
                + "Cambia la contraseña cuanto antes: no uses las credenciales por defecto en producción.", username);
    }
}
