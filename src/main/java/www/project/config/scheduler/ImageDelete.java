package www.project.config.scheduler;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import www.project.repository.UserMapper;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
@EnableScheduling
@Slf4j
public class ImageDelete {

    @Autowired
    private UserMapper userMapper;

    private static final String BASE_DIRECTORY = "C:/image/";


    @Scheduled(cron = "0 0 23 * * *")
    public void cleanUpImages() {
        List<String> dbImagePaths = userMapper.getAllImagePaths();

        List<String> dbFileNames = dbImagePaths.stream()
                .map(path -> path.substring(path.lastIndexOf('/') + 1))
                .collect(Collectors.toList());

        try (Stream<Path> paths = Files.walk(Paths.get(BASE_DIRECTORY))) {
            List<File> files = paths
                    .filter(Files::isRegularFile)
                    .map(Path::toFile)
                    .collect(Collectors.toList());

            for (File file : files) {
                String fileName = file.getName();
                if (!dbFileNames.contains(fileName)) {
                    if (file.delete()) {
                        log.info(LocalDateTime.now() + " - 삭제된 파일: " + file.getAbsolutePath());
                    } else {
                        log.info(LocalDateTime.now() + " - 파일 삭제 실패: " + file.getAbsolutePath());
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
