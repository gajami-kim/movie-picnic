package www.project.service;

import www.project.domain.CommentVO;

import java.util.List;

public interface CommentService {

    List<CommentVO> getRandomComments(int limit);
}
