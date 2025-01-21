package www.project.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import www.project.domain.UserFollowVO;
import www.project.domain.UserVO;
import www.project.repository.UserMapper;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{
    private final UserMapper usermapper;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    public void joinUser(UserVO uvo) {
        int isOk = usermapper.joinUser(uvo);
        if(isOk == 1){
            usermapper.insertAuth(uvo.getEmail());
        }
    }

    @Override
    public int duplicationNick(String nickName) {
        return usermapper.duplicationNick(nickName);
    }

    @Override
    public int duplicationEmail(String email) { return usermapper.duplicationEmail(email); }

    @Override
    public int findUserPw(String nick, String email) {
        return usermapper.findUserPw(nick,email);
    }

    @Override
    public UserVO getInfo(String currentId) {
        return usermapper.getInfo(currentId);
    }

    @Override
    public UserVO findEmail(String nick) {
        return usermapper.findEmail(nick);
    }


    @Override
    public int updateProfile(UserVO uvo) {
        return usermapper.updateProfile(uvo);
    }

    @Override
    public boolean isNicknameDuplicate(String nickname) {
        return usermapper.isNicknameDuplicate(nickname) > 0;
    }

    @Override
    public int updateNickName(String oldNickname, String newNickname) {
        return usermapper.updateNickName(oldNickname, newNickname);
    }

    @Override
    public Map<String, Long> getCounts(String currentId) {
        return usermapper.getCounts(currentId);
    }

    @Override
    public int setDefaultImage(String currentId) {
        return usermapper.setDefaultImage(currentId);
    }

    @Override
    public int withdrawUser(String loginId) {
        return usermapper.withdrawUser(loginId);
    }

    @Override
    public List<UserFollowVO> getFollowerList(String currentId) {
        return usermapper.getFollowerList(currentId);
    }

    @Override
    public List<UserFollowVO> getFollowingList(String currentId) {
        return usermapper.getFollowingList(currentId);
    }
}
