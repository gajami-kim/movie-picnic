package www.project.repository;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface FollowMapper {

    int getFollowInfo(@Param("myEmail") String myEmail, @Param("email") String email);

    boolean followUser(String email, String followEmail);

    boolean unfollowUser(String email, String followEmail);
}
