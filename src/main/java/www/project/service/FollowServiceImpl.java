package www.project.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import www.project.repository.FollowMapper;

@Service
@RequiredArgsConstructor
@Slf4j
public class FollowServiceImpl implements FollowService{

    private final FollowMapper followMapper;

    @Override
    public Boolean getFollowInfo(String myEmail, String email) {
        return followMapper.getFollowInfo(myEmail, email) > 0;
    }

    @Override
    public boolean followUser(String email, String followEmail) {
        return followMapper.followUser(email, followEmail);
    }

    @Override
    public boolean unfollowUser(String email, String followEmail) {
        return followMapper.unfollowUser(email, followEmail);
    }
}
