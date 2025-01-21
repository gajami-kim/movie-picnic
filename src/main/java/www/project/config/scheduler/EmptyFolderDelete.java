package www.project.config.scheduler;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.stream.Stream;

@Component
@EnableScheduling
@Slf4j
public class EmptyFolderDelete {
    private static final String BASE_DIRECTORY = "C:/image/";

    @Scheduled(cron = "0 0 23 * * *")
    public void cleanUpEmptyFolders() {
        try (Stream<Path> paths = Files.walk(Paths.get(BASE_DIRECTORY))) {
            paths.filter(Files::isDirectory)
                    .map(Path::toFile)
                    .forEach(this::deleteIfEmpty);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void deleteIfEmpty(File folder) {
        File[] files = folder.listFiles();
        if (files != null && files.length == 0) {
            if (folder.delete()) {
                log.info(LocalDateTime.now() + " - 삭제된 폴더: " + folder.getAbsolutePath());
            } else {
                log.info(LocalDateTime.now() + " - 폴더 삭제 실패: " + folder.getAbsolutePath());
            }
        }
    }
}
