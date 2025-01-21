package www.project.repository;

import org.apache.ibatis.annotations.Mapper;
import www.project.domain.CommentVO;

import java.util.List;

@Mapper
public interface CommentMapper {

    List<CommentVO> getRandomComments(int limit);
}
