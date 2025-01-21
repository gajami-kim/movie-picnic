package www.project.service;

import www.project.domain.CommentListDTO;
import www.project.domain.CommentVO;
import www.project.domain.StarVO;

import java.util.List;

public interface MovieService {

    int ratingMovie(StarVO svo);

    int commentMovie(CommentVO cvo);

    StarVO getIsRating(StarVO svo);

    List<CommentListDTO> getCommentList(long mediaId);

    int deleteComment(String commentCode);

    int updateComment(CommentVO cvo);

    int updateLike(CommentVO cvo);

    List<CommentVO> getCode(String email);

    int deleteCommentLike(CommentVO commentVO);

    int deleteRating(StarVO svo);
}
