package cl.belocar.backend.service;

import cl.belocar.backend.dto.LoginRequest;
import cl.belocar.backend.dto.LoginResponse;
import cl.belocar.backend.exception.TooManyAttemptsException;
import cl.belocar.backend.security.JwtService;
import cl.belocar.backend.security.LoginAttemptService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final LoginAttemptService loginAttemptService;

    public AuthService(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            LoginAttemptService loginAttemptService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.loginAttemptService = loginAttemptService;
    }

    public LoginResponse login(LoginRequest request, String clientKey) {
        if (loginAttemptService.isBlocked(clientKey)) {
            throw new TooManyAttemptsException(
                    "Demasiados intentos fallidos. Intenta de nuevo en unos minutos.");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.username(), request.password()));
        } catch (BadCredentialsException ex) {
            loginAttemptService.recordFailure(clientKey);
            throw ex;
        }

        loginAttemptService.recordSuccess(clientKey);
        String token = jwtService.generateToken(request.username());
        return new LoginResponse(token, request.username(), jwtService.extractExpiration(token));
    }
}
