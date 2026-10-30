package cl.belocar.backend.security;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class LoginAttemptServiceTest {

    @Test
    void isNotBlockedBeforeAnyFailure() {
        LoginAttemptService service = new LoginAttemptService();
        assertThat(service.isBlocked("1.2.3.4")).isFalse();
    }

    @Test
    void blocksAfterReachingMaxAttempts() {
        LoginAttemptService service = new LoginAttemptService();
        String ip = "1.2.3.4";

        for (int i = 0; i < 5; i++) {
            service.recordFailure(ip);
        }

        assertThat(service.isBlocked(ip)).isTrue();
    }

    @Test
    void doesNotBlockBelowMaxAttempts() {
        LoginAttemptService service = new LoginAttemptService();
        String ip = "1.2.3.4";

        for (int i = 0; i < 4; i++) {
            service.recordFailure(ip);
        }

        assertThat(service.isBlocked(ip)).isFalse();
    }

    @Test
    void successResetsFailureCount() {
        LoginAttemptService service = new LoginAttemptService();
        String ip = "1.2.3.4";

        for (int i = 0; i < 4; i++) {
            service.recordFailure(ip);
        }
        service.recordSuccess(ip);

        assertThat(service.isBlocked(ip)).isFalse();

        for (int i = 0; i < 4; i++) {
            service.recordFailure(ip);
        }
        assertThat(service.isBlocked(ip)).isFalse();
    }

    @Test
    void tracksDifferentKeysIndependently() {
        LoginAttemptService service = new LoginAttemptService();

        for (int i = 0; i < 5; i++) {
            service.recordFailure("1.1.1.1");
        }

        assertThat(service.isBlocked("1.1.1.1")).isTrue();
        assertThat(service.isBlocked("2.2.2.2")).isFalse();
    }
}
