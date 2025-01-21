package www.project.service;

import www.project.domain.StarFollowVO;

import java.util.List;

public interface StarFollowService {
    int followStar(StarFollowVO sfvo);

    int getFollowInfo(String currentId, long personId);

    int unfollowStar(StarFollowVO sfvo);

    List<StarFollowVO> getAllFollow(String currentId);
}
