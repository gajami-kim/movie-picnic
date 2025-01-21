package www.project.domain;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CollectionDTO {
    private int cno;
    private String collectionName;
    private String email;
    private String mediaType;
    private long mediaId;
}
