package www.project.service;

import org.springframework.web.multipart.MultipartFile;
import www.project.domain.UserFollowVO;
import www.project.domain.UserVO;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface UserService {
    void joinUser(UserVO uvo);

    int duplicationNick(String nickName);

    UserVO findEmail(String nick);

    int duplicationEmail(String email);

    int findUserPw(String nick, String email);

    UserVO getInfo(String currentId);

    int updateProfile(UserVO userVO);

    boolean isNicknameDuplicate(String nickname);

    int updateNickName(String oldNickname, String newNickname);

    Map<String, Long> getCounts(String currentId);

    int setDefaultImage(String currentId);

    int withdrawUser(String loginId);

    List<UserFollowVO> getFollowerList(String currentId);

    List<UserFollowVO> getFollowingList(String currentId);
}
