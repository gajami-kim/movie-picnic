package www.project.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import www.project.domain.StarVO;
import www.project.domain.WishVO;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.*;


@Service
@RequiredArgsConstructor
@Slf4j
public class AnalysisService  {

    @Value("${tmdb_api_key}")
    public String tmdb_api_key;

    public Map<String, Integer> getAllGenres() throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.themoviedb.org/3/genre/movie/list?language=ko"))
                .header("accept", "application/json")
                .header("Authorization", "Bearer " + tmdb_api_key)
                .method("GET", HttpRequest.BodyPublishers.noBody())
                .build();
        HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

        JSONObject jsonObject = new JSONObject(response.body());
        JSONArray genresArray = jsonObject.getJSONArray("genres");
        Map<String, Integer> genreScores = new HashMap<>();
        for (int i = 0; i < genresArray.length(); i++) {
            JSONObject genreObject = genresArray.getJSONObject(i);
            genreScores.put(genreObject.getString("name"), 0);
        }
        return genreScores;
    }

    public List<String> getGenres(long mediaId) throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.themoviedb.org/3/movie/" + mediaId + "?language=ko-KR"))
                .header("accept", "application/json")
                .header("Authorization", "Bearer " + tmdb_api_key)
                .method("GET", HttpRequest.BodyPublishers.noBody())
                .build();
        HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

        JSONObject jsonObject = new JSONObject(response.body());
        JSONArray genresArray = jsonObject.getJSONArray("genres");
        List<String> genres = new ArrayList<>();
        for (int i = 0; i < genresArray.length(); i++) {
            JSONObject genreObject = genresArray.getJSONObject(i);
            genres.add(genreObject.getString("name"));
        }
        return genres;
    }

    public void updateGenreScores(List<StarVO> starList, List<WishVO> wishList, Map<String, Integer> genreScores) throws IOException, InterruptedException {
        Set<Long> wishMediaIds = new HashSet<>();
        if (wishList != null && !wishList.isEmpty()) {
            for (WishVO wish : wishList) {
                wishMediaIds.add(wish.getMediaId());
            }
        }
        if (starList != null && !starList.isEmpty()) {
            for (StarVO star : starList) {
                long mediaId = star.getMediaId();

                if (!wishMediaIds.contains(mediaId)) {
                    float score = star.getRate();
                    List<String> genres = getGenres(mediaId);

                    for (String genre : genres) {
                        genreScores.put(genre, genreScores.get(genre) + (int) (score * 10));
                    }
                }
            }
        }
        if (wishList != null && !wishList.isEmpty()) {
            for (WishVO wish : wishList) {
                long mediaId = wish.getMediaId();
                List<String> genres = getGenres(mediaId);

                for (String genre : genres) {
                    genreScores.put(genre, genreScores.get(genre) + 60);
                }
            }
        }
    }

    public List<Map.Entry<String, Integer>> getTopGenres(Map<String, Integer> genreScores) {
        List<Map.Entry<String, Integer>> sortedGenres = new ArrayList<>(genreScores.entrySet());
        sortedGenres.sort((entry1, entry2) -> entry2.getValue().compareTo(entry1.getValue()));
        return sortedGenres;
    }

    public List<Map.Entry<String, Integer>> analyzeUserPreferences(List<StarVO> starList, List<WishVO> wishList) throws IOException, InterruptedException {
        Map<String, Integer> genreScores = getAllGenres();
        updateGenreScores(starList, wishList, genreScores);
        return getTopGenres(genreScores);
    }
}
