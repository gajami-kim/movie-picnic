package www.project.repository;

import org.apache.ibatis.annotations.Mapper;
import www.project.domain.CommentListDTO;
import www.project.domain.CommentVO;
import www.project.domain.StarVO;

import java.util.List;

@Mapper
public interface StarMapper {

    List<StarVO> getList(String currentId);
    
    // 별점 전용
    int updateRate(StarVO svo); // 이미 별을 줬다면 업데이트로

    int insertRate(StarVO svo); // 만약 별을 안줬다면 인서트로

    StarVO getAlreadyStar(StarVO svo); // 이미 별을 줬는지 확인

    
    // 코멘트 전용
    List<CommentListDTO> getCommentList(long mediaId);

    CommentVO getAlreadyComment(CommentVO cvo);
    
    int insertComment(CommentVO cvo);

    int updateComment(CommentVO cvo);

    int deleteComment(String commentCode);

    int insertLike(CommentVO cvo);

    int updateCommentCount(CommentVO cvo);

    List<CommentVO> getCode(String email);

    int deleteCommentLike(CommentVO commentVO);

    boolean islike(CommentVO cvo);

    int deleteRating(StarVO svo);
}
