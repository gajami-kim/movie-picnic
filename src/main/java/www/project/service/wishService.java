package www.project.service;

import www.project.domain.WishVO;

import java.util.List;

public interface wishService {
    int addWish(WishVO wvo);

    boolean checkWish(String currentId, long mediaId);

    int deleteWish(WishVO wvo);

    List<WishVO> getList(String myEmail);

    int getHeartCount(String mediaType, long mediaId);
}
