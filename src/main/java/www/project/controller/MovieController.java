package www.project.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import www.project.domain.CommentListDTO;
import www.project.domain.CommentVO;
import www.project.domain.StarVO;
import www.project.service.MovieService;
import www.project.service.wishService;

import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/movie/*")
@RequiredArgsConstructor
@Slf4j
public class MovieController {

    private final MovieService movieService;
    private final wishService wsv;

    //디테일 매핑
    @GetMapping("/detail")
    public void goDetail(){}

    @GetMapping("/person")
    public void personDetail(){}


    @ResponseBody
    @GetMapping("/isLikeBtn/{email}")
    public List<Integer> getCommentCode(@PathVariable String email){
        List<CommentVO> code = movieService.getCode(email);
        List<Integer> commentCodes = code.stream()
                .map(CommentVO::getCommentCode)
                .collect(Collectors.toList());
        log.info("getCommentCode >> {}",commentCodes);
        return commentCodes;
    }

    @ResponseBody
    @DeleteMapping("/deleteCommentLike")
    public int deleteCommentLike(@RequestBody CommentVO commentVO){
        int isOk = movieService.deleteCommentLike(commentVO);
        return isOk;
    }

    @ResponseBody
    @PostMapping("/ratingMovie")
    public int rating(@RequestBody StarVO svo){
        int isOk = movieService.ratingMovie(svo);
        return isOk;
    }

    @ResponseBody
    @DeleteMapping("/deleteRating")
    public int deleteRating(@RequestBody StarVO svo){
        int isOk = movieService.deleteRating(svo);
        return isOk;
    }

    @ResponseBody
    @PostMapping("/comment")
    public int comment(@RequestBody CommentVO cvo){
        int isOk = movieService.commentMovie(cvo);
        return isOk;
    }

    @ResponseBody
    @PostMapping("/addCommentLike")
    public int addCommentLike(@RequestBody CommentVO cvo){
        log.info("cvo이메일 >>{}",cvo.getEmail());
        log.info("cvo코드 >>{}",cvo.getCommentCode());
        int isOk = movieService.updateLike(cvo);
        return  isOk;
    }

    @ResponseBody
    @DeleteMapping("/deleteComment/{commentCode}")
    public int deleteComment(@PathVariable String commentCode){
        log.info("commentCode >>{} ",commentCode);
        int isOk = movieService.deleteComment(commentCode);
        return isOk;
    }

    @ResponseBody
    @PutMapping
    public int updateComment(@RequestBody CommentVO cvo){
        log.info("commentCode >>{} ",cvo.getCommentCode());
        int isOk = movieService.updateComment(cvo);
        return isOk;
    }

    @ResponseBody
    @PostMapping("/isRating")
    public StarVO isRating(@RequestBody StarVO svo){
        StarVO user = movieService.getIsRating(svo);
        log.info("user >> {}",user);
        return user;
    }

    @ResponseBody
    @GetMapping("/getCommentList/{mediaId}")
    public List<CommentListDTO> getCommentList(@PathVariable("mediaId") long mediaId) {
        log.info("mediaId: {}", mediaId);
        List<CommentListDTO> comments = movieService.getCommentList(mediaId);
        log.info("comments >> {}",comments);
        return comments;
    }

    @GetMapping("/searchResult")
    public void searchResultPage(){

    }
    @GetMapping("/heartCount/")
    @ResponseBody
    public int getHeartCount(@RequestParam String mediaType, @RequestParam long mediaId) {
        return wsv.getHeartCount(mediaType,mediaId);
    }
}
