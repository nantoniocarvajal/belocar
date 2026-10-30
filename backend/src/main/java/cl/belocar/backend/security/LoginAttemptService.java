package cl.belocar.backend.security;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

/**
 * Limite simple de intentos fallidos de login por IP, en memoria.
 * Suficiente para un backend de una sola instancia; si en el futuro se corre con
 * varias instancias en paralelo, esto habria que moverlo a un almacen compartido (ej: Redis).
 */
@Service
public class LoginAttemptService {

    private static final int MAX_ATTEMPTS = 5;
    private static final Duration WINDOW = Duration.ofMinutes(15);

    private record Attempts(int count, Instant windowStart) {
    }

    private final Map<String, Attempts> attemptsByKey = new ConcurrentHashMap<>();

    public boolean isBlocked(String key) {
        Attempts attempts = attemptsByKey.get(key);
        if (attempts == null) {
            return false;
        }
        if (windowExpired(attempts)) {
            attemptsByKey.remove(key);
            return false;
        }
        return attempts.count() >= MAX_ATTEMPTS;
    }

    public void recordFailure(String key) {
        attemptsByKey.compute(key, (k, existing) -> {
            if (existing == null || windowExpired(existing)) {
                return new Attempts(1, Instant.now());
            }
            return new Attempts(existing.count() + 1, existing.windowStart());
        });
    }

    public void recordSuccess(String key) {
        attemptsByKey.remove(key);
    }

    private boolean windowExpired(Attempts attempts) {
        return Instant.now().isAfter(attempts.windowStart().plus(WINDOW));
    }
}
