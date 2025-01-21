package www.project.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import www.project.domain.StarFollowVO;
import www.project.repository.StarFollowMapper;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class StarFollowServiceImpl implements StarFollowService {

    private final StarFollowMapper starFollowMapper;
    @Override
    public int followStar(StarFollowVO sfvo) {
        int isOk = -1;
        if(sfvo.getType().equals("crew")){
            isOk = starFollowMapper.followCrew(sfvo.getCrewId(), sfvo.getEmail());
        }else{
            isOk =  starFollowMapper.followActor(sfvo.getEmail(),sfvo.getActorId());
        }
        return isOk;
    }

    @Transactional
    @Override
    public int getFollowInfo(String currentId, long personId) {
        int isOk = 0;
        isOk += starFollowMapper.getCrewFollowInfo(currentId, personId);
        isOk += starFollowMapper.getActorFollowInfo(currentId, personId);
        return isOk;
    }

    @Override
    public int unfollowStar(StarFollowVO sfvo) {
        int isOk = -1;
        if(sfvo.getType().equals("crew")){
            isOk = starFollowMapper.unFollowCrew(sfvo.getCrewId(), sfvo.getEmail());
        }else{
            isOk =  starFollowMapper.unFollowActor(sfvo.getEmail(),sfvo.getActorId());
        }
        return isOk;
    }

    @Override
    public List<StarFollowVO> getAllFollow(String currentId) {
        return starFollowMapper.getAllFollow(currentId);
    }
}
