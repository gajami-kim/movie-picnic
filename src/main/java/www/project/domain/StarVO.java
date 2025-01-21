package www.project.domain;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class StarVO {
    private long cno; // 별을 봅는 숫자
    private String email; // 유저아이디
    private float rate; // 별점
    private long mediaId; // 무비아이디
    private String date; // 별점 준 시간
}
