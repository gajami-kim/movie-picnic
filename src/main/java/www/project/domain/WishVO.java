package www.project.domain;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class WishVO {
    private long mediaId;
    private String mediaType;
    private String email;
}
