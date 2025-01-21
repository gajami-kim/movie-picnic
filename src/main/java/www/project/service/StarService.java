package www.project.service;

import www.project.domain.StarVO;

import java.util.List;

public interface StarService {
    List<StarVO> getList(String currentId);
}
