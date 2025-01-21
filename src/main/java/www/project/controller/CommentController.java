package www.project.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import www.project.domain.CommentVO;
import www.project.service.CommentService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
public class CommentController {

    private final CommentService csv;

    @GetMapping("/api/comments/random")
    public List<CommentVO> getRandomCommentList(@RequestParam(value = "limit", defaultValue = "3") int limit) {
        log.info("Fetching random comments with limit: {}", limit);
        return csv.getRandomComments(limit);
    }
}
