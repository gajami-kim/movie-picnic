package www.project.domain;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class StarFollowVO {
    private String email;
    private long crewId;
    private long actorId;
    private String type;
}
