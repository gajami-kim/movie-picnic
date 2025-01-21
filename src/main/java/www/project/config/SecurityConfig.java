package www.project.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import www.project.config.oauth2.PrincipalOauth2UserService;
import www.project.config.security.CustomAuthenticationFailureHandler;
import www.project.config.security.CustomAuthenticationSuccessHandler;
import www.project.config.security.CustomUserService;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final AuthenticationSuccessHandler OAuth2AuthenticationSuccessHandler;
    private final PrincipalOauth2UserService PrincipalOauth2UserService;
    private final CustomAuthenticationSuccessHandler customAuthenticationSuccessHandler;
    private final CustomAuthenticationFailureHandler customAuthenticationFailureHandler;

    @Bean
    PasswordEncoder passwordEncoder(){return PasswordEncoderFactories.createDelegatingPasswordEncoder();}

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(request -> request
                        .requestMatchers("/**")
                        .permitAll()
                        .anyRequest().authenticated()
                )
                .formLogin(login -> login
                        .usernameParameter("email")
                        .passwordParameter("pw")
                        .loginProcessingUrl("/user/login")
                        .successHandler(customAuthenticationSuccessHandler)
                        .failureHandler(customAuthenticationFailureHandler)
                        .permitAll()
                )
                .oauth2Login(oauth2->oauth2
                        .loginPage("/user/login")
                        .successHandler(OAuth2AuthenticationSuccessHandler)
                        .userInfoEndpoint(userInfo->userInfo
                                .userService(PrincipalOauth2UserService))
                )
                .logout(logout -> logout
                        .logoutUrl("/user/logout")
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                        .logoutSuccessUrl("/")
                );
        return http.build();
    }

    @Bean
    UserDetailsService userDetailsService(){return new CustomUserService();}

}
