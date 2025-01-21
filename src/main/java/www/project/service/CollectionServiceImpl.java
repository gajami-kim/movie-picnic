package www.project.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import www.project.domain.CollectionDTO;
import www.project.repository.MyCollectionMapper;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CollectionServiceImpl implements CollectionService {

    private final MyCollectionMapper myCollectionMapper;

    @Override
    public List<CollectionDTO> getList(String currentId) {
        return myCollectionMapper.getList(currentId);
    }

    @Override
    public int newList(CollectionDTO collectionDTO) {
        return myCollectionMapper.newList(collectionDTO);
    }

    @Override
    public int addContent(String collectionId, long mediaId) {
        return myCollectionMapper.addList(collectionId,mediaId);
    }
}
