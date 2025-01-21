package www.project.repository;

import org.apache.ibatis.annotations.Mapper;
import www.project.domain.CollectionDTO;

import java.util.List;


@Mapper
public interface MyCollectionMapper {
    List<CollectionDTO> getList(String currentId);

    int newList(CollectionDTO collectionDTO);

    int addList(String collectionId, long mediaId);
}
