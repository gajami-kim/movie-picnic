package www.project.config.oauth2;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import www.project.config.oauth2.provider.GoogleUserInfo;
import www.project.config.oauth2.provider.KakaoUserInfo;
import www.project.config.oauth2.provider.NaverUserInfo;
import www.project.config.oauth2.provider.OAuth2UserInfo;
import www.project.domain.UserVO;
import www.project.handler.FileHandler;
import www.project.repository.UserMapper;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

@Service
@RequiredArgsConstructor
@Slf4j
public class PrincipalOauth2UserService extends DefaultOAuth2UserService {

    private final UserMapper userMapper;
    private final FileHandler fileHandler;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        log.info("userRequest: {}", userRequest.getClientRegistration());
        OAuth2User oAuth2User = super.loadUser(userRequest);
        log.info("getAttributes >>> {}",oAuth2User.getAttributes());
        OAuth2UserInfo oAuth2UserInfo = null;
        String provider = userRequest.getClientRegistration().getRegistrationId();
        if(provider.equalsIgnoreCase("google")) {
            oAuth2UserInfo = new GoogleUserInfo(oAuth2User.getAttributes());
        } else if(provider.equals("naver")){
            oAuth2UserInfo = new NaverUserInfo(oAuth2User.getAttributes());
        } else if(provider.equals("kakao")){
            oAuth2UserInfo = new KakaoUserInfo(oAuth2User.getAttributes());
        }

        provider = oAuth2UserInfo.getProvider();
        String providerId = oAuth2UserInfo.getProviderId();
        String email = oAuth2UserInfo.getEmail();
        String nickName = oAuth2UserInfo.getName();
        //프로필 이미지 저장용
        String profile = oAuth2UserInfo.getProfile();
        UserVO originUser = userMapper.searchUser(providerId);
        if(originUser == null) {
            log.info("첫 로그인");
            UserVO newUser = new UserVO();
            newUser.setEmail("("+provider+")"+email);
            newUser.setProvider(provider);
            newUser.setProviderId(providerId);
            newUser.setNickname(nickName);
            //카카오랑 네이버는 실명이라서 닉네임 안받음
            if(provider.equals("naver")||provider.equals("kakao")){newUser.setNickname(nickName+"_user");}
            try {
                if(profile.contains("img_profile")||profile.contains("default_profile")){
                    log.info("기본프로필 - 네이버 카카오");
                } else {
                    String filePath = fileHandler.downloadImg(profile, provider);
                    newUser.setProfile(filePath);
                }
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
            userMapper.insertSocialUser(newUser);
            userMapper.insertAuth(newUser.getEmail());
            return new PrincipalDetails(newUser, oAuth2User.getAttributes());
        } else {
            log.info("이미 있는 유저");
            return new PrincipalDetails(originUser, oAuth2User.getAttributes());
        }
    }
}