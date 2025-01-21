package www.project.domain;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CommentListDTO {

    private long commentCode; // 댓글 번호
    private String email; // 아이디
    private String nickname; // 닉네임
    private long mediaId; // 영화 번호
    private String content; // 댓글
    private int spoiler; // 스포일러 여부
    private long count; // 좋아요 수
    private String regDate; // 댓글 작성 날짜
    private int isDel; // 유저 삭제 여부
}
