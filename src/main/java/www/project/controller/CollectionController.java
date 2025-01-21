package www.project.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import www.project.domain.CollectionDTO;
import www.project.domain.UserVO;
import www.project.service.CollectionService;
import www.project.service.UserService;

import java.util.List;


@RequestMapping("/collection/*")
@RequiredArgsConstructor
@Slf4j
@Controller
public class CollectionController {
    private final CollectionService csv;
    private final UserService usv;

    @GetMapping("/list")
    public void collection(@RequestParam String currentId, @RequestParam long mediaId, Model model) {
        List<CollectionDTO> myList = csv.getList(currentId);
        UserVO uvo = usv.getInfo(currentId);
        String nickName = uvo.getNickname();

        model.addAttribute("nickName", nickName);
        model.addAttribute("myList", myList);
    }
    @PostMapping("/newList")
    public String newList(@RequestBody CollectionDTO collectionDTO) {
        int isOk = csv.newList(collectionDTO);
        if(isOk > 0){
            return "redirect:/collection/list";
        }
        return "fail";
    }
    @PostMapping("/{collectionId}/media/{mediaId}")
    @ResponseBody
    public String addMediaToCollectionList(@PathVariable String collectionId, @PathVariable long mediaId) {
        log.info("collectionId={}, mediaId={}", collectionId, mediaId);
        int isAdd = csv.addContent(collectionId, mediaId);
        if(isAdd > 0){
            return "true";
        }
        return "false";
    }
}
