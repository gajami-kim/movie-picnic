package www.project.config.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Slf4j
public class CustomAuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        Cookie[] cookies = request.getCookies();
        String returnUrl = null;
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                log.info("cookie getName : " + cookie.getName());
                if (cookie.getName().equals("url")) {
                    returnUrl = cookie.getValue().split("@")[0];
                    log.info("return Url : {}", returnUrl);
                    break;
                }
            }
        }

        if (returnUrl != null && !returnUrl.isEmpty()) {
            getRedirectStrategy().sendRedirect(request, response, returnUrl);
            return;
        }

        super.onAuthenticationSuccess(request, response, authentication);
    }
}
