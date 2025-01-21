package www.project.repository;

import org.apache.ibatis.annotations.Mapper;
import www.project.domain.WishVO;

import java.util.List;

@Mapper
public interface wishMapper {

    int addWish(WishVO wvo);

    boolean checkWish(String currentId, long mediaId);

    int deleteWish(WishVO wvo);

    List<WishVO> getList(String myEmail);

    int getHeartCount(String mediaType, long mediaId);
}
