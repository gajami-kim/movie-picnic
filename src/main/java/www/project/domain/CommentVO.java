package www.project.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CommentVO {

    private int commentCode;
    private long mediaId;
    private String content;
    private int spoiler;
    private String email;
    private long count;
    private String regDate;

}
