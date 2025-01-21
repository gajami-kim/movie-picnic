package www.project.config.oauth2.provider;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Map;

@AllArgsConstructor
@Slf4j
public class NaverUserInfo implements OAuth2UserInfo{

    private Map<String,Object> attributes;

    @Override
    public String getProvider() {return "naver";}

    @Override
    public String getProviderId() {return (String)((Map) attributes.get("response")).get("id");}

    @Override
    public String getEmail() {return (String)((Map) attributes.get("response")).get("email");}

    @Override
    public String getName() {return (String)((Map) attributes.get("response")).get("name");}

    @Override
    public String getProfile() {return (String)((Map)attributes.get("response")).get("profile_image");}
}
