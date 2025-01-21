package www.project.config.oauth2.provider;

public interface OAuth2UserInfo {
    String getProvider();
    String getProviderId();
    String getEmail();
    String getName();
    String getProfile();
}
