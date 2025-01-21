package www.project.repository;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import www.project.domain.AuthVO;
import www.project.domain.UserFollowVO;
import www.project.domain.UserVO;

import java.util.List;
import java.util.Map;

@Mapper
public interface UserMapper {
    int joinUser(UserVO uvo);

    int duplicationNick(String nickName);

    UserVO findEmail(String nick);

    void insertAuth(String email);

    UserVO checkEmail(String email);

    List<AuthVO> selectAuth(String email);

    int duplicationEmail(String email);

    int findUserPw(@Param("nick") String nick, @Param("email") String email);

    void updatePw(@Param("email")String email, @Param("pw")String newPw);

    UserVO searchUser(String providerId);

    void insertSocialUser(UserVO newUser);

    UserVO getInfo(String currentId);

    int updateProfile(UserVO user);

    int isNicknameDuplicate(String nickname);

    int updateNickName(String oldNickname, String newNickname);

    Map<String, Long> getCounts(String currentId);

    List<String> getAllImagePaths();

    int setDefaultImage(String currentId);

    int withdrawUser(String loginId);

    List<UserFollowVO> getFollowerList(String currentId);

    List<UserFollowVO> getFollowingList(String currentId);
}
