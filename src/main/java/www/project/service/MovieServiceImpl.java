package www.project.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import www.project.domain.CommentListDTO;
import www.project.domain.CommentVO;
import www.project.domain.StarVO;
import www.project.repository.StarMapper;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MovieServiceImpl implements MovieService {

    private final StarMapper starMapper;

    @Override
    public int ratingMovie(StarVO svo) {
        StarVO alreadyStar = starMapper.getAlreadyStar(svo);
        int isOk = 0;
        if(alreadyStar==null){
            isOk = starMapper.insertRate(svo);
        }else{
            isOk = starMapper.updateRate(svo);
        }
        return isOk;
    }

    @Override
    public int commentMovie(CommentVO cvo) {
        CommentVO alreadyComment = starMapper.getAlreadyComment(cvo);
        int isOk = 0;
        if(alreadyComment==null){
            isOk = starMapper.insertComment(cvo);
        }else{
            isOk = starMapper.updateComment(cvo);
        }
        return isOk;
    }

    @Override
    public StarVO getIsRating(StarVO svo) {
        return starMapper.getAlreadyStar(svo);
    }

    @Override
    public List<CommentListDTO> getCommentList(long mediaId) {
        return starMapper.getCommentList(mediaId);
    }

    @Override
    public int deleteComment(String commentCode) {
        return starMapper.deleteComment(commentCode);
    }

    @Override
    public int updateComment(CommentVO cvo) {
        return starMapper.updateComment(cvo);
    }

    @Override
    public int updateLike(CommentVO cvo) {
        if (starMapper.islike(cvo)) {
            return 1;
        }
        int insertResult = starMapper.insertLike(cvo);
        log.info("insertResult >> {}",insertResult);
        if (insertResult == 1) {
            int updateResult = starMapper.updateCommentCount(cvo);
            log.info("updateResult >> {}",updateResult);
            if (updateResult > 1) {
                return 1;
            }
        }
        return 1;
    }



    @Override
    public List<CommentVO> getCode(String email) {
        return starMapper.getCode(email);
    }

    @Override
    public int deleteCommentLike(CommentVO commentVO) {
        int isOk = starMapper.deleteCommentLike(commentVO);
        log.info("isOk >> {}",isOk);
        if(isOk==1) {
            int isUp = starMapper.updateCommentCount(commentVO);
            if (isUp > 1) {
                return 1;
            }
        }
        return 0;
    }

    @Override
    public int deleteRating(StarVO svo) {
        return starMapper.deleteRating(svo);
    }
}
