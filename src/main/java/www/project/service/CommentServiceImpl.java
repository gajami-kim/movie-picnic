package www.project.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import www.project.domain.CommentVO;
import www.project.repository.CommentMapper;

import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentMapper commentMapper;

    @Override
    public List<CommentVO> getRandomComments(int limit) {
        return commentMapper.getRandomComments(limit);
    }
}
