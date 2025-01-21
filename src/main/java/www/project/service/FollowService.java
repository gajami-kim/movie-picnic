package www.project.service;

public interface FollowService {
    Boolean getFollowInfo(String myEmail, String email);

    boolean followUser(String email, String followEmail);

    boolean unfollowUser(String email, String followEmail);
}
