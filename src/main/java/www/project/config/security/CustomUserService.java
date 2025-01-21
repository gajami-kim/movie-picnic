package www.project.config.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import www.project.config.oauth2.PrincipalDetails;
import www.project.domain.UserVO;
import www.project.repository.UserMapper;

@Slf4j
public class CustomUserService implements UserDetailsService {
    @Autowired
    private UserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserVO uvo = userMapper.checkEmail(email);
        uvo.setAuthList(userMapper.selectAuth(email));
        if(uvo!=null){
            return new PrincipalDetails(uvo);
        }
        return (UserDetails) new AuthUser(uvo);
    }
}
