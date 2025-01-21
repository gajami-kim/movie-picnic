package www.project.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import www.project.domain.WishVO;
import www.project.repository.wishMapper;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class wishServiceImpl implements wishService{

    private final wishMapper wishMapper;


    @Override
    public int addWish(WishVO wvo) {
        return wishMapper.addWish(wvo);
    }

    @Override
    public int deleteWish(WishVO wvo) {
        return wishMapper.deleteWish(wvo);
    }

    @Override
    public List<WishVO> getList(String myEmail) {
        return wishMapper.getList(myEmail);
    }

    @Override
    public int getHeartCount(String mediaType, long mediaId) {
        return wishMapper.getHeartCount(mediaType,mediaId);
    }

    @Override
    public boolean checkWish(String currentId, long mediaId) {
        return wishMapper.checkWish(currentId, mediaId);
    }

}
