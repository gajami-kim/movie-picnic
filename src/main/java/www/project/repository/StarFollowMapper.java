package www.project.repository;

import org.apache.ibatis.annotations.Mapper;
import www.project.domain.StarFollowVO;

import java.util.List;

@Mapper
public interface StarFollowMapper {

    int followCrew(long crewId, String email);

    int followActor(String email, long actorId);

    int getCrewFollowInfo(String currentId, long personId);

    int getActorFollowInfo(String currentId, long personId);

    int unFollowCrew(long crewId, String email);

    int unFollowActor(String email, long actorId);

    List<StarFollowVO> getAllFollow(String currentId);
}
